import { create } from 'zustand'
import { supabase } from '@/services/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  role: 'customer' | 'admin'
}

interface AuthState {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  initialized: boolean

  setUser: (user: User | null) => void
  setProfile: (profile: UserProfile | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  isAdmin: () => boolean
  isLoggedIn: () => boolean
  reset: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  session: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),

  isAdmin: () => get().profile?.role === 'admin',
  isLoggedIn: () => !!get().user,

  reset: () => set({
    user: null, profile: null, session: null,
  }),
}))