import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { gatheringApi } from '@/apis/gathering'
import { TEAMS, STADIUMS } from '@/constants/teams'

export default function GatheringDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ['gathering', id],
    queryFn: () => gatheringApi.getGathering(Number(id)),
    enabled: !!id,
  })

  const gathering = data?.success ? data.data : null

  const getTeamName = (teamCode: string) => {
    return TEAMS.find(t => t.code === teamCode)?.name || teamCode
  }

  const getStadiumName = (stadiumCode: string) => {
    return STADIUMS.find(s => s.code === stadiumCode)?.name || stadiumCode
  }

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
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

  if (error || !gathering) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">모임을 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
      >
        ← 뒤로가기
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* 경기 정보 */}
        <div className="mb-6 pb-6 border-b">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-primary/10 text-primary font-bold rounded">
              ⚾ 경기 정보
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {getTeamName(gathering.gameInfo.homeTeam)} vs {getTeamName(gathering.gameInfo.awayTeam)}
          </h1>
          <p className="text-gray-600">
            📅 {formatDateTime(gathering.gameInfo.gameDateTime)}
          </p>
          <p className="text-gray-600">
            🏟️ {getStadiumName(gathering.gameInfo.stadium)}
          </p>
        </div>

        {/* 모임 정보 */}
        <div className="mb-6 pb-6 border-b">
          <h2 className="text-lg font-bold text-gray-900 mb-4">📍 모임 정보</h2>
          <div className="space-y-3">
            <div>
              <span className="text-gray-500">만날 장소:</span>
              <span className="ml-2 font-medium">{gathering.meetingPlace}</span>
            </div>
            <div>
              <span className="text-gray-500">모집 인원:</span>
              <span className="ml-2 font-medium">👥 {gathering.maxParticipants}명</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-2">소개:</span>
              <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                {gathering.description}
              </p>
            </div>
          </div>
        </div>

        {/* 호스트 정보 */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">👤 모임 주최자</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              {gathering.host.profileImageUrl ? (
                <img
                  src={gathering.host.profileImageUrl}
                  alt={gathering.host.nickname}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </div>
            <div>
              <p className="font-bold text-gray-900">{gathering.host.nickname}</p>
              <p className="text-sm text-gray-500">
                {gathering.host.gender === 'MALE' ? '남성' : gathering.host.gender === 'FEMALE' ? '여성' : '기타'} ·{' '}
                {gathering.host.ageRange
                  .replace('TEENS', '10대')
                  .replace('TWENTIES', '20대')
                  .replace('THIRTIES', '30대')
                  .replace('FORTIES', '40대')
                  .replace('FIFTIES_PLUS', '50대+')}
              </p>
            </div>
          </div>
        </div>

        {/* 참여 신청 버튼 (추후 채팅 기능 연동) */}
        <button
          className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90"
          onClick={() => alert('채팅 기능은 추후 구현 예정입니다.')}
        >
          참여 신청하기
        </button>
      </div>
    </div>
  )
}
