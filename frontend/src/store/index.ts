import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, User, AuthState } from '@/types';
import { API_BASE_URL } from '@/constants';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: number, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleTaskStatus: (id: number, completed: boolean) => Promise<void>;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      loading: false,
      error: null,
      fetchTasks: async () => {
        set({ loading: true });
        try {
          const token = localStorage.getItem('auth_token');
          const response = await fetch(`${API_BASE_URL}/tasks/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) throw new Error('Failed to fetch tasks');
          const data = await response.json();
          set({ tasks: data, loading: false });
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },
      addTask: async (taskData) => {
        try {
          const token = localStorage.getItem('auth_token');
          const response = await fetch(`${API_BASE_URL}/tasks/`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify(taskData),
          });
          if (!response.ok) throw new Error('Failed to add task');
          const newTask = await response.json();
          set((state) => ({ tasks: [...state.tasks, newTask] }));
        } catch (err: any) {
          set({ error: err.message });
        }
      },
      updateTask: async (id, taskData) => {
        try {
          const token = localStorage.getItem('auth_token');
          const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'PATCH',
            headers: { 
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify(taskData),
          });
          if (!response.ok) throw new Error('Failed to update task');
          const updatedTask = await response.json();
          set((state) => ({
            tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
          }));
        } catch (err: any) {
          set({ error: err.message });
        }
      },
      deleteTask: async (id) => {
        try {
          const token = localStorage.getItem('auth_token');
          const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) throw new Error('Failed to delete task');
          set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id),
          }));
        } catch (err: any) {
          set({ error: err.message });
        }
      },
      toggleTaskStatus: async (id, completed) => {
        await get().updateTask(id, { completed });
      },
    }),
    {
      name: 'task-storage',
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
);

interface AuthStore {
  authState: AuthState;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      authState: {
        token: null,
        user: null,
        isAuthenticated: false,
      },
      setAuth: (token, user) => {
        localStorage.setItem('auth_token', token);
        set({ authState: { token, user, isAuthenticated: true } });
      },
      logout: () => {
        localStorage.removeItem('auth_token');
        set({ authState: { token: null, user: null, isAuthenticated: false } });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
