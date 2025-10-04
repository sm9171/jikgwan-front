/**
 * 이메일 형식 검증
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 비밀번호 검증 (최소 8자 이상)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8
}

/**
 * 닉네임 검증 (2-10자, 한글/영문/숫자)
 */
export const isValidNickname = (nickname: string): boolean => {
  const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,10}$/
  return nicknameRegex.test(nickname)
}

/**
 * 빈 문자열 체크
 */
export const isEmpty = (value: string): boolean => {
  return !value || value.trim().length === 0
}

/**
 * 프로필 완성도 체크
 */
export const isProfileComplete = (profile: {
  profileImage?: string
  gender?: string
  ageGroup?: string
  favoriteTeams?: string[]
}): boolean => {
  return !!(
    profile.profileImage &&
    profile.gender &&
    profile.ageGroup &&
    profile.favoriteTeams &&
    profile.favoriteTeams.length > 0
  )
}
