export interface User {
  id: number
  email: string
  nickname: string
  gender?: Gender
  ageGroup?: AgeGroup
  favoriteTeams?: string[]
  profileImage?: string
  createdAt: string
}

export type Gender = 'male' | 'female' | 'other'
export type AgeGroup = '10s' | '20s' | '30s' | '40s' | '50+'
