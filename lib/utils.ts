import { clsx, type ClassValue } from "clsx";
import { differenceInMinutes } from "date-fns";
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

export function formatTime(time: number): string {
  if (time < 10) {
    return "0" + time;
  }
  return time.toString();
}
