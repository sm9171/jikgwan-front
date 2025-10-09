import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { gatheringApi } from '@/apis/gathering'
import { chatApi } from '@/apis/chat'
import { useAuthStore } from '@/stores/useAuthStore'
import { TEAMS, STADIUMS } from '@/constants/teams'
import { toast } from 'react-toastify'
import { UserProfileModal } from '@/pages/Chat/components/UserProfileModal'

export default function GatheringDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [showHostProfile, setShowHostProfile] = useState(false)
  const [showParticipantProfile, setShowParticipantProfile] = useState<number | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['gathering', id],
    queryFn: () => gatheringApi.getGathering(Number(id)),
    enabled: !!id,
  })

  const gathering = data?.success ? data.data : null

  // Check if current user is host
  const isHost = gathering?.host.id === user?.id
  const participants = gathering?.participants || []

  // Create chat room mutation
  const createChatMutation = useMutation({
    mutationFn: (gatheringId: number) => chatApi.createChatRoom(gatheringId),
    onSuccess: (response) => {
      console.log('Chat room created:', response)
      // Response format: { success: true, data: { id, gatheringId, hostId, applicantId, status, createdAt }, error: null }
      const chatRoomId = response.data?.id
      if (chatRoomId) {
        // Invalidate chat queries to ensure fresh data
        queryClient.invalidateQueries({ queryKey: ['chatRoom', String(chatRoomId)] })
        queryClient.invalidateQueries({ queryKey: ['chatMessages', String(chatRoomId)] })
        queryClient.invalidateQueries({ queryKey: ['chatRooms'] })

        navigate(`/chat/${chatRoomId}`)
      } else {
        toast.error('채팅방 생성에 실패했습니다.')
      }
    },
    onError: (error: any) => {
      console.error('Chat room creation error:', error)
      toast.error(error.response?.data?.error?.message || '채팅방 생성에 실패했습니다.')
    }
  })

  const handleParticipate = () => {
    if (!gathering) return

    // Check if user is the host
    if (gathering.host.id === user?.id) {
      toast.info('자신이 만든 모임에는 참여 신청할 수 없습니다.')
      return
    }

    // Check if chat room already exists
    if (gathering.chatRoomId) {
      navigate(`/chat/${gathering.chatRoomId}`)
      return
    }

    // Create new chat room with gatheringId
    createChatMutation.mutate(Number(id))
  }

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
        <div className="mb-6 pb-6 border-b">
          <h2 className="text-lg font-bold text-gray-900 mb-4">👤 모임 주최자</h2>
          <button
            onClick={() => setShowHostProfile(true)}
            className="flex items-center gap-4 w-full text-left hover:bg-gray-50 rounded-lg p-2 -ml-2 transition-colors"
          >
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
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
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 hover:text-blue-500 transition-colors">
                {gathering.host.nickname}
              </p>
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
            <svg
              className="w-5 h-5 text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* 확정된 참여자 목록 */}
        {participants.length > 0 && (
          <div className="mb-6 pb-6 border-b">
            <h2 className="text-lg font-bold text-gray-900 mb-4">✅ 확정된 참여자 ({participants.length}명)</h2>
            <div className="flex gap-2 flex-wrap">
              {participants.map((participant) => (
                <button
                  key={participant.userId}
                  onClick={() => setShowParticipantProfile(participant.userId)}
                  className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:ring-2 hover:ring-blue-500 transition-all"
                  title="프로필 보기"
                >
                  {participant.profileImageUrl ? (
                    <img
                      src={participant.profileImageUrl}
                      alt={`참여자 ${participant.userId}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl">👤</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 참여 신청 버튼 */}
        {gathering.host.id === user?.id ? (
          <div className="w-full py-3 bg-gray-300 text-gray-600 font-bold rounded-lg text-center">
            내가 만든 모임입니다
          </div>
        ) : (
          <button
            className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={handleParticipate}
            disabled={createChatMutation.isPending}
          >
            {createChatMutation.isPending
              ? '처리 중...'
              : gathering.chatRoomId
              ? '채팅방으로 이동'
              : '참여 신청하기'}
          </button>
        )}
      </div>

      {/* Host Profile Modal */}
      {showHostProfile && (
        <UserProfileModal
          userId={gathering.host.id}
          onClose={() => setShowHostProfile(false)}
        />
      )}

      {/* Participant Profile Modal */}
      {showParticipantProfile && (
        <UserProfileModal
          userId={showParticipantProfile}
          onClose={() => setShowParticipantProfile(null)}
        />
      )}
    </div>
  )
}
