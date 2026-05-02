import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Sparkles,
  Search,
  Image as ImageIcon,
  Check,
  Loader2,
} from "lucide-react";
import { Product } from "@/types";
import { suggestProductFields, guessLogoUrl } from "@/lib/product-knowledge";
import { getLogoUrl, hasLogo } from "@/utils/logoUtils";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["Streaming", "Music & Others", "Software & AI", "Gaming", "Other"];
const ACCOUNT_TYPES = ["Private", "Shared"];
const DURATIONS = ["1 Month", "3 Months", "6 Months", "12 Months", "One-time"];

type FormState = Omit<Product, "id" | "created_at"> & { id?: string };

const emptyForm: FormState = {
  name: "",
  description: "",
  category: "Streaming",
  duration: "1 Month",
  features: [],
  image_url: "",
  hot: false,
  account_type: "Shared",
  price: 0,
  featured: false,
  out_of_stock: false,
};

export function ProductsTab() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return products;
    return products.filter(
      (p) => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q),
    );
  }, [products, search]);

  async function loadProducts() {
    setLoading(true);
    try {
      const snap = await getDocs(collection(firestore, "products"));
      const list = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as Product)
        .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      setProducts(list);
    } catch (e) {
      toast({ title: "Failed to load products", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function startNew() {
    setEditing({ ...emptyForm });
  }

  function startEdit(p: Product) {
    setEditing({ ...p });
  }

  function cancelEdit() {
    setEditing(null);
  }

  function autoFill() {
    if (!editing?.name?.trim()) {
      toast({ title: "Enter product name first", description: "Type the product name then click Auto-fill." });
      return;
    }
    const suggestion = suggestProductFields(editing.name);
    const logo = guessLogoUrl(editing.name);
    setEditing({
      ...editing,
      description: editing.description || suggestion.description,
      category: editing.category && editing.category !== "Streaming" ? editing.category : suggestion.category,
      account_type: suggestion.account_type,
      duration: suggestion.duration || editing.duration,
      features: editing.features?.length ? editing.features : suggestion.features,
      price: editing.price || suggestion.price,
      image_url: editing.image_url || logo,
    });
    toast({ title: "Auto-filled", description: "Review and adjust before saving." });
  }

  async function save() {
    if (!editing) return;
    if (!editing.name?.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    if (!editing.price || editing.price <= 0) {
      toast({ title: "Price must be greater than 0", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const payload: any = {
        name: editing.name.trim(),
        description: editing.description?.trim() || "",
        category: editing.category,
        duration: editing.duration,
        features: editing.features.filter((f) => f.trim()),
        image_url: editing.image_url?.trim() || "",
        hot: !!editing.hot,
        featured: !!editing.featured,
        out_of_stock: !!editing.out_of_stock,
        account_type: editing.account_type,
        price: Number(editing.price),
      };

      if (editing.id) {
        await updateDoc(doc(firestore, "products", editing.id), payload);
        toast({ title: "Updated", description: editing.name });
      } else {
        payload.created_at = Date.now();
        await addDoc(collection(firestore, "products"), payload);
        toast({ title: "Added", description: editing.name });
      }
      setEditing(null);
      await loadProducts();
    } catch (e) {
      toast({ title: "Save failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function remove(p: Product) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setDeletingId(p.id);
    try {
      await deleteDoc(doc(firestore, "products", p.id));
      toast({ title: "Deleted", description: p.name });
      await loadProducts();
    } catch (e) {
      toast({ title: "Delete failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {products.length} products — click any to edit, or add a new one with auto-fill.
        </p>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-transform self-start sm:self-auto"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name or category..."
          className="w-full pl-11 rtl:pl-4 rtl:pr-11 pr-4 py-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-white/10 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-900/40 text-slate-800 dark:text-slate-100"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mr-2" size={20} /> Loading products...
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((p) => {
            const logo = p.image_url || getLogoUrl(p.name);
            return (
              <motion.div
                key={p.id}
                layout
                className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:ring-2 hover:ring-pink-300/50 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-white shadow-sm ring-1 ring-slate-200 flex items-center justify-center p-2 shrink-0">
                  {logo ? (
                    <img
                      src={logo}
                      alt={p.name}
                      className="w-full h-full object-contain"
                      onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                    />
                  ) : (
                    <ImageIcon className="text-slate-300" size={20} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate">{p.name}</h3>
                    {p.hot && (
                      <span className="text-[10px] font-bold text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-1.5 py-0.5 rounded">
                        HOT
                      </span>
                    )}
                    {p.featured && (
                      <span className="text-[10px] font-bold text-pink-600 bg-pink-100 dark:bg-pink-900/30 px-1.5 py-0.5 rounded">
                        FEATURED
                      </span>
                    )}
                    {p.out_of_stock && (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-100 dark:bg-rose-900/30 px-1.5 py-0.5 rounded">
                        OUT OF STOCK
                      </span>
                    )}
                    {!p.image_url && !hasLogo(p.name) && (
                      <span
                        title="No logo file in public/logos/ matches this product. Add the SVG or set a custom image URL."
                        className="text-[10px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded"
                      >
                        NO LOGO
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {p.category} - {p.account_type} - {p.duration} - ${p.price}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
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
          {filtered.length === 0 && (
            <div className="text-center text-slate-400 py-12">No products match "{search}"</div>
          )}
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
              className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100">
                  {editing.id ? "Edit Product" : "New Product"}
                </h2>
                <button onClick={cancelEdit} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Product Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                      placeholder="e.g. Spotify Premium"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-pink-400 focus:outline-none text-slate-800 dark:text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={autoFill}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold shadow-md hover:scale-105 active:scale-95 transition-transform inline-flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Sparkles size={15} /> Auto-fill
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Type the name, then click Auto-fill to generate description, features, category, and logo.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    value={editing.description}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    rows={3}
                    placeholder="One-line description..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-pink-400 focus:outline-none text-slate-800 dark:text-slate-100 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Field label="Category">
                    <select
                      value={editing.category}
                      onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                      className={selectCls}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Account">
                    <select
                      value={editing.account_type}
                      onChange={(e) => setEditing({ ...editing, account_type: e.target.value })}
                      className={selectCls}
                    >
                      {ACCOUNT_TYPES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Duration">
                    <select
                      value={editing.duration}
                      onChange={(e) => setEditing({ ...editing, duration: e.target.value })}
                      className={selectCls}
                    >
                      {DURATIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Price (USD)">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editing.price || ""}
                      onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) || 0 })}
                      className={selectCls}
                    />
                  </Field>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Features (one per line)
                  </label>
                  <textarea
                    value={editing.features.join("\n")}
                    onChange={(e) => setEditing({ ...editing, features: e.target.value.split("\n") })}
                    rows={3}
                    placeholder={"4K HD streaming\nOffline downloads\n4 simultaneous screens"}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-pink-400 focus:outline-none text-slate-800 dark:text-slate-100 resize-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Logo URL
                  </label>
                  <div className="flex gap-2 items-start">
                    <div className="w-14 h-14 rounded-xl bg-white ring-1 ring-slate-200 flex items-center justify-center p-2 shrink-0 shadow-sm">
                      {editing.image_url || getLogoUrl(editing.name) ? (
                        <img
                          src={editing.image_url || getLogoUrl(editing.name)}
                          alt=""
                          className="w-full h-full object-contain"
                          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                        />
                      ) : (
                        <ImageIcon className="text-slate-300" size={20} />
                      )}
                    </div>
                    <input
                      value={editing.image_url || ""}
                      onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                      placeholder="https://logo.clearbit.com/example.com"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-pink-400 focus:outline-none text-slate-800 dark:text-slate-100 text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Toggle label="Hot" value={!!editing.hot} onChange={(v) => setEditing({ ...editing, hot: v })} />
                  <Toggle
                    label="Featured"
                    value={!!editing.featured}
                    onChange={(v) => setEditing({ ...editing, featured: v })}
                  />
                  <Toggle
                    label="Out of stock"
                    value={!!editing.out_of_stock}
                    onChange={(v) => setEditing({ ...editing, out_of_stock: v })}
                  />
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
                  {editing.id ? "Save changes" : "Create product"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const selectCls =
  "w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-pink-400 focus:outline-none text-slate-800 dark:text-slate-100 text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      {children}
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
