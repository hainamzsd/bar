import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns';
import { useUserContext } from "@/context/AuthContext";
import { toast, useToast } from "@/hooks/use-toast";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}export function formatTimeDifference(createdAt: string): string {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const timeDiff = now.getTime() - createdDate.getTime();

  // Convert milliseconds to seconds
  const seconds = Math.floor(timeDiff / 1000);

  // Convert to higher units
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} năm trước`;
  } else if (weeks > 0) {
    return `${weeks} tuần trước`;
  } else if (days > 0) {
    return `${days} ngày trước`;
  } else if (hours > 0) {
    return `${hours} tiếng trước`;
  } else if (minutes > 0) {
    return `${minutes} phút trước`;
  } else {
    return `${seconds} giây trước`;
  }
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

export function formatDate(dateString: any): string {
  

  if (!dateString) return "N/A"; // Handle missing or empty date values
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    // Handle invalid date
    return "Invalid date";
  }
  
  return format(date, 'dd-MM-yyyy');
}

export const extractHashtagsAndCleanContent = (
  content: string | undefined
): { content: string; tags: string[] } => {
  if (!content) return { content: "", tags: [] };

  const hashtags = content.match(/#[\w]+/g) || [];

  // Clean content by removing hashtags
  const cleanedContent = content.replace(/#[\w]+/g, "").trim();

  return {
    content: cleanedContent,
    tags: hashtags.map((tag) => tag.toLowerCase()),
  };
};
export const highlightHashtags = (text: string, hashtags: string[]) => {
  if (!text || !hashtags || hashtags.length === 0) return text;

  // Escape special characters in hashtags for regex
  const hashtagPattern = hashtags
    .map(tag => tag.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
    .join('|');
  const regex = new RegExp(`(${hashtagPattern})`, 'gi');

  // Replace matching hashtags with highlighted HTML
  return text.replace(regex, '<span class="text-blue-500">$1</span>');
};

type Role = 'customer' | 'staff';
type RoleTranslation = 'khách hàng' | 'nhân viên';
export function getRoleTranslation(role: Role): RoleTranslation {
  const translations: Record<Role, RoleTranslation> = {
      customer: 'khách hàng',
      staff: 'nhân viên',
  };

  return translations[role];
}
