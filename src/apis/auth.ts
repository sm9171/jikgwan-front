import client from './client'
import { API_ENDPOINTS } from '@/constants/api'
import type { LoginRequest, SignupRequest, AuthResponse, RefreshTokenRequest, RefreshTokenResponse } from '@/types/auth'

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return await client.post(API_ENDPOINTS.AUTH.LOGIN, data)
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    return await client.post(API_ENDPOINTS.AUTH.SIGNUP, data)
  },

  logout: async (): Promise<void> => {
    await client.post(API_ENDPOINTS.AUTH.LOGOUT)
  },

  refresh: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    return await client.post(API_ENDPOINTS.AUTH.REFRESH, data)
  },
}
