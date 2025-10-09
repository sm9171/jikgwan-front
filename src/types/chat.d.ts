import type { User } from './user'
import type { GameInfo } from './meeting'

export type { User, GameInfo }

export interface ChatRoom {
  id: number
  meetingId: number
  meetingInfo: MeetingInfo
  participants: User[]
  lastMessage?: Message
  unreadCount: number
  createdAt: string
  hostId?: number
  applicantId?: number
  isConfirmed?: boolean  // 참여자 확정 여부
}

export interface MeetingInfo {
  id: number
  gameInfo: GameInfo
  hostId: number
}

export interface Message {
  id: number
  chatRoomId: number
  senderId: number
  content: string
  status?: 'SENT' | 'DELIVERED' | 'READ'
  sentAt: string
}

export interface CreateChatRoomResponse {
  id: number
  gatheringId: number
  hostId: number
  applicantId: number
  status: 'ACTIVE' | 'CLOSED'
  createdAt: string
}

export interface WebSocketMessage {
  type: 'message' | 'read' | 'typing'
  content?: string
  timestamp?: string
}
