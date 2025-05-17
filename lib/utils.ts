import { clsx, type ClassValue } from "clsx";
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
