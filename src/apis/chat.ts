import client from './client'
import { API_ENDPOINTS } from '@/constants/api'
import type { ChatRoom, Message, CreateChatRoomResponse } from '@/types/chat'
import type { PaginatedResponse } from '@/types/common'

export const chatApi = {
  createChatRoom: async (gatheringId: number) => {
    return await client.post(API_ENDPOINTS.CHAT.CREATE_ROOM, null, {
      params: { gatheringId }
    })
  },

  getChatRooms: async () => {
    return await client.get(API_ENDPOINTS.CHAT.ROOMS)
  },

  getChatRoom: async (roomId: number) => {
    return await client.get(`${API_ENDPOINTS.CHAT.ROOMS}/${roomId}`)
  },

  getMessages: async (
    roomId: number,
    params?: { page?: number; size?: number }
  ) => {
    return await client.get(API_ENDPOINTS.CHAT.MESSAGES(roomId), {
      params: { page: params?.page || 0, size: params?.size || 50 },
    })
  },

  getChatMessages: async (
    roomId: number,
    params?: { page?: number; size?: number }
  ): Promise<PaginatedResponse<Message>> => {
    return await client.get(API_ENDPOINTS.CHAT.MESSAGES(roomId), {
      params: { page: params?.page || 0, size: params?.size || 50 },
    })
  },

  // Send message via HTTP (fallback when WebSocket is disconnected)
  sendMessage: async (roomId: number, content: string) => {
    return await client.post(API_ENDPOINTS.CHAT.MESSAGES(roomId), {
      content
    })
  },

  // Mark messages as read
  markAsRead: async (roomId: number) => {
    return await client.post(`${API_ENDPOINTS.CHAT.ROOMS}/${roomId}/read`)
  },

  // Get unread count
  getUnreadCount: async (roomId: number) => {
    return await client.get(`${API_ENDPOINTS.CHAT.ROOMS}/${roomId}/unread-count`)
  },
}
