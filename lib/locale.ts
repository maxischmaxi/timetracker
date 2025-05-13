"use client";

export function getLang(): string {
  if (typeof navigator === "undefined") return "en";

  if (navigator.languages !== undefined) {
    return navigator.languages[0];
  }

  return navigator.language;
}
