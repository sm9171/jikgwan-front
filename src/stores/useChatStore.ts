import { create } from 'zustand'
import type { ChatRoom, Message } from '@/types/chat'

interface ChatState {
  chatRooms: ChatRoom[]
  currentChatRoom: ChatRoom | null
  setChatRooms: (rooms: ChatRoom[]) => void
  setCurrentChatRoom: (room: ChatRoom | null) => void
  addMessage: (chatRoomId: number, message: Message) => void
  markAsRead: (chatRoomId: number) => void
  updateLastMessage: (chatRoomId: number, message: Message) => void
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
}))
