import { useEffect, useState } from "react";

// Approximate FX rates (USD -> currency). Round-to-nice masks small drift.
// Update periodically if needed.
export type CurrencyInfo = {
  code: string;
  symbol: string;
  rate: number; // multiplier from USD
  symbolPosition?: "before" | "after";
};

export const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: { code: "USD", symbol: "$", rate: 1 },
  EUR: { code: "EUR", symbol: "€", rate: 0.92 },
  GBP: { code: "GBP", symbol: "£", rate: 0.79 },
  BDT: { code: "BDT", symbol: "৳", rate: 117 },
  INR: { code: "INR", symbol: "₹", rate: 83 },
  PKR: { code: "PKR", symbol: "₨", rate: 278 },
  CAD: { code: "CAD", symbol: "C$", rate: 1.36 },
  AUD: { code: "AUD", symbol: "A$", rate: 1.52 },
  NZD: { code: "NZD", symbol: "NZ$", rate: 1.63 },
  SGD: { code: "SGD", symbol: "S$", rate: 1.34 },
  MYR: { code: "MYR", symbol: "RM", rate: 4.7 },
  JPY: { code: "JPY", symbol: "¥", rate: 155 },
  CNY: { code: "CNY", symbol: "¥", rate: 7.2 },
  HKD: { code: "HKD", symbol: "HK$", rate: 7.8 },
  KRW: { code: "KRW", symbol: "₩", rate: 1370 },
  AED: { code: "AED", symbol: "AED ", rate: 3.67 },
  SAR: { code: "SAR", symbol: "SAR ", rate: 3.75 },
  QAR: { code: "QAR", symbol: "QAR ", rate: 3.64 },
  ZAR: { code: "ZAR", symbol: "R", rate: 18.5 },
  NGN: { code: "NGN", symbol: "₦", rate: 1500 },
  EGP: { code: "EGP", symbol: "E£", rate: 48 },
  TRY: { code: "TRY", symbol: "₺", rate: 34 },
  BRL: { code: "BRL", symbol: "R$", rate: 5.6 },
  MXN: { code: "MXN", symbol: "MX$", rate: 18 },
  CHF: { code: "CHF", symbol: "CHF ", rate: 0.88 },
  SEK: { code: "SEK", symbol: "kr", rate: 10.6 },
  NOK: { code: "NOK", symbol: "kr", rate: 10.8 },
  DKK: { code: "DKK", symbol: "kr", rate: 6.9 },
  PLN: { code: "PLN", symbol: "zł", rate: 4 },
  IDR: { code: "IDR", symbol: "Rp", rate: 16000 },
  PHP: { code: "PHP", symbol: "₱", rate: 58 },
  THB: { code: "THB", symbol: "฿", rate: 36 },
  VND: { code: "VND", symbol: "₫", rate: 25000 },
  LKR: { code: "LKR", symbol: "Rs", rate: 300 },
  NPR: { code: "NPR", symbol: "₨", rate: 133 },
};

// Country ISO -> currency code
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: "USD", GB: "GBP", BD: "BDT", IN: "INR", PK: "PKR",
  CA: "CAD", AU: "AUD", NZ: "NZD", SG: "SGD", MY: "MYR",
  JP: "JPY", CN: "CNY", HK: "HKD", KR: "KRW",
  AE: "AED", SA: "SAR", QA: "QAR", ZA: "ZAR", NG: "NGN", EG: "EGP",
  TR: "TRY", BR: "BRL", MX: "MXN", CH: "CHF",
  SE: "SEK", NO: "NOK", DK: "DKK", PL: "PLN",
  ID: "IDR", PH: "PHP", TH: "THB", VN: "VND", LK: "LKR", NP: "NPR",
  // Eurozone
  DE: "EUR", FR: "EUR", ES: "EUR", IT: "EUR", NL: "EUR", BE: "EUR",
  AT: "EUR", IE: "EUR", PT: "EUR", FI: "EUR", GR: "EUR", LU: "EUR",
  SK: "EUR", SI: "EUR", EE: "EUR", LV: "EUR", LT: "EUR", MT: "EUR",
  CY: "EUR", HR: "EUR",
};

// Round to a "nice" figure based on magnitude.
export function roundNice(n: number): number {
  if (n <= 0) return 0;
  if (n < 20) return Math.round(n);
  if (n < 100) return Math.round(n / 5) * 5;
  if (n < 1000) return Math.round(n / 10) * 10;
  if (n < 10000) return Math.round(n / 100) * 100;
  if (n < 100000) return Math.round(n / 500) * 500;
  return Math.round(n / 1000) * 1000;
}

export function convertPrice(usd: number, currency: CurrencyInfo): number {
  return roundNice(usd * currency.rate);
}

export function formatPrice(usd: number, currency: CurrencyInfo): string {
  const value = convertPrice(usd, currency);
  return `${currency.symbol}${value.toLocaleString("en-US")}`;
}

const CACHE_KEY = "db_geo_currency_v1";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24h

type CacheShape = { code: string; ts: number };

export function useGeoCurrency(): CurrencyInfo {
  const [currency, setCurrency] = useState<CurrencyInfo>(CURRENCIES.USD);

  useEffect(() => {
    let cancelled = false;

    // Cache first
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const cached: CacheShape = JSON.parse(raw);
        if (Date.now() - cached.ts < CACHE_TTL_MS && CURRENCIES[cached.code]) {
          setCurrency(CURRENCIES[cached.code]);
          return;
        }
      }
    } catch {
      /* ignore */
    }

    (async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) return;
        const data = await res.json();
        const country: string | undefined = data?.country_code || data?.country;
        const apiCurrency: string | undefined = data?.currency;
        const code =
          (apiCurrency && CURRENCIES[apiCurrency] && apiCurrency) ||
          (country && COUNTRY_TO_CURRENCY[country]) ||
          "USD";
        if (cancelled) return;
        setCurrency(CURRENCIES[code] || CURRENCIES.USD);
        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ code, ts: Date.now() } as CacheShape)
          );
        } catch {
          /* ignore */
        }
      } catch {
        /* keep USD fallback */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return currency;
}
