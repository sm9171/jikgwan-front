import client from './client'
import { API_ENDPOINTS } from '@/constants/api'
import type {
  LoginRequest,
  SignupRequest,
  TokenData,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ApiResponse
} from '@/types/auth'
import type { User } from '@/types/user'

export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<TokenData>> => {
    return await client.post(API_ENDPOINTS.AUTH.LOGIN, data)
  },

  signup: async (data: SignupRequest): Promise<ApiResponse<User>> => {
    const formData = new FormData()

    // 기본 정보 추가
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('nickname', data.nickname)
    formData.append('gender', data.gender)
    formData.append('ageRange', data.ageRange)

    // 배열 데이터 추가 (각 팀을 개별적으로 append)
    data.supportingTeams.forEach(team => {
      formData.append('supportingTeams', team)
    })

    // 이미지 파일 추가 (있는 경우만)
    if (data.profileImage) {
      formData.append('profileImage', data.profileImage)
    }

    return await client.post(API_ENDPOINTS.AUTH.SIGNUP, formData)
  },

  logout: async (): Promise<void> => {
    await client.post(API_ENDPOINTS.AUTH.LOGOUT)
  },

  refresh: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    return await client.post(API_ENDPOINTS.AUTH.REFRESH, data)
  },
}
