import { Offer } from "@/offers/v1/offers_pb";
import { Plain } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { differenceInMinutes, getYear } from "date-fns";
import { twMerge } from "tailwind-merge";

const GMAIL_BASE = "https://mail.google.com/mail";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type GmailLinkOptions = {
  subject: string;
  body: string;
  cc?: string;
  bcc?: string;
};

export function getGmailLink(email: string, options: GmailLinkOptions): string {
  const url = new URL(GMAIL_BASE);
  url.searchParams.set("view", "cm");
  url.searchParams.set("fs", "1");
  url.searchParams.set("to", email);
  url.searchParams.set("su", options.subject);
  url.searchParams.set("body", options.body);

  if (options?.cc) {
    url.searchParams.set("cc", options.cc);
  }
  if (options?.bcc) {
    url.searchParams.set("bcc", options.bcc);
  }

  return url.toString();
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

export function isRouteActive(path: string, currentPathname: string): boolean {
  if (currentPathname === "/" && path === "/") {
    return true;
  }
  if (currentPathname === path) {
    return true;
  }
  if (currentPathname.startsWith(path)) {
    return true;
  }
  return false;
}

export function getDifferenceBetweenTime(
  lhs: string | Date,
  rhs: string | Date,
): { hours: number; minutes: number } {
  const totalMinutes = differenceInMinutes(lhs, rhs);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return {
    hours,
    minutes,
  };
}

export function padWithZeros(
  input: string | number,
  minLength: number,
): string {
  let inputStr = input.toString();

  while (inputStr.length < minLength) {
    inputStr = "0" + inputStr;
  }

  return inputStr;
}

export function firstLetterUppercase(data: string): string {
  return `${data.charAt(0).toUpperCase()}${data.slice(1, data.length).toLowerCase()}`;
}

export function formatCurrency(
  amount: number,
  currency: "EUR" | "USD",
  locale: string = "de-DE",
): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    amount,
  );
}

export function getNextOfferNumber(offers: Plain<Offer>[]) {
  const currentYear = getYear(new Date());
  const latestOfferNo: {
    year: number;
    no: number;
  } = { year: 0, no: 0 };

  for (let i = 0; i < offers.length; i++) {
    const no = offers[i].offerNo;
    const match = no.match(/(\d{4})-(\d+)/);

    if (!match) continue;

    const year = parseInt(match[1]);
    const number = parseInt(match[2]);

    if (isNaN(year) || isNaN(number)) continue;

    if (year < latestOfferNo.year) continue;

    if (year > latestOfferNo.year) {
      latestOfferNo.year = year;
      latestOfferNo.no = number;
      continue;
    }

    if (number < latestOfferNo.no) continue;
    if (number === latestOfferNo.no) continue;
    latestOfferNo.no = number;
  }

  if (latestOfferNo.year < currentYear) {
    return `${currentYear}-001`;
  }
  return `${latestOfferNo.year}-${padWithZeros(latestOfferNo.no++, 3)}`;
}
