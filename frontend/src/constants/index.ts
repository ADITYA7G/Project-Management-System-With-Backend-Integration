export const PRIORITIES: { label: string; value: string; color: string }[] = [
  { label: "Low", value: "Low", color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  { label: "Medium", value: "Medium", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
  { label: "High", value: "High", color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
];

export const CATEGORIES: { label: string; value: string; color: string }[] = [
  { label: "Work", value: "Work", color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
  { label: "Personal", value: "Personal", color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  { label: "Study", value: "Study", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300" },
  { label: "Health", value: "Health", color: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300" },
];

export const API_BASE_URL = "http://localhost:8000";
