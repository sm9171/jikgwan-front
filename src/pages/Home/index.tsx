import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { gatheringApi } from '@/apis/gathering'
import { chatApi } from '@/apis/chat'
import { useAuthStore } from '@/stores/useAuthStore'
import { TEAMS } from '@/constants/teams'
import { toast } from 'react-toastify'
import type { Gathering } from '@/types/meeting'
import { ChatRoomCard } from './components/ChatRoomCard'

type TabType = 'gatherings' | 'participating' | 'chats'

export default function Home() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, logout } = useAuthStore()
  const [page, setPage] = useState(0)
  const [activeTab, setActiveTab] = useState<TabType>('gatherings')
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['gatherings', page, selectedTeam],
    queryFn: () => {
      const params: any = { page, size: 20, sort: 'createdAt,desc' }
      if (selectedTeam) {
        params.team = selectedTeam
      }
      return gatheringApi.getGatherings(params)
    },
    enabled: activeTab === 'gatherings',
  })

  const { data: chatRoomsData, isLoading: isLoadingChats } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: () => chatApi.getChatRooms(),
    enabled: activeTab === 'chats',
  })

  const { data: participatingData, isLoading: isLoadingParticipating } = useQuery({
    queryKey: ['myParticipatingGatherings'],
    queryFn: () => gatheringApi.getMyParticipatingGatherings(),
    enabled: activeTab === 'participating',
  })

  const gatherings = data?.success ? data.data.content : []
  const pageInfo = data?.success ? data.data : null
  const chatRooms = chatRoomsData?.success ? chatRoomsData.data : []
  const participatingGatherings = participatingData?.success ? participatingData.data : []

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

  const isCurrentLoading =
    activeTab === 'gatherings' ? isLoading :
    activeTab === 'participating' ? isLoadingParticipating :
    isLoadingChats

  if (isCurrentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (error && activeTab === 'gatherings') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          모임 목록을 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      await logout()
      // 모든 React Query 캐시 클리어
      queryClient.clear()
      toast.success('로그아웃되었습니다.')
      navigate('/login')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with User Info and Logout */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">⚾ 직관</h1>
          {user && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">{user.nickname}</span>님
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/gatherings/create')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            모임 만들기
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('gatherings')}
            className={`pb-3 px-4 font-medium transition-colors relative ${
              activeTab === 'gatherings'
                ? 'text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            모임 목록
            {activeTab === 'gatherings' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('participating')}
            className={`pb-3 px-4 font-medium transition-colors relative ${
              activeTab === 'participating'
                ? 'text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            참여 중인 모임
            {activeTab === 'participating' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('chats')}
            className={`pb-3 px-4 font-medium transition-colors relative ${
              activeTab === 'chats'
                ? 'text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            채팅방
            {activeTab === 'chats' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
            {chatRooms.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {chatRooms.reduce((sum, room) => sum + room.unreadCount, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Gatherings Tab */}
      {activeTab === 'gatherings' && (
        <>
          {/* Team Filter */}
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => {
                  setSelectedTeam(null)
                  setPage(0)
                }}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedTeam === null
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              {TEAMS.map((team) => (
                <button
                  key={team.code}
                  onClick={() => {
                    setSelectedTeam(team.code)
                    setPage(0)
                  }}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedTeam === team.code
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={
                    selectedTeam === team.code
                      ? { backgroundColor: team.color }
                      : undefined
                  }
                >
                  {team.name}
                </button>
              ))}
            </div>
          </div>

          {gatherings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {selectedTeam ? `${TEAMS.find(t => t.code === selectedTeam)?.name} 관련 모임이 없습니다.` : '아직 등록된 모임이 없습니다.'}
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
                    👥 {gathering.participants?.length || 0}/{gathering.maxParticipants}명
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
        </>
      )}

      {/* Participating Gatherings Tab */}
      {activeTab === 'participating' && (
        <div className="space-y-4">
          {!participatingGatherings || participatingGatherings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              참여 중인 모임이 없습니다.
            </div>
          ) : (
            participatingGatherings.map((gathering: Gathering) => {
              const isHost = gathering.host.id === user?.id
              return (
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
                        {isHost ? (
                          <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">
                            내가 만든 모임
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                            참여 확정
                          </span>
                        )}
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
                        {gathering.host.gender === 'MALE' ? '남' : gathering.host.gender === 'FEMALE' ? '여' : '기타'} ·{' '}
                        {gathering.host.ageRange
                          ?.replace('TEENS', '10대')
                          .replace('TWENTIES', '20대')
                          .replace('THIRTIES', '30대')
                          .replace('FORTIES', '40대')
                          .replace('FIFTIES_PLUS', '50대+')}
                      </div>
                      <div className="mt-2 text-sm font-medium text-primary">
                        👥 {gathering.participants?.length || 0}/{gathering.maxParticipants}명
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Chats Tab */}
      {activeTab === 'chats' && (
        <div className="space-y-3">
          {chatRooms.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              아직 참여한 채팅방이 없습니다.
            </div>
          ) : (
            chatRooms.map((chatRoom) => (
              <ChatRoomCard key={chatRoom.id} chatRoom={chatRoom} />
            ))
          )}
        </div>
      )}
    </div>
  )
}
