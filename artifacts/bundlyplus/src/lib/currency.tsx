import React, { createContext, useContext, useEffect, useState } from 'react';

export type Currency = 'USD' | 'LBP';

const LBP_PER_USD = 89500;

interface CurrencyContextValue {
  currency: Currency;
  toggleCurrency: () => void;
  format: (usd: number) => string;
  symbol: string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: 'USD',
  toggleCurrency: () => {},
  format: (usd: number) => `$${usd.toFixed(2)}`,
  symbol: '$',
});

function formatLBP(usd: number): string {
  const lbp = Math.round(usd * LBP_PER_USD);
  if (lbp >= 1_000_000) {
    const m = lbp / 1_000_000;
    return `${m.toFixed(m >= 10 ? 1 : 2)}M L.L.`;
  }
  return `${Math.round(lbp / 1000)}K L.L.`;
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('bundlyplus-currency') as Currency | null;
    return saved === 'LBP' || saved === 'USD' ? saved : 'USD';
  });

  useEffect(() => {
    localStorage.setItem('bundlyplus-currency', currency);
  }, [currency]);

  const toggleCurrency = () => setCurrency(prev => (prev === 'USD' ? 'LBP' : 'USD'));

  const format = (usd: number): string => {
    if (currency === 'LBP') return formatLBP(usd);
    return `$${usd.toFixed(2)}`;
  };

  const symbol = currency === 'USD' ? '$' : 'L.L.';

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, format, symbol }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
