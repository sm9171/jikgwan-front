import { create } from 'zustand'
import type { ChatRoom, Message } from '@/types/chat'
import { gatheringApi } from '@/apis/gathering'

interface ChatState {
  chatRooms: ChatRoom[]
  currentChatRoom: ChatRoom | null
  setChatRooms: (rooms: ChatRoom[]) => void
  setCurrentChatRoom: (room: ChatRoom | null) => void
  addMessage: (chatRoomId: number, message: Message) => void
  markAsRead: (chatRoomId: number) => void
  updateLastMessage: (chatRoomId: number, message: Message) => void
  confirmParticipant: (gatheringId: number, participantUserId: number) => Promise<void>
  cancelParticipant: (gatheringId: number, participantUserId: number) => Promise<void>
}

export const useChatStore = create<ChatState>((set) => ({
  chatRooms: [],
  currentChatRoom: null,

  setChatRooms: (rooms) => set({ chatRooms: rooms }),

  setCurrentChatRoom: (room) => set({ currentChatRoom: room }),

  addMessage: (chatRoomId, message) =>
    set((state) => ({
      chatRooms: state.chatRooms.map((room) =>
        room.id === chatRoomId
          ? { ...room, lastMessage: message, unreadCount: room.unreadCount + 1 }
          : room
      ),
    })),

  markAsRead: (chatRoomId) =>
    set((state) => ({
      chatRooms: state.chatRooms.map((room) =>
        room.id === chatRoomId ? { ...room, unreadCount: 0 } : room
      ),
    })),

  updateLastMessage: (chatRoomId, message) =>
    set((state) => ({
      chatRooms: state.chatRooms.map((room) =>
        room.id === chatRoomId ? { ...room, lastMessage: message } : room
      ),
    })),

  confirmParticipant: async (gatheringId: number, participantUserId: number) => {
    try {
      await gatheringApi.confirmParticipant(gatheringId, participantUserId)
      // 참여자 확정 성공 후 처리 (필요시 chatRoom 상태 업데이트)
    } catch (error) {
      console.error('Failed to confirm participant:', error)
      throw error
    }
  },

  cancelParticipant: async (gatheringId: number, participantUserId: number) => {
    try {
      await gatheringApi.cancelParticipant(gatheringId, participantUserId)
      // 참여자 취소 성공 후 처리
    } catch (error) {
      console.error('Failed to cancel participant:', error)
      throw error
    }
  },
}))
