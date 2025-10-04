import { User } from './user'
import { GameInfo } from './meeting'

export interface ChatRoom {
  id: number
  meetingId: number
  meetingInfo: MeetingInfo
  participants: User[]
  lastMessage?: Message
  unreadCount: number
  createdAt: string
}

export interface MeetingInfo {
  id: number
  gameInfo: GameInfo
}

export interface Message {
  id: number
  chatRoomId: number
  senderId: number
  content: string
  timestamp: string
  isRead: boolean
}

export interface CreateChatRoomRequest {
  meetingId: number
}

export interface CreateChatRoomResponse {
  chatRoomId: number
  participants: User[]
}

export interface WebSocketMessage {
  type: 'message' | 'read' | 'typing'
  content?: string
  timestamp?: string
}
