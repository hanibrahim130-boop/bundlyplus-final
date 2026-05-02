import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Sparkles,
  Loader2,
  Check,
  Gift,
  Power,
} from "lucide-react";
import { firestore } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export interface Promotion {
  id: string;
  title: string;
  bodyEn: string;
  bodyAr: string;
  startDate: number;
  endDate: number;
  discountLabel: string;
  ctaTextEn: string;
  ctaTextAr: string;
  ctaPath: string;
  bgGradient: string;
  enabled: boolean;
  created_at?: number;
}

type FormState = Omit<Promotion, "id" | "created_at"> & { id?: string };

// Keep these literal strings in source so Tailwind compiles every gradient class.
const GRADIENT_PRESETS: { label: string; value: string; preview: string }[] = [
  {
    label: "Rosé sunset",
    value: "from-pink-500 via-rose-500 to-orange-400",
    preview: "bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400",
  },
  {
    label: "Royal violet",
    value: "from-violet-500 via-purple-500 to-pink-500",
    preview: "bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500",
  },
  {
    label: "Mint lagoon",
    value: "from-emerald-500 via-teal-500 to-cyan-500",
    preview: "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500",
  },
  {
    label: "Desert glow",
    value: "from-amber-400 via-orange-500 to-red-500",
    preview: "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500",
  },
  {
    label: "Ocean depth",
    value: "from-blue-500 via-indigo-500 to-purple-500",
    preview: "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500",
  },
];

const emptyForm: FormState = {
  title: "",
  bodyEn: "",
  bodyAr: "",
  startDate: Date.now(),
  endDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
  discountLabel: "",
  ctaTextEn: "Shop the deal",
  ctaTextAr: "احصل على العرض",
  ctaPath: "/products",
  bgGradient: GRADIENT_PRESETS[0].value,
  enabled: true,
};

type PromotionStatus = "Live" | "Scheduled" | "Expired" | "Disabled";

function getStatus(p: Promotion, now = Date.now()): PromotionStatus {
  if (!p.enabled) return "Disabled";
  if (now < Number(p.startDate)) return "Scheduled";
  if (now > Number(p.endDate)) return "Expired";
  return "Live";
}

function statusClasses(status: PromotionStatus) {
  switch (status) {
    case "Live":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
    case "Scheduled":
      return "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300";
    case "Expired":
      return "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
    case "Disabled":
      return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300";
  }
}

