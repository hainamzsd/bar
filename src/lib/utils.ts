import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const genderToString = (gender: boolean | undefined) => {
  if (gender === true) return "Nam";
  if (gender === false) return "Nữ";
  return "Họ"; // For null or any other case
};

export const stringToGender = (value: string): boolean | undefined => {
  if (value === "Male") return true;
  if (value === "Female") return false;
  return undefined; // For "Other"
};

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'dd-MM-yyyy');
}