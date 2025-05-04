
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  } catch (error) {
    console.error("Invalid date format:", error);
    return dateString;
  }
}

export function openWhatsApp(phoneNumber: string): void {
  // Clean the phone number (remove spaces, dashes, etc.)
  const cleanNumber = phoneNumber.replace(/\D/g, "");
  
  // Check if the number starts with a country code
  const numberWithCode = cleanNumber.startsWith("+") || cleanNumber.startsWith("1") 
    ? cleanNumber 
    : `1${cleanNumber}`;
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${numberWithCode}`;
  
  // Open in new tab
  window.open(whatsappUrl, "_blank");
}