// Convert epoch ms → "YYYY-MM-DDTHH:mm" for <input type="datetime-local"> in local time.
function toLocalInput(ms: number) {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(s: string): number {
  const ms = new Date(s).getTime();
  return Number.isFinite(ms) ? ms : Date.now();
}

function formatRange(start: number, end: number) {
  const fmt = (ms: number) =>
    new Date(ms).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  return `${fmt(start)} → ${fmt(end)}`;
}

const inputCls =
  "w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-pink-400 focus:outline-none text-slate-800 dark:text-slate-100 text-sm";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex-1 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
        value
          ? "bg-pink-50 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700 text-pink-700 dark:text-pink-300"
          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
      }`}
    >
      {value && <Check size={14} />}
      {label}
    </button>
  );
}

function PromotionPreview({ form }: { form: FormState }) {
  const gradient = form.bgGradient || GRADIENT_PRESETS[0].value;
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
        Live preview
      </p>
      <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
        <div className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-br ${gradient}`} />
        <div className="relative px-5 pb-5 pt-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-pink-600 shadow-md">
            <Gift size={20} />
          </div>
          {form.title && (
            <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-pink-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-pink-600 dark:bg-pink-500/10 dark:text-pink-300">
              <Sparkles size={10} />
              {form.title}
            </div>
          )}
          <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
            {form.discountLabel || "20% OFF"}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3">
            {form.bodyEn || "Add a description so shoppers know what the promotion is about."}
          </p>
          <div className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white dark:bg-white dark:text-slate-950">
            {form.ctaTextEn || "Shop the deal"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PromotionsTab() {
  const { toast } = useToast();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function loadPromotions() {
    setLoading(true);
    try {
      const snap = await getDocs(collection(firestore, "promotions"));
      const list = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as Promotion)
        .sort((a, b) => Number(b.startDate) - Number(a.startDate));
      setPromotions(list);
    } catch (e) {
      toast({ title: "Failed to load promotions", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPromotions();
  }, []);

  function startNew() {
    setEditing({ ...emptyForm });
  }

  function startEdit(p: Promotion) {
    const { id, created_at, ...rest } = p;
    setEditing({ id, ...rest });
  }

  function cancelEdit() {
    setEditing(null);
  }

  function autoFill() {
    if (!editing) return;
    const start = Date.now();
    const end = start + 14 * 24 * 60 * 60 * 1000;
    setEditing({
      ...editing,
      title: editing.title || "Limited time",
      discountLabel: editing.discountLabel || "15% OFF",
      bodyEn:
        editing.bodyEn ||
        "Save 15% on your next digital subscription order. Mention this offer when you checkout on WhatsApp.",
      bodyAr:
        editing.bodyAr ||
        "وفر 15% على طلبك التالي للاشتراكات الرقمية. اذكر هذا العرض عند إتمام الدفع على واتساب.",
      startDate: editing.startDate || start,
      endDate: editing.endDate && editing.endDate > start ? editing.endDate : end,
      ctaTextEn: editing.ctaTextEn || "Shop the deal",
      ctaTextAr: editing.ctaTextAr || "احصل على العرض",
      ctaPath: editing.ctaPath || "/products",
      bgGradient: editing.bgGradient || GRADIENT_PRESETS[0].value,
      enabled: editing.enabled,
    });
    toast({ title: "Auto-filled", description: "Review and adjust before saving." });
  }

  async function save() {
    if (!editing) return;
    if (!editing.title?.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    if (!editing.discountLabel?.trim()) {
      toast({ title: "Discount label is required", variant: "destructive" });
      return;
    }
    if (!editing.bodyEn?.trim() || !editing.bodyAr?.trim()) {
      toast({ title: "Both English and Arabic body text are required", variant: "destructive" });
      return;
    }
    if (!editing.endDate || editing.endDate <= editing.startDate) {
      toast({ title: "End date must be after start date", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: editing.title.trim(),
        bodyEn: editing.bodyEn.trim(),
        bodyAr: editing.bodyAr.trim(),
        startDate: Number(editing.startDate),
        endDate: Number(editing.endDate),
        discountLabel: editing.discountLabel.trim(),
        ctaTextEn: editing.ctaTextEn?.trim() || "Shop the deal",
        ctaTextAr: editing.ctaTextAr?.trim() || "احصل على العرض",
        ctaPath: editing.ctaPath?.trim() || "/products",
        bgGradient: editing.bgGradient || GRADIENT_PRESETS[0].value,
        enabled: !!editing.enabled,
      };

      if (editing.id) {
        await updateDoc(doc(firestore, "promotions", editing.id), payload);
        toast({ title: "Updated", description: editing.title });
      } else {
        await addDoc(collection(firestore, "promotions"), { ...payload, created_at: Date.now() });
        toast({ title: "Created", description: editing.title });
      }
      setEditing(null);
      await loadPromotions();
    } catch (e) {
      toast({ title: "Save failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function remove(p: Promotion) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    setDeletingId(p.id);
    try {
      await deleteDoc(doc(firestore, "promotions", p.id));
      toast({ title: "Deleted", description: p.title });
      await loadPromotions();
    } catch (e) {
      toast({ title: "Delete failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  }

  async function toggleEnabled(p: Promotion) {
    setTogglingId(p.id);
    try {
      await updateDoc(doc(firestore, "promotions", p.id), { enabled: !p.enabled });
      toast({ title: !p.enabled ? "Enabled" : "Disabled", description: p.title });
      await loadPromotions();
    } catch (e) {
      toast({ title: "Update failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setTogglingId(null);
    }
  }

  const sorted = useMemo(() => promotions, [promotions]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">
            Promotions
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {promotions.length} promotions — schedule, edit, or end the discount popup that appears on the homepage.
          </p>
        </div>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus size={18} /> New Promotion
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mr-2" size={20} /> Loading promotions...
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center text-slate-400 py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
          No promotions yet. Click <strong>New Promotion</strong> to schedule the first one.
        </div>
      ) : (
        <div className="grid gap-3">
          {sorted.map((p) => {
            const status = getStatus(p);
            return (
              <motion.div
                key={p.id}
                layout
                className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:ring-2 hover:ring-pink-300/50 transition-all"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${p.bgGradient || GRADIENT_PRESETS[0].value} flex items-center justify-center text-white shrink-0 shadow-md`}
                  aria-hidden="true"
                >
                  <Gift size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate">{p.title}</h3>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${statusClasses(status)}`}
                    >
                      {status}
                    </span>
                    <span className="text-[10px] font-bold text-pink-700 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-300 px-1.5 py-0.5 rounded">
                      {p.discountLabel}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                    {formatRange(Number(p.startDate), Number(p.endDate))}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => toggleEnabled(p)}
                    disabled={togglingId === p.id}
                    title={p.enabled ? "Disable" : "Enable"}
                    className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                      p.enabled
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {togglingId === p.id ? <Loader2 className="animate-spin" size={16} /> : <Power size={16} />}
                  </button>
                  <button
                    onClick={() => startEdit(p)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-pink-100 dark:hover:bg-pink-900/30 text-slate-600 dark:text-slate-300 hover:text-pink-600 transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => remove(p)}
                    disabled={deletingId === p.id}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-600 dark:text-slate-300 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    {deletingId === p.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
            onClick={cancelEdit}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100">
                  {editing.id ? "Edit Promotion" : "New Promotion"}
                </h2>
                <button onClick={cancelEdit} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
                <div className="space-y-4">
                  <Field label="Title (badge text)" hint="Shown above the discount label, e.g. 'May 1-2 only'.">
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        value={editing.title}
                        onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                        placeholder="e.g. May 1-2 only"
                        className={inputCls}
                      />
                      <button
                        type="button"
                        onClick={autoFill}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold shadow-md hover:scale-105 active:scale-95 transition-transform inline-flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Sparkles size={15} /> Auto-fill
                      </button>
                    </div>
                  </Field>

                  <Field label="Discount label" hint="The big headline shoppers see, e.g. '20% OFF'.">
                    <input
                      value={editing.discountLabel}
                      onChange={(e) => setEditing({ ...editing, discountLabel: e.target.value })}
                      placeholder="20% OFF"
                      className={inputCls}
                    />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Start date">
                      <input
                        type="datetime-local"
                        value={toLocalInput(Number(editing.startDate))}
                        onChange={(e) => setEditing({ ...editing, startDate: fromLocalInput(e.target.value) })}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="End date">
                      <input
                        type="datetime-local"
                        value={toLocalInput(Number(editing.endDate))}
                        onChange={(e) => setEditing({ ...editing, endDate: fromLocalInput(e.target.value) })}
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <Field label="Body (English)">
                    <textarea
                      value={editing.bodyEn}
                      onChange={(e) => setEditing({ ...editing, bodyEn: e.target.value })}
                      rows={3}
                      placeholder="Describe the promotion in English..."
                      className={`${inputCls} resize-none`}
                    />
                  </Field>

                  <Field label="Body (Arabic)" hint="Renders right-to-left for Arabic visitors.">
                    <textarea
                      value={editing.bodyAr}
                      onChange={(e) => setEditing({ ...editing, bodyAr: e.target.value })}
                      rows={3}
                      dir="rtl"
                      placeholder="اكتب وصف العرض بالعربية..."
                      className={`${inputCls} resize-none text-right`}
                    />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="CTA text (English)">
                      <input
                        value={editing.ctaTextEn}
                        onChange={(e) => setEditing({ ...editing, ctaTextEn: e.target.value })}
                        placeholder="Shop the deal"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="CTA text (Arabic)">
                      <input
                        value={editing.ctaTextAr}
                        onChange={(e) => setEditing({ ...editing, ctaTextAr: e.target.value })}
                        placeholder="احصل على العرض"
                        dir="rtl"
                        className={`${inputCls} text-right`}
                      />
                    </Field>
                  </div>

                  <Field label="CTA link" hint="Path to send shoppers when they click the button. Default: /products.">
                    <input
                      value={editing.ctaPath}
                      onChange={(e) => setEditing({ ...editing, ctaPath: e.target.value })}
                      placeholder="/products"
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Background gradient">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {GRADIENT_PRESETS.map((g) => {
                        const selected = editing.bgGradient === g.value;
                        return (
                          <button
                            key={g.value}
                            type="button"
                            onClick={() => setEditing({ ...editing, bgGradient: g.value })}
                            title={g.label}
                            className={`group relative h-14 rounded-xl ${g.preview} ring-2 transition-all ${
                              selected ? "ring-slate-900 dark:ring-white scale-[1.02]" : "ring-transparent hover:ring-slate-300 dark:hover:ring-slate-600"
                            }`}
                          >
                            {selected && (
                              <span className="absolute inset-0 flex items-center justify-center text-white">
                                <Check size={18} />
                              </span>
                            )}
                            <span className="sr-only">{g.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </Field>

                  <div className="flex gap-4">
                    <Toggle
                      label={editing.enabled ? "Enabled" : "Disabled"}
                      value={!!editing.enabled}
                      onChange={(v) => setEditing({ ...editing, enabled: v })}
                    />
                  </div>
                </div>

                <div className="lg:sticky lg:top-20 self-start">
                  <PromotionPreview form={editing} />
                  <p className="mt-3 text-[11px] text-slate-400 text-center">
                    Live status:{" "}
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${statusClasses(
                        getStatus({
                          id: editing.id || "_preview",
                          ...editing,
                        } as Promotion),
                      )}`}
                    >
                      {getStatus({ id: editing.id || "_preview", ...editing } as Promotion)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex gap-3 justify-end">
                <button
                  onClick={cancelEdit}
                  className="px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-transform inline-flex items-center gap-2 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  {editing.id ? "Save changes" : "Create promotion"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
