import client from './client'
import { API_ENDPOINTS } from '@/constants/api'
import type { ChatRoom, Message, CreateChatRoomRequest, CreateChatRoomResponse } from '@/types/chat'
import type { PaginatedResponse } from '@/types/common'

export const chatApi = {
  createChatRoom: async (data: CreateChatRoomRequest): Promise<CreateChatRoomResponse> => {
    return await client.post(API_ENDPOINTS.CHAT.CREATE_ROOM, data)
  },

  getChatRooms: async (): Promise<ChatRoom[]> => {
    const response: { chatRooms: ChatRoom[] } = await client.get(API_ENDPOINTS.CHAT.ROOMS)
    return response.chatRooms
  },

  getChatMessages: async (
    roomId: number,
    params?: { page?: number; size?: number }
  ): Promise<PaginatedResponse<Message>> => {
    return await client.get(API_ENDPOINTS.CHAT.MESSAGES(roomId), {
      params: { page: params?.page || 0, size: params?.size || 50 },
    })
  },
}
