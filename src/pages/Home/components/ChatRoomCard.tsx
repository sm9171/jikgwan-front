import { useNavigate } from 'react-router-dom'
import { TEAMS } from '@/constants/teams'
import type { ChatRoom } from '@/types/chat'
import { useAuthStore } from '@/stores/useAuthStore'

interface ChatRoomCardProps {
  chatRoom: ChatRoom
}

export const ChatRoomCard = ({ chatRoom }: ChatRoomCardProps) => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  // Find the other participant (not current user)
  const otherUser = chatRoom.participants.find(p => p.id !== user?.id)

  const getTeamInfo = (teamCode: string) => {
    return TEAMS.find(t => t.code === teamCode)
  }

  const formatGameDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return date.toLocaleString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    if (days < 7) return `${days}일 전`

    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
  }

  const homeTeamInfo = getTeamInfo(chatRoom.meetingInfo.gameInfo.homeTeam)
  const awayTeamInfo = getTeamInfo(chatRoom.meetingInfo.gameInfo.awayTeam)

  return (
    <div
      onClick={() => navigate(`/chat/${chatRoom.id}`)}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* 상대방 정보 */}
      <div className="flex items-center gap-3 mb-3">
        {otherUser?.profileImage ? (
          <img
            src={otherUser.profileImage}
            alt={otherUser.nickname}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">
              {otherUser?.nickname || '알 수 없음'}
            </h3>
            {chatRoom.isConfirmed && (
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                확정
              </span>
            )}
            {chatRoom.unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                {chatRoom.unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {otherUser?.gender === 'MALE' ? '남성' : otherUser?.gender === 'FEMALE' ? '여성' : '기타'} ·{' '}
            {otherUser?.ageRange
              ?.replace('TEENS', '10대')
              .replace('TWENTIES', '20대')
              .replace('THIRTIES', '30대')
              .replace('FORTIES', '40대')
              .replace('FIFTIES_PLUS', '50대+')}
          </p>
        </div>

        {chatRoom.lastMessage && (
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {formatTime(chatRoom.lastMessage.sentAt)}
          </span>
        )}
      </div>

      {/* 경기 정보 */}
      <div className="flex items-center gap-2 mb-2 text-sm">
        <span className="font-medium" style={{ color: homeTeamInfo?.color }}>
          {homeTeamInfo?.name || chatRoom.meetingInfo.gameInfo.homeTeam}
        </span>
        <span className="text-gray-400">vs</span>
        <span className="font-medium" style={{ color: awayTeamInfo?.color }}>
          {awayTeamInfo?.name || chatRoom.meetingInfo.gameInfo.awayTeam}
        </span>
        <span className="text-gray-500">·</span>
        <span className="text-gray-500">
          {formatGameDateTime(chatRoom.meetingInfo.gameInfo.gameDateTime)}
        </span>
      </div>

      {/* 마지막 메시지 */}
      {chatRoom.lastMessage ? (
        <p className="text-sm text-gray-600 truncate">
          {chatRoom.lastMessage.senderId === user?.id && '나: '}
          {chatRoom.lastMessage.content}
        </p>
      ) : (
        <p className="text-sm text-gray-400 italic">메시지가 없습니다</p>
      )}
    </div>
  )
}
