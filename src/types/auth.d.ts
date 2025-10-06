import { User } from './user'

// 성별
export type Gender = 'MALE' | 'FEMALE' | 'OTHER'

// 연령대
export type AgeRange = 'TEENS' | 'TWENTIES' | 'THIRTIES' | 'FORTIES' | 'FIFTIES_PLUS'

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  nickname: string
  gender: Gender
  ageRange: AgeRange
  supportingTeams: string[]  // 응원 구단 배열
  profileImage?: File  // 프로필 이미지 파일 (선택사항)
}

export interface TokenData {
  accessToken: string
  refreshToken: string
  tokenType: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
}

// 필드 에러
export interface FieldErrors {
  [key: string]: string
}

// 에러 응답
export interface ErrorResponse {
  success: false
  errorCode: string
  message: string
  fieldErrors?: FieldErrors | null
}

// API 응답 (성공)
export interface SuccessResponse<T> {
  success: true
  data: T
  error: null
}

// API 응답 (통합)
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse
