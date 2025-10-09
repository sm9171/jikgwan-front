import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { gatheringApi } from '@/apis/gathering'
import { TEAMS, STADIUMS } from '@/constants/teams'
import type { TeamCode, StadiumCode } from '@/constants/teams'
import { toast } from 'react-toastify'

export default function GatheringCreate() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    gameDateTime: '',
    homeTeam: '' as TeamCode | '',
    awayTeam: '' as TeamCode | '',
    stadium: '' as StadiumCode | '',
    meetingPlace: '',
    maxParticipants: 2,
    description: '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const createMutation = useMutation({
    mutationFn: gatheringApi.createGathering,
    onSuccess: (response) => {
      if ('success' in response && response.success) {
        toast.success('모임이 생성되었습니다!')
        // 모임 목록 쿼리 무효화 (홈 화면에서 새로고침되도록)
        queryClient.invalidateQueries({ queryKey: ['gatherings'] })
        navigate(`/gatherings/${response.data.id}`)
      }
    },
    onError: (error: any) => {
      console.error('모임 생성 에러:', error)
      if (error?.errorCode) {
        if (error.fieldErrors) {
          setErrors(error.fieldErrors)
        }
        toast.error(error.message)
      } else {
        toast.error('모임 생성에 실패했습니다.')
      }
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.gameDateTime) {
      newErrors.gameDateTime = '경기 날짜/시간을 입력해주세요'
    } else if (new Date(formData.gameDateTime) < new Date()) {
      newErrors.gameDateTime = '과거 경기에 대한 모임은 생성할 수 없습니다'
    }

    if (!formData.homeTeam) {
      newErrors.homeTeam = '홈 팀을 선택해주세요'
    }

    if (!formData.awayTeam) {
      newErrors.awayTeam = '원정 팀을 선택해주세요'
    }

    if (formData.homeTeam && formData.awayTeam && formData.homeTeam === formData.awayTeam) {
      newErrors.awayTeam = '홈 팀과 원정 팀은 달라야 합니다'
    }

    if (!formData.stadium) {
      newErrors.stadium = '구장을 선택해주세요'
    }

    if (!formData.meetingPlace.trim()) {
      newErrors.meetingPlace = '만날 장소를 입력해주세요'
    }

    if (formData.maxParticipants < 1 || formData.maxParticipants > 10) {
      newErrors.maxParticipants = '모집 인원은 1~10명 사이여야 합니다'
    }

    if (!formData.description.trim()) {
      newErrors.description = '모임 소개를 입력해주세요'
    } else if (formData.description.length > 500) {
      newErrors.description = '모임 소개는 500자 이내로 입력해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    createMutation.mutate({
      gameDateTime: formData.gameDateTime,
      homeTeam: formData.homeTeam as TeamCode,
      awayTeam: formData.awayTeam as TeamCode,
      stadium: formData.stadium as StadiumCode,
      meetingPlace: formData.meetingPlace,
      maxParticipants: formData.maxParticipants,
      description: formData.description,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
      >
        ← 뒤로가기
      </button>

      <h1 className="text-2xl font-bold mb-6">모임 만들기</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        {/* 경기 날짜/시간 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            경기 날짜/시간 <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            name="gameDateTime"
            value={formData.gameDateTime}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.gameDateTime ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.gameDateTime && <p className="mt-1 text-sm text-red-500">{errors.gameDateTime}</p>}
        </div>

        {/* 홈 팀 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            홈 팀 <span className="text-red-500">*</span>
          </label>
          <select
            name="homeTeam"
            value={formData.homeTeam}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.homeTeam ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">선택해주세요</option>
            {TEAMS.map((team) => (
              <option key={team.code} value={team.code}>
                {team.name}
              </option>
            ))}
          </select>
          {errors.homeTeam && <p className="mt-1 text-sm text-red-500">{errors.homeTeam}</p>}
        </div>

        {/* 원정 팀 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            원정 팀 <span className="text-red-500">*</span>
          </label>
          <select
            name="awayTeam"
            value={formData.awayTeam}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.awayTeam ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">선택해주세요</option>
            {TEAMS.map((team) => (
              <option key={team.code} value={team.code}>
                {team.name}
              </option>
            ))}
          </select>
          {errors.awayTeam && <p className="mt-1 text-sm text-red-500">{errors.awayTeam}</p>}
        </div>

        {/* 구장 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            구장 <span className="text-red-500">*</span>
          </label>
          <select
            name="stadium"
            value={formData.stadium}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.stadium ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">선택해주세요</option>
            {STADIUMS.map((stadium) => (
              <option key={stadium.code} value={stadium.code}>
                {stadium.name}
              </option>
            ))}
          </select>
          {errors.stadium && <p className="mt-1 text-sm text-red-500">{errors.stadium}</p>}
        </div>

        {/* 만날 장소 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            만날 장소 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="meetingPlace"
            value={formData.meetingPlace}
            onChange={handleChange}
            placeholder="예: 1루 블루석 101블록"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.meetingPlace ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.meetingPlace && <p className="mt-1 text-sm text-red-500">{errors.meetingPlace}</p>}
        </div>

        {/* 모집 인원 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            모집 인원 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="maxParticipants"
            value={formData.maxParticipants}
            onChange={handleChange}
            min="1"
            max="10"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.maxParticipants ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.maxParticipants && <p className="mt-1 text-sm text-red-500">{errors.maxParticipants}</p>}
          <p className="mt-1 text-sm text-gray-500">1~10명 사이로 설정 가능합니다</p>
        </div>

        {/* 모임 소개 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            모임 소개 <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="함께 응원할 동료를 찾고 있어요!"
            rows={5}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          <p className="mt-1 text-sm text-gray-500">{formData.description.length}/500자</p>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createMutation.isPending ? '생성 중...' : '모임 만들기'}
        </button>
      </form>
    </div>
  )
}
