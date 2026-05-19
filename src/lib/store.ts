import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Plan = 'free' | 'basic' | 'pro' | 'enterprise';
export type Role = 'admin' | 'employee' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  plan: Plan;
  businessName: string;
  avatar?: string;
  trialDaysLeft?: number;
  subscriptionExpiry?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  sidebarCollapsed: boolean;
  login: (user: User) => void;
  logout: () => void;
  toggleSidebar: () => void;
  upgradePlan: (plan: Plan) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      sidebarCollapsed: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      upgradePlan: (plan) =>
        set((s) => ({ user: s.user ? { ...s.user, plan } : null })),
    }),
    { name: 'erp-auth' }
  )
);

// Mock demo user
export const DEMO_USER: User = {
  id: 'u1',
  name: 'Arjun Sharma',
  email: 'admin@smarterp.in',
  role: 'admin',
  plan: 'pro',
  businessName: 'Sharma Medical Store',
  trialDaysLeft: 7,
  subscriptionExpiry: '2026-06-19',
};
