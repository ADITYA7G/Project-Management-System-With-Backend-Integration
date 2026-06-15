export type Priority = "Low" | "Medium" | "High";
export type Category = "Work" | "Personal" | "Study" | "Health";

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  due_date: string;
  created_at: string;
  owner_id: number;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}
