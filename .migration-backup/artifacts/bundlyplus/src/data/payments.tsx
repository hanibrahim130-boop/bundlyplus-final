import React from 'react';
import { DollarSign } from 'lucide-react';

export interface PaymentMethod {
  name: string;
  sub: string;
  /** tailwind gradient classes used for the card hover accent */
  color: string;
  icon: React.ReactNode;
  /** optional phone number shown below the card */
  phone?: string;
  /** optional QR code image path */
  qr?: string;
  /** optional wallet addresses */
  wallets?: { label: string; address: string }[];
}

const WhishIcon = (
  <div className="w-10 h-10 rounded-xl bg-[#e6184c] flex items-center justify-center mb-2 shadow-sm overflow-hidden">
    <svg viewBox="0 0 40 40" className="w-8 h-8" aria-hidden="true">
      <path d="M3 16 L18 16" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M1 20 L20 20" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M3 24 L18 24" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M16 13 L20 28 L24 19 L28 28 L32 13"
        stroke="#fff"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  </div>
);

const OmtIcon = (
  <div className="w-10 h-10 rounded-xl bg-[#fcd500] flex items-center justify-center mb-2 shadow-sm text-[#1a1a1a] font-black italic tracking-tighter text-[15px]">
    OMT
  </div>
);

const BobIcon = (
  <div className="w-10 h-10 rounded-xl bg-[#fed000] flex items-center justify-center mb-2 shadow-sm text-black font-black tracking-tight text-xs gap-[1px]">
    <span className="text-base">B</span>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3.5 h-3.5"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
    <span className="text-base">B</span>
  </div>
);

const UsdIcon = (
  <div className="w-10 h-10 rounded-xl bg-[#00d632] flex items-center justify-center mb-2 shadow-sm text-white">
    <DollarSign className="w-6 h-6" strokeWidth={3.5} />
  </div>
);

const UsdtIcon = (
  <div className="w-10 h-10 rounded-xl bg-[#26a17b] flex items-center justify-center mb-2 shadow-sm text-white">
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M13.435 12.063c3.08-.22 5.285-1.127 5.285-2.203 0-1.107-2.317-2.046-5.556-2.23v-2.34h3.693v-3.23H7.07v3.23h3.693v2.336c-3.178.192-5.438 1.116-5.438 2.204 0 1.082 2.221 1.996 5.32 2.215v6.945h2.79v-6.927zm-2.67-4.148c2.915 0 5.279.794 5.279 1.77 0 .978-2.364 1.772-5.28 1.772-2.914 0-5.278-.794-5.278-1.772 0-.976 2.364-1.77 5.279-1.77z" />
    </svg>
  </div>
);

export const PAYMENT_METHODS_EN: PaymentMethod[] = [
  { name: 'Whish Money', sub: 'Instant transfer', color: 'from-rose-500 to-red-600', icon: WhishIcon, phone: '+961 76 171 003', qr: '/images/IMG_3601.JPG.jpeg' },
  { name: 'OMT', sub: 'Cash pickup', color: 'from-yellow-400 to-amber-500', icon: OmtIcon, phone: '+961 76 171 003' },
  { name: 'BoB Finance', sub: 'Bank transfer', color: 'from-yellow-300 to-yellow-500', icon: BobIcon },
  { name: 'USD Cash', sub: 'Beirut delivery', color: 'from-emerald-400 to-green-500', icon: UsdIcon },
  { name: 'USDT / Crypto', sub: 'TRC20 / BEP20', color: 'from-teal-400 to-emerald-500', icon: UsdtIcon, wallets: [
    { label: 'USDT BEP20', address: '0x43cf4bded47c1309df53131a358db503a73de560' },
    { label: 'USDT TRON', address: 'TBV1YtEANSAhsRZmU8MZwo8GnXPEbBd4oD' },
  ] },
];

export const PAYMENT_METHODS_AR: PaymentMethod[] = [
  { ...PAYMENT_METHODS_EN[0], name: 'ويش موني', sub: 'تحويل فوري' },
  { ...PAYMENT_METHODS_EN[1], name: 'OMT', sub: 'استلام نقدي' },
  { ...PAYMENT_METHODS_EN[2], name: 'BoB Finance', sub: 'تحويل بنكي' },
  { ...PAYMENT_METHODS_EN[3], name: 'دولار كاش', sub: 'توصيل بيروت' },
  { ...PAYMENT_METHODS_EN[4], name: 'USDT / كريبتو', sub: 'TRC20 / BEP20' },
];
