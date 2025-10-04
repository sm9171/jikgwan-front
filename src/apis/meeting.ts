import client from './client'
import { API_ENDPOINTS } from '@/constants/api'
import type { Meeting, CreateMeetingRequest, UpdateMeetingRequest, GameInfo } from '@/types/meeting'
import type { PaginatedResponse } from '@/types/common'

export const meetingApi = {
  fetchMeetings: async (params: { page: number; team?: string; size?: number }): Promise<PaginatedResponse<Meeting>> => {
    return await client.get(API_ENDPOINTS.MEETINGS.LIST, {
      params: { ...params, size: params.size || 10 },
    })
  },

  fetchMeetingDetail: async (id: number): Promise<Meeting> => {
    return await client.get(API_ENDPOINTS.MEETINGS.DETAIL(id))
  },

  createMeeting: async (data: CreateMeetingRequest): Promise<Meeting> => {
    return await client.post(API_ENDPOINTS.MEETINGS.CREATE, data)
  },

  updateMeeting: async (id: number, data: UpdateMeetingRequest): Promise<Meeting> => {
    return await client.put(API_ENDPOINTS.MEETINGS.UPDATE(id), data)
  },

  deleteMeeting: async (id: number): Promise<void> => {
    await client.delete(API_ENDPOINTS.MEETINGS.DELETE(id))
  },
}

export const gameApi = {
  fetchGames: async (params?: { date?: string; team?: string }): Promise<GameInfo[]> => {
    const response: { games: GameInfo[] } = await client.get(API_ENDPOINTS.GAMES.LIST, {
      params,
    })
    return response.games
  },
}
