import React, { createContext, useContext } from 'react';
import { ANALYTICS_EVENTS, trackEvent } from './analytics';

export type Currency = 'USD';

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

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const format = (usd: number): string => `$${usd.toFixed(2)}`;
  const symbol = '$';

  return (
    <CurrencyContext.Provider value={{ currency: 'USD', toggleCurrency: () => {}, format, symbol }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
