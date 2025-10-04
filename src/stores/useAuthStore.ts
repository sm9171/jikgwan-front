import { create } from 'zustand'
import { authApi } from '@/apis/auth'
import { userApi } from '@/apis/user'
import type { User } from '@/types/user'

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  updateProfile: (data: Partial<User>) => Promise<void>
  checkProfileComplete: () => boolean
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),

  login: async (email, password) => {
    const response = await authApi.login({ email, password })
    localStorage.setItem('accessToken', response.accessToken)
    localStorage.setItem('refreshToken', response.refreshToken)
    set({
      user: response.user,
      accessToken: response.accessToken,
      isAuthenticated: true,
    })
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    set({ user: null, accessToken: null, isAuthenticated: false })
  },

  setUser: (user) => {
    set({ user })
  },

  updateProfile: async (data) => {
    const updatedUser = await userApi.updateProfile(data)
    set({ user: updatedUser })
  },

  checkProfileComplete: () => {
    const { user } = get()
    return !!(
      user?.profileImage &&
      user?.gender &&
      user?.ageGroup &&
      user?.favoriteTeams?.length &&
      user.favoriteTeams.length > 0
    )
  },

  initialize: async () => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        const user = await userApi.getMe()
        set({ user, isAuthenticated: true, accessToken: token })
      } catch (error) {
        // 토큰이 유효하지 않으면 로그아웃
        get().logout()
      }
    }
  },
}))
