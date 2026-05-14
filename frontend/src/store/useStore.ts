import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AppState {
  user: User | null;
  token: string | null;
  theme: 'dark' | 'light';
  sidebarCollapsed: boolean;
  isDemoMode: boolean;
  showAuthModal: boolean;

  setUser: (user: User | null, token: string | null) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  logout: () => void;
  setShowAuthModal: (show: boolean) => void;
  exitDemoMode: (user: User, token: string) => void;
  enterDemoMode: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      theme: 'dark',
      sidebarCollapsed: false,
      isDemoMode: false,
      showAuthModal: false,

      setUser: (user, token) => set({ user, token, isDemoMode: false }),

      setTheme: (theme) => {
        if (theme === 'light') {
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.remove('light');
        }
        set({ theme });
      },

      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

      logout: () => set({ user: null, token: null, isDemoMode: true }),

      setShowAuthModal: (showAuthModal) => set({ showAuthModal }),

      exitDemoMode: (user, token) =>
        set({ user, token, isDemoMode: false, showAuthModal: false }),

      enterDemoMode: () =>
        set({ isDemoMode: true, user: null, token: null }),
    }),
    {
      name: 'support-management-storage',
      // Don't persist demo mode flags across sessions
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
