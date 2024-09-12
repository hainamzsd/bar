import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns';
import { useUserContext } from "@/context/AuthContext";
import { toast, useToast } from "@/hooks/use-toast";
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
  if (!dateString) return "N/A"; // Handle missing or empty date values
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    // Handle invalid date
    return "Invalid date";
  }
  
  return format(date, 'dd-MM-yyyy');
}
