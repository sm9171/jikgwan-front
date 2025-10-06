import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { gatheringApi } from '@/apis/gathering'
import { TEAMS } from '@/constants/teams'
import type { Gathering } from '@/types/meeting'

export default function Home() {
  const navigate = useNavigate()
  const [page, setPage] = useState(0)

  const { data, isLoading, error } = useQuery({
    queryKey: ['gatherings', page],
    queryFn: () => gatheringApi.getGatherings({ page, size: 20, sort: 'createdAt,desc' }),
  })

  const gatherings = data?.success ? data.data.content : []
  const pageInfo = data?.success ? data.data : null

  const getTeamName = (teamCode: string) => {
    return TEAMS.find(t => t.code === teamCode)?.name || teamCode
  }

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return date.toLocaleString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          모임 목록을 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">모임 목록</h1>
        <button
          onClick={() => navigate('/gatherings/create')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          모임 만들기
        </button>
      </div>

      {gatherings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          아직 등록된 모임이 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {gatherings.map((gathering: Gathering) => (
            <div
              key={gathering.id}
              onClick={() => navigate(`/gatherings/${gathering.id}`)}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-sm font-medium rounded">
                      {getTeamName(gathering.gameInfo.homeTeam)} vs {getTeamName(gathering.gameInfo.awayTeam)}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    📍 {gathering.meetingPlace}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {formatDateTime(gathering.gameInfo.gameDateTime)}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {gathering.description}
                  </p>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-sm text-gray-500 mb-1">
                    {gathering.host.nickname}
                  </div>
                  <div className="text-sm text-gray-400">
                    {gathering.host.gender === 'MALE' ? '남' : gathering.host.gender === 'FEMALE' ? '여' : '기타'} ·
                    {gathering.host.ageRange.replace('TEENS', '10대')
                      .replace('TWENTIES', '20대')
                      .replace('THIRTIES', '30대')
                      .replace('FORTIES', '40대')
                      .replace('FIFTIES_PLUS', '50대+')}
                  </div>
                  <div className="mt-2 text-sm font-medium text-primary">
                    👥 {gathering.maxParticipants}명 모집
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pageInfo && pageInfo.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={pageInfo.first}
            className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>
          <span className="px-4 py-2">
            {pageInfo.number + 1} / {pageInfo.totalPages}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={pageInfo.last}
            className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}
