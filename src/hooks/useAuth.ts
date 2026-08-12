import { useEffect } from 'react'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/store/authStore'
import { getUserProfile } from '@/services/auth'

export function useAuthInit() {
  const {
    setUser, setProfile, setSession,
    setLoading, setInitialized,
    reset,
  } = useAuthStore()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        const profile = await getUserProfile(session.user.id)
        setProfile(profile)
      }

      setLoading(false)
      setInitialized(true)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          const profile = await getUserProfile(session.user.id)
          setProfile(profile)
        } else {
          reset()
        }

        setLoading(false)
        setInitialized(true)
      }
    )

    return () => subscription.unsubscribe()
  }, [])
}

export function useAuth() {
  return useAuthStore()
}