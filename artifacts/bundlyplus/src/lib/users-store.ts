import { firestore } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  Timestamp,
  arrayUnion,
} from "firebase/firestore";
import type { CartItem } from "@/types";

export interface UserDoc {
  id: string;
  email?: string;
  fullName?: string;
  phone?: string;
  preferredLang?: "en" | "ar";
  preferredCurrency?: "USD" | "LBP";
  wishlist?: string[];
  cart?: CartItem[];
  createdAt?: number;
  updatedAt?: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  type: "product" | "bundle";
  duration?: string;
}

export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

export interface Order {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  items: OrderItem[];
  totalPriceUsd: number;
  status: OrderStatus;
  notes?: string;
  whatsappOpened?: boolean;
  createdAt: number;
  updatedAt: number;
  deliveredAt?: number;
}

export type SubscriptionStatus = "active" | "expired" | "cancelled";

export interface Subscription {
  id: string;
  userId: string;
  orderId: string;
  productName: string;
  productId?: string;
  durationLabel: string;
  durationDays: number;
  startDate: number;
  expiryDate: number;
  status: SubscriptionStatus;
  reminderSentAt?: number;
  notes?: string;
  createdAt: number;
}

const REMINDER_WINDOW_DAYS = 3;

function durationToDays(duration?: string): number {
  if (!duration) return 30;
  const norm = duration.toLowerCase().replace(/\s+/g, "_");
  if (norm.includes("lifetime") || norm.includes("one-time") || norm.includes("one_time")) return 365 * 10;
  if (norm.includes("year") || norm.includes("annual")) return 365;
  // Match leading number (e.g. "3_months", "12_months", "6_month", "30_days")
  const m = norm.match(/^(\d+)/);
  if (m) {
    const n = parseInt(m[1], 10);
    if (norm.includes("month")) return n * 30;
    if (norm.includes("week")) return n * 7;
    if (norm.includes("day")) return n;
    return n * 30; // bare number → assume months
  }
  if (norm.includes("month")) return 30;
  if (norm.includes("week")) return 7;
  if (norm.includes("day")) return 1;
  return 30;
}

function tsToMs(value: any): number {
  if (!value) return 0;
  if (typeof value === "number") return value;
  if (value instanceof Timestamp) return value.toMillis();
  if (value?.toMillis) return value.toMillis();
  if (typeof value === "object" && "seconds" in value) return value.seconds * 1000;
  return 0;
}

function normalizeOrder(id: string, raw: any): Order {
  return {
    id,
    userId: raw.userId,
    userEmail: raw.userEmail,
    userName: raw.userName,
    userPhone: raw.userPhone,
    items: raw.items || [],
    totalPriceUsd: Number(raw.totalPriceUsd || 0),
    status: raw.status || "pending",
    notes: raw.notes || "",
    whatsappOpened: !!raw.whatsappOpened,
    createdAt: tsToMs(raw.createdAt),
    updatedAt: tsToMs(raw.updatedAt),
    deliveredAt: tsToMs(raw.deliveredAt),
  };
}

function normalizeSubscription(id: string, raw: any): Subscription {
  return {
    id,
    userId: raw.userId,
    orderId: raw.orderId,
    productName: raw.productName,
    productId: raw.productId,
    durationLabel: raw.durationLabel || "",
    durationDays: Number(raw.durationDays || 30),
    startDate: tsToMs(raw.startDate),
    expiryDate: tsToMs(raw.expiryDate),
    status: raw.status || "active",
    reminderSentAt: tsToMs(raw.reminderSentAt),
    notes: raw.notes || "",
    createdAt: tsToMs(raw.createdAt),
  };
}

