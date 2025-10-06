import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/apis/auth'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { ROUTES } from '@/constants/routes'
import { validateSignupForm } from '@/utils/validation'
import { toast } from 'react-toastify'
import type { Gender, AgeRange } from '@/types/auth'

export default function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '',
    gender: '' as Gender | '',
    ageRange: '' as AgeRange | '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 유효성 검사
    const validationErrors = validateSignupForm(formData)
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
