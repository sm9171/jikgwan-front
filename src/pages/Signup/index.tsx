import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/apis/auth'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { ROUTES } from '@/constants/routes'
import { validateSignupForm } from '@/utils/validation'
import { toast } from 'react-toastify'
import type { Gender, AgeRange } from '@/types/auth'
import { TEAMS } from '@/constants/teams'

export default function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '',
    gender: '' as Gender | '',
    ageRange: '' as AgeRange | '',
    supportingTeams: [] as string[],
  })
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string>('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTeamToggle = (teamCode: string) => {
    setFormData((prev) => {
      const teams = prev.supportingTeams.includes(teamCode)
        ? prev.supportingTeams.filter((t) => t !== teamCode)
        : [...prev.supportingTeams, teamCode]
      return { ...prev, supportingTeams: teams }
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 이미지 파일 검증
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다')
      return
    }

    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('이미지 크기는 10MB 이하만 가능합니다')
      return
    }

    setProfileImage(file)

    // 미리보기 생성
    const reader = new FileReader()
    reader.onloadend = () => {
      setProfileImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 유효성 검사
    const validationErrors = validateSignupForm({
      ...formData,
      profileImage,
    })
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)
    try {
      const response = await authApi.signup({
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
        gender: formData.gender as Gender,
        ageRange: formData.ageRange as AgeRange,
        supportingTeams: formData.supportingTeams,
        profileImage: profileImage || undefined,
      })

      if ('success' in response && response.success) {
        toast.success('회원가입이 완료되었습니다! 로그인해주세요.')
        navigate(ROUTES.LOGIN)
      }
    } catch (error: any) {
      console.error('회원가입 에러:', error)

      // ErrorResponse 타입인 경우
      if (error?.errorCode) {
        if (error.fieldErrors) {
          setErrors(error.fieldErrors)
        }
        toast.error(error.message)
      } else {
        toast.error('회원가입에 실패했습니다. 다시 시도해주세요.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">⚾ 직관</h1>
          <p className="text-gray-600">야구 팬들의 직관 메이트 찾기</p>
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">회원가입</h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md">
          <div className="space-y-4">
            {/* 프로필 이미지 업로드 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                프로필 이미지 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                {profileImagePreview ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                    <img
                      src={profileImagePreview}
                      alt="프로필 미리보기"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <span className="text-gray-400 text-sm">이미지</span>
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="profile-image-input"
                  />
                  <label
                    htmlFor="profile-image-input"
                    className="inline-block px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium cursor-pointer transition-colors bg-white text-gray-700 hover:bg-gray-50"
                  >
                    이미지 선택
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG 파일 (최대 10MB)
                  </p>
                </div>
              </div>
              {errors.profileImage && (
                <p className="mt-1 text-sm text-red-500">{errors.profileImage}</p>
              )}
            </div>

            <Input
              label="이메일"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              error={errors.email}
              autoComplete="email"
            />

            <Input
              label="비밀번호"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="8자 이상 입력해주세요"
              error={errors.password}
              autoComplete="new-password"
            />

            <Input
              label="닉네임"
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="2-20자 이내로 입력해주세요"
              error={errors.nickname}
              autoComplete="username"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.gender ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">선택해주세요</option>
                <option value="MALE">남성</option>
                <option value="FEMALE">여성</option>
                <option value="OTHER">기타</option>
              </select>
              {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">연령대</label>
              <select
                name="ageRange"
                value={formData.ageRange}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.ageRange ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">선택해주세요</option>
                <option value="TEENS">10대</option>
                <option value="TWENTIES">20대</option>
                <option value="THIRTIES">30대</option>
                <option value="FORTIES">40대</option>
                <option value="FIFTIES_PLUS">50대 이상</option>
              </select>
              {errors.ageRange && <p className="mt-1 text-sm text-red-500">{errors.ageRange}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                응원하는 구단 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TEAMS.map((team) => (
                  <button
                    key={team.code}
                    type="button"
                    onClick={() => handleTeamToggle(team.code)}
                    className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                      formData.supportingTeams.includes(team.code)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {team.name}
                  </button>
                ))}
              </div>
              {formData.supportingTeams.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  선택된 구단: {formData.supportingTeams.map(code => TEAMS.find(t => t.code === code)?.name).join(', ')}
                </p>
              )}
              {errors.supportingTeams && <p className="mt-1 text-sm text-red-500">{errors.supportingTeams}</p>}
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
            가입하기
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">이미 계정이 있으신가요? </span>
            <button
              type="button"
              onClick={() => navigate(ROUTES.LOGIN)}
              className="text-primary font-medium hover:underline"
            >
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
