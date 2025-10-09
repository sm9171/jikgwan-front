export type Gender = 'MALE' | 'FEMALE' | 'OTHER'
export type AgeRange = 'TEENS' | 'TWENTIES' | 'THIRTIES' | 'FORTIES' | 'FIFTIES_PLUS'

export interface Profile {
  profileImageUrl: string | null
  gender: Gender
  ageRange: AgeRange
  teams: string[]
}

export interface User {
  id: number
  email: string
  nickname: string
  profile: Profile
}

// 확정된 참여자 (참여 시간 포함)
export interface ConfirmedParticipant {
  userId: number  // 백엔드에서 id가 아닌 userId로 반환
  nickname: string
  profile: Profile
  joinedAt: string  // 백엔드에서 confirmedAt이 아닌 joinedAt으로 반환
}
