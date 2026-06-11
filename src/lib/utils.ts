// import { clsx, type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const WD = ["Su","Mo","Tu","We","Th","Fr","Sa"];

export function fmtDate(d: Date | null): string {
  if (!d) return '';
  return `${String(d.getDate()).padStart(2,'0')} ${MONTHS[d.getMonth()].slice(0,3)} ${d.getFullYear()}`;
}

export const fmt = (n: number | null | undefined, d = 0): string =>
  n == null ? '—' : n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

export const fmtMoney = (n: number | null | undefined): string =>
  fmt(n, n != null && n < 100 ? 2 : 0);
