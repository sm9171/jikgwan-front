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
 * 닉네임 검증 (2-20자)
 */
export const isValidNickname = (nickname: string): boolean => {
  return nickname.length >= 2 && nickname.length <= 20
}

/**
 * 빈 문자열 체크
 */
export const isEmpty = (value: string): boolean => {
  return !value || value.trim().length === 0
}

/**
 * 회원가입 폼 유효성 검사
 */
export const validateSignupForm = (data: {
  email: string
  password: string
  nickname: string
  gender?: string
  ageRange?: string
  supportingTeams?: string[]
  profileImage?: File | null
}): { [key: string]: string } => {
  const errors: { [key: string]: string } = {}

  if (!data.profileImage) {
    errors.profileImage = '프로필 이미지를 업로드해주세요'
  }

  if (!data.email) {
    errors.email = '이메일을 입력해주세요'
  } else if (!isValidEmail(data.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다'
  }

  if (!data.password) {
    errors.password = '비밀번호를 입력해주세요'
  } else if (!isValidPassword(data.password)) {
    errors.password = '비밀번호는 최소 8자 이상이어야 합니다'
  }

  if (!data.nickname) {
    errors.nickname = '닉네임을 입력해주세요'
  } else if (!isValidNickname(data.nickname)) {
    errors.nickname = '닉네임은 2-20자 사이여야 합니다'
  }

  if (!data.gender) {
    errors.gender = '성별을 선택해주세요'
  }

  if (!data.ageRange) {
    errors.ageRange = '연령대를 선택해주세요'
  }

  if (!data.supportingTeams || data.supportingTeams.length === 0) {
    errors.supportingTeams = '응원하는 구단을 최소 1개 이상 선택해주세요'
  }

  return errors
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
