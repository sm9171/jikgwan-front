import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/apis/auth'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { ROUTES } from '@/constants/routes'
import { isValidEmail, isValidPassword, isValidNickname, isEmpty } from '@/utils/validation'
import { toast } from 'react-toastify'

export default function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
  })
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        if (isEmpty(value)) return '이메일을 입력해주세요.'
        if (!isValidEmail(value)) return '올바른 이메일 형식이 아닙니다.'
        return ''

      case 'password':
        if (isEmpty(value)) return '비밀번호를 입력해주세요.'
        if (!isValidPassword(value)) return '비밀번호는 8자 이상이어야 합니다.'
        return ''

      case 'passwordConfirm':
        if (isEmpty(value)) return '비밀번호 확인을 입력해주세요.'
        if (value !== formData.password) return '비밀번호가 일치하지 않습니다.'
        return ''

      case 'nickname':
        if (isEmpty(value)) return '닉네임을 입력해주세요.'
        if (!isValidNickname(value)) return '닉네임은 2-10자의 한글, 영문, 숫자만 가능합니다.'
        return ''

      default:
        return ''
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // 실시간 유효성 검사
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))

    // 비밀번호가 변경되면 비밀번호 확인도 재검사
    if (name === 'password' && formData.passwordConfirm) {
      const confirmError = formData.passwordConfirm !== value ? '비밀번호가 일치하지 않습니다.' : ''
      setErrors((prev) => ({ ...prev, passwordConfirm: confirmError }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors = {
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      passwordConfirm: validateField('passwordConfirm', formData.passwordConfirm),
      nickname: validateField('nickname', formData.nickname),
    }

    setErrors(newErrors)

    return !Object.values(newErrors).some((error) => error !== '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      await authApi.signup({
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
      })

      toast.success('회원가입이 완료되었습니다! 로그인해주세요.')
      navigate(ROUTES.LOGIN)
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error?.message || '회원가입에 실패했습니다. 다시 시도해주세요.'
      toast.error(errorMessage)
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
              helperText="영문, 숫자, 특수문자를 조합하여 8자 이상 입력해주세요."
              autoComplete="new-password"
            />

            <Input
              label="비밀번호 확인"
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력해주세요"
              error={errors.passwordConfirm}
              autoComplete="new-password"
            />

            <Input
              label="닉네임"
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="2-10자 이내로 입력해주세요"
              error={errors.nickname}
              helperText="한글, 영문, 숫자만 사용 가능합니다."
              autoComplete="username"
            />
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
