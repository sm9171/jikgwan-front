import { User } from './user'

export interface Meeting {
  id: number
  gameInfo: GameInfo
  location: string
  maxParticipants: number
  description: string
  host: User
  chatRoomId?: number
  createdAt: string
  updatedAt: string
}

export interface GameInfo {
  id: number
  date: string
  time: string
  homeTeam: string
  awayTeam: string
  stadium: string
}

export interface CreateMeetingRequest {
  gameId: number
  location: string
  maxParticipants: number
  description: string
}

export interface UpdateMeetingRequest {
  location?: string
  maxParticipants?: number
  description?: string
}