export async function getOrCreateUser(
  clerkId: string,
  profile: { email?: string; fullName?: string; phone?: string },
): Promise<UserDoc> {
  const ref = doc(firestore, "users", clerkId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const existing = snap.data() as UserDoc;
    const updates: Record<string, any> = { updatedAt: serverTimestamp() };
    if (profile.email && profile.email !== existing.email) updates.email = profile.email;
    if (profile.fullName && profile.fullName !== existing.fullName) updates.fullName = profile.fullName;
    if (Object.keys(updates).length > 1) {
      await updateDoc(ref, updates);
    }
    return { ...existing, id: clerkId };
  }
  const data: UserDoc = {
    id: clerkId,
    email: profile.email || "",
    fullName: profile.fullName || "",
    phone: profile.phone || "",
    wishlist: [],
    cart: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await setDoc(ref, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return data;
}

export async function updateUserProfile(
  clerkId: string,
  patch: Partial<UserDoc>,
): Promise<void> {
  const ref = doc(firestore, "users", clerkId);
  const sanitized: Record<string, any> = { updatedAt: serverTimestamp() };
  for (const k of ["email", "fullName", "phone", "preferredLang", "preferredCurrency"] as const) {
    if (patch[k] !== undefined) sanitized[k] = patch[k];
  }
  await updateDoc(ref, sanitized);
}

export async function setUserWishlist(clerkId: string, ids: string[]): Promise<void> {
  await setDoc(
    doc(firestore, "users", clerkId),
    { wishlist: ids, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export async function setUserCart(clerkId: string, items: CartItem[]): Promise<void> {
  await setDoc(
    doc(firestore, "users", clerkId),
    { cart: items, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export async function getUserDoc(clerkId: string): Promise<UserDoc | null> {
  const snap = await getDoc(doc(firestore, "users", clerkId));
  if (!snap.exists()) return null;
  return { ...(snap.data() as UserDoc), id: clerkId };
}

export async function createOrder(
  args: {
    userId: string;
    userEmail?: string;
    userName?: string;
    userPhone?: string;
    items: OrderItem[];
    totalPriceUsd: number;
  },
): Promise<string> {
  const ref = await addDoc(collection(firestore, "orders"), {
    ...args,
    status: "pending" as OrderStatus,
    whatsappOpened: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function markOrderWhatsappOpened(orderId: string): Promise<void> {
  await updateDoc(doc(firestore, "orders", orderId), {
    whatsappOpened: true,
    updatedAt: serverTimestamp(),
  });
}

export async function listUserOrders(userId: string): Promise<Order[]> {
  const q = query(collection(firestore, "orders"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => normalizeOrder(d.id, d.data()))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function listAllOrders(): Promise<Order[]> {
  const snap = await getDocs(collection(firestore, "orders"));
  return snap.docs
    .map((d) => normalizeOrder(d.id, d.data()))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function setOrderStatus(orderId: string, status: OrderStatus, notes?: string): Promise<void> {
  const updates: Record<string, any> = { status, updatedAt: serverTimestamp() };
  if (notes !== undefined) updates.notes = notes;
  if (status === "delivered") updates.deliveredAt = serverTimestamp();
  await updateDoc(doc(firestore, "orders", orderId), updates);
}

export async function deliverOrderAndCreateSubscriptions(order: Order): Promise<string[]> {
  // Idempotency guard: re-read status from Firestore so concurrent admin clicks
  // (or a refresh after a partial run) don't create duplicate subscriptions.
  const orderRef = doc(firestore, "orders", order.id);
  const fresh = await getDoc(orderRef);
  if (fresh.exists() && fresh.data()?.status === "delivered") {
    const existing = await getDocs(
      query(collection(firestore, "subscriptions"), where("orderId", "==", order.id)),
    );
    return existing.docs.map((d) => d.id);
  }

  const ids: string[] = [];
  const now = Date.now();
  // Create subscriptions FIRST with deterministic IDs, then mark delivered.
  // Deterministic IDs make retries safe via setDoc-with-merge.
  for (let itemIdx = 0; itemIdx < order.items.length; itemIdx++) {
    const item = order.items[itemIdx];
    for (let i = 0; i < item.quantity; i++) {
      const days = durationToDays(item.duration);
      const expiry = now + days * 24 * 60 * 60 * 1000;
      const subId = `${order.id}_${itemIdx}_${i}`;
      const subRef = doc(firestore, "subscriptions", subId);
      const existingSub = await getDoc(subRef);
      if (!existingSub.exists()) {
        await setDoc(subRef, {
          userId: order.userId,
          orderId: order.id,
          productName: item.name,
          productId: item.productId,
          durationLabel: item.duration || "",
          durationDays: days,
          startDate: now,
          expiryDate: expiry,
          status: "active" as SubscriptionStatus,
          notes: "",
          createdAt: serverTimestamp(),
        });
      }
      ids.push(subId);
    }
  }
  await setOrderStatus(order.id, "delivered");
  return ids;
}

export async function listUserSubscriptions(userId: string): Promise<Subscription[]> {
  const q = query(collection(firestore, "subscriptions"), where("userId", "==", userId));
  const snap = await getDocs(q);
  const now = Date.now();
  return snap.docs
    .map((d) => normalizeSubscription(d.id, d.data()))
    .map((s) => (s.status === "active" && s.expiryDate < now ? { ...s, status: "expired" as SubscriptionStatus } : s))
    .sort((a, b) => b.expiryDate - a.expiryDate);
}

export async function listAllSubscriptions(): Promise<Subscription[]> {
  const snap = await getDocs(collection(firestore, "subscriptions"));
  const now = Date.now();
  return snap.docs
    .map((d) => normalizeSubscription(d.id, d.data()))
    .map((s) => (s.status === "active" && s.expiryDate < now ? { ...s, status: "expired" as SubscriptionStatus } : s))
    .sort((a, b) => a.expiryDate - b.expiryDate);
}

export async function listAllUsers(): Promise<UserDoc[]> {
  const snap = await getDocs(collection(firestore, "users"));
  return snap.docs.map((d) => ({ ...(d.data() as UserDoc), id: d.id }));
}

export async function markReminderSent(subId: string): Promise<void> {
  await updateDoc(doc(firestore, "subscriptions", subId), {
    reminderSentAt: serverTimestamp(),
  });
}

export interface PendingReminder {
  subscription: Subscription;
  user: UserDoc | null;
  daysUntilExpiry: number;
}

export async function listPendingReminders(): Promise<PendingReminder[]> {
  const subs = await listAllSubscriptions();
  const now = Date.now();
  const cutoff = now + REMINDER_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  const candidates = subs.filter(
    (s) =>
      s.status === "active" &&
      s.expiryDate > now &&
      s.expiryDate <= cutoff &&
      (!s.reminderSentAt || now - s.reminderSentAt > 24 * 60 * 60 * 1000),
  );
  const userIds = Array.from(new Set(candidates.map((s) => s.userId)));
  const users = await Promise.all(userIds.map((id) => getUserDoc(id)));
  const userMap = new Map(users.filter(Boolean).map((u) => [u!.id, u!]));
  return candidates.map((s) => ({
    subscription: s,
    user: userMap.get(s.userId) ?? null,
    daysUntilExpiry: Math.ceil((s.expiryDate - now) / (24 * 60 * 60 * 1000)),
  }));
}

export const REMINDER_WINDOW = REMINDER_WINDOW_DAYS;
