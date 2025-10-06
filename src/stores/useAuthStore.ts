import { create } from 'zustand'
import { authApi } from '@/apis/auth'
import { userApi } from '@/apis/user'
import type { User } from '@/types/user'

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isInitialized: boolean
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
  isInitialized: false,

  login: async (email, password) => {
    const response = await authApi.login({ email, password })
    console.log('로그인 응답:', response)

    if ('success' in response && response.success) {
      const { accessToken, refreshToken } = response.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      // 사용자 정보는 별도로 조회
      try {
        console.log('사용자 정보 조회 시작...')
        const userResponse = await userApi.getMe()
        console.log('사용자 정보 응답:', userResponse)

        // ApiResponse 형식 처리
        const user = 'success' in userResponse && userResponse.success
          ? userResponse.data
          : userResponse

        set({
          user,
          accessToken,
          isAuthenticated: true,
        })
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error)
        // 사용자 정보 조회 실패 시 로그아웃
        get().logout()
        throw error
      }
    } else if ('success' in response && !response.success) {
      throw new Error(response.message)
    }
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
      user?.profile.profileImageUrl &&
      user?.profile.gender &&
      user?.profile.ageRange &&
      user?.profile.teams?.length &&
      user.profile.teams.length > 0
    )
  },

  initialize: async () => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        console.log('초기화: 사용자 정보 조회 시작...')
        const userResponse = await userApi.getMe()
        console.log('초기화: 사용자 정보 응답:', userResponse)

        const user = 'success' in userResponse && userResponse.success
          ? userResponse.data
          : userResponse

        set({ user, isAuthenticated: true, accessToken: token, isInitialized: true })
      } catch (error) {
        console.error('초기화: 사용자 정보 조회 실패:', error)
        // 토큰이 유효하지 않으면 로그아웃
        get().logout()
        set({ isInitialized: true })
      }
    } else {
      set({ isInitialized: true })
    }
  },
}))
