import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path: string | null | undefined) {
  if (!path) return undefined;

  if (path.startsWith("http")) return path;

  const imageBaseUrl = process.env.NEXT_PUBLIC_API_URL_IMAGE;

  return `${imageBaseUrl}${path}`;
}

export function getLocalizedText(
  locale: string,
  thText?: string | null,
  enText?: string | null
) {
  if (locale === "th") {
    return thText || enText || "";
  }
  return enText || thText || "";
}
