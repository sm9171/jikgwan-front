import { Gender, AgeRange } from './auth'
import { TeamCode, StadiumCode } from '@/constants/teams'

// 모임 호스트 정보
export interface GatheringHost {
  id: number
  nickname: string
  profileImageUrl: string | null
  gender: Gender
  ageRange: AgeRange
}

// 경기 정보
export interface GameInfo {
  gameDateTime: string  // ISO 8601 format
  homeTeam: TeamCode
  awayTeam: TeamCode
  stadium: StadiumCode
}

// 모임 참여자 (간단한 정보만)
export interface GatheringParticipant {
  userId: number
  profileImageUrl: string | null
}

// 모임 (Gathering)
export interface Gathering {
  id: number
  gameInfo: GameInfo
  meetingPlace: string
  maxParticipants: number
  description: string
  host: GatheringHost
  participants: GatheringParticipant[]  // 확정된 참여자 목록
  chatRoomId?: number  // 현재 사용자와의 채팅방 ID (있는 경우)
  createdAt: string
}

// 모임 생성 요청
export interface CreateGatheringRequest {
  gameDateTime: string
  homeTeam: TeamCode
  awayTeam: TeamCode
  stadium: StadiumCode
  meetingPlace: string
  maxParticipants: number
  description: string
}

// 페이지네이션 응답
export interface PageableResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      sorted: boolean
      unsorted: boolean
      empty: boolean
    }
  }
  totalPages: number
  totalElements: number
  last: boolean
  first: boolean
  size: number
  number: number
  numberOfElements: number
  empty: boolean
}

// 하위 호환성을 위한 기존 타입 (제거 예정)
export type Meeting = Gathering
export type CreateMeetingRequest = CreateGatheringRequest
