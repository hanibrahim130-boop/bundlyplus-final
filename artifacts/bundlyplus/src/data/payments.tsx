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

const CardIcon = (
  <div className="w-10 h-10 rounded-xl bg-[#6366f1] flex items-center justify-center mb-2 shadow-sm text-white">
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  </div>
);

const MoneyGramIcon = (
  <div className="w-10 h-10 rounded-xl bg-[#ff6600] flex items-center justify-center mb-2 shadow-sm text-white font-bold text-[10px] tracking-tight">
    <span className="text-center leading-tight">MG</span>
  </div>
);

const UsdIcon = (
  <div className="w-10 h-10 rounded-xl bg-[#00d632] flex items-center justify-center mb-2 shadow-sm text-white">
    <DollarSign className="w-6 h-6" strokeWidth={3.5} />
  </div>
);



export const PAYMENT_METHODS_EN: PaymentMethod[] = [
  { name: 'USD / CARD', sub: 'Visa / Mastercard', color: 'from-indigo-500 to-purple-600', icon: CardIcon },
  { name: 'Whish Money', sub: 'Instant transfer', color: 'from-rose-500 to-red-600', icon: WhishIcon },
  { name: 'OMT', sub: 'Cash pickup', color: 'from-yellow-400 to-amber-500', icon: OmtIcon },
  { name: 'Bank Transfer', sub: 'Wire transfer', color: 'from-yellow-300 to-yellow-500', icon: BobIcon },
  { name: 'MoneyGram', sub: 'Global money transfer', color: 'from-orange-500 to-red-500', icon: MoneyGramIcon },
];

export const PAYMENT_METHODS_AR: PaymentMethod[] = [
  { ...PAYMENT_METHODS_EN[0], name: 'USD / بطاقة', sub: 'Visa / Mastercard' },
  { ...PAYMENT_METHODS_EN[1], name: 'ويش موني', sub: 'تحويل فوري' },
  { ...PAYMENT_METHODS_EN[2], name: 'OMT', sub: 'استلام نقدي' },
  { ...PAYMENT_METHODS_EN[3], name: 'تحويل بنكي', sub: 'حوالة بنكية' },
  { ...PAYMENT_METHODS_EN[4], name: 'MoneyGram', sub: 'تحويل عالمي' },
];
