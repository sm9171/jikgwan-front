import client from './client'
import { API_ENDPOINTS } from '@/constants/api'
import type { User } from '@/types/user'
import type { Meeting } from '@/types/meeting'
import type { ApiResponse } from '@/types/auth'

export const userApi = {
  getMe: async (): Promise<ApiResponse<User>> => {
    return await client.get(API_ENDPOINTS.USER.ME)
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    return await client.put(API_ENDPOINTS.USER.UPDATE_PROFILE, data)
  },

  getMyMeetings: async (): Promise<Meeting[]> => {
    return await client.get(API_ENDPOINTS.USER.MY_MEETINGS)
  },

  getMyApplications: async (): Promise<Meeting[]> => {
    return await client.get(API_ENDPOINTS.USER.MY_APPLICATIONS)
  },

  uploadProfileImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    // axios가 자동으로 Content-Type을 설정하도록 Content-Type 헤더 제거
    return await client.post('/users/profile/image', formData)
  },

  getUserById: async (userId: number): Promise<ApiResponse<User>> => {
    return await client.get(`/users/${userId}`)
  },
}
