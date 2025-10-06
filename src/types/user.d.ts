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
