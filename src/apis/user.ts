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
}
