import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useChatStore } from '@/stores/useChatStore'
import { gatheringApi } from '@/apis/gathering'
import { UserProfileModal } from './UserProfileModal'
import type { User, GameInfo } from '@/types/chat'

interface ChatHeaderProps {
  otherUser: User
  meetingInfo?: {
    id: number
    gameInfo: GameInfo
  }
  isConnected: boolean
  isHost: boolean
}

export const ChatHeader = ({
  otherUser,
  meetingInfo,
  isConnected,
  isHost
}: ChatHeaderProps) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { confirmParticipant, cancelParticipant } = useChatStore()
  const [isConfirming, setIsConfirming] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)

  // 확정된 참여자 목록 조회 (호스트인 경우에만)
  const { data: participantsData, refetch: refetchParticipants } = useQuery({
    queryKey: ['gathering', meetingInfo?.id, 'participants'],
    queryFn: () => gatheringApi.getParticipants(meetingInfo!.id),
    enabled: isHost && !!meetingInfo?.id,
  })

  const participants = participantsData?.success ? participantsData.data : []
  const isConfirmed = participants.some(p => p.userId === otherUser.id)

  const formatGameInfo = () => {
    if (!meetingInfo?.gameInfo) return ''

    const { date, time, homeTeam, awayTeam } = meetingInfo.gameInfo
    try {
      const formattedDate = format(new Date(date), 'M/d')
      return `${formattedDate} ${time} ${homeTeam} vs ${awayTeam}`
    } catch {
      return `${homeTeam} vs ${awayTeam}`
    }
  }

  const handleConfirmParticipant = async () => {
    if (!meetingInfo) return

    if (!confirm(`${otherUser.nickname}님을 모임에 참여시키시겠습니까?`)) {
      return
    }

    setIsConfirming(true)
    try {
      await confirmParticipant(meetingInfo.id, otherUser.id)
      await refetchParticipants() // 참여자 목록 새로고침

      // 모임 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['gatherings'] })
      queryClient.invalidateQueries({ queryKey: ['gathering', meetingInfo.id] })
      queryClient.invalidateQueries({ queryKey: ['myParticipatingGatherings'] })

      alert(`${otherUser.nickname}님이 모임에 참여되었습니다!`)
    } catch (error: any) {
      console.error('Failed to confirm participant:', error)

      // 에러 메시지 처리
      let errorMessage = '참여자 확정에 실패했습니다.'

      if (error?.message) {
        errorMessage = error.message
      } else if (error?.errorCode === 'BUSINESS_ERROR') {
        // 비즈니스 에러의 경우 메시지 그대로 표시
        errorMessage = error.message || errorMessage
      } else if (error?.errorCode === 'GATHERING_NOT_FOUND') {
        errorMessage = '모임을 찾을 수 없습니다.'
      } else if (error?.errorCode === 'USER_NOT_FOUND') {
        errorMessage = '사용자를 찾을 수 없습니다.'
      } else if (error?.errorCode === 'UNAUTHORIZED') {
        errorMessage = '권한이 없습니다.'
      }

      alert(errorMessage)
    } finally {
      setIsConfirming(false)
    }
  }

  const handleCancelParticipant = async () => {
    if (!meetingInfo) return

    if (!confirm(`${otherUser.nickname}님의 참여를 취소하시겠습니까?`)) {
      return
    }

    setIsConfirming(true)
    try {
      await cancelParticipant(meetingInfo.id, otherUser.id)
      await refetchParticipants() // 참여자 목록 새로고침

      // 모임 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['gatherings'] })
      queryClient.invalidateQueries({ queryKey: ['gathering', meetingInfo.id] })
      queryClient.invalidateQueries({ queryKey: ['myParticipatingGatherings'] })

      alert(`${otherUser.nickname}님의 참여가 취소되었습니다.`)
    } catch (error: any) {
      console.error('Failed to cancel participant:', error)

      let errorMessage = '참여자 취소에 실패했습니다.'

      if (error?.message) {
        errorMessage = error.message
      } else if (error?.errorCode === 'BUSINESS_ERROR') {
        errorMessage = error.message || errorMessage
      }

      alert(errorMessage)
    } finally {
      setIsConfirming(false)
    }
  }

  return (
    <div className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
        >
          <svg
            className="h-6 w-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          >
            {otherUser.profileImage ? (
              <img
                src={otherUser.profileImage}
                alt={otherUser.nickname}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                <svg
                  className="h-6 w-6 text-gray-500"
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
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowProfileModal(true)}
                className="text-base font-semibold text-gray-900 truncate hover:text-blue-500 transition-colors"
              >
                {otherUser.nickname}
              </button>
              <div
                className={`h-2 w-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-gray-300'
                }`}
                title={isConnected ? '연결됨' : '연결 끊김'}
              />
              {isHost && (
                isConfirmed ? (
                  <button
                    onClick={handleCancelParticipant}
                    disabled={isConfirming}
                    className="ml-2 px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {isConfirming ? '처리중...' : '확정 취소'}
                  </button>
                ) : (
                  <button
                    onClick={handleConfirmParticipant}
                    disabled={isConfirming}
                    className="ml-2 px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {isConfirming ? '처리중...' : '참여 확정'}
                  </button>
                )
              )}
            </div>
            {meetingInfo && (
              <button
                onClick={() => navigate(`/gatherings/${meetingInfo.id}`)}
                className="text-xs text-gray-500 truncate hover:text-blue-500 transition-colors text-left"
              >
                {formatGameInfo()}
              </button>
            )}
          </div>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
          onClick={() => {
            if (meetingInfo) {
              navigate(`/gatherings/${meetingInfo.id}`)
            }
          }}
          title="경기 상세 보기"
        >
          <svg
            className="h-6 w-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>

      {/* User Profile Modal */}
      {showProfileModal && (
        <UserProfileModal
          userId={otherUser.id}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  )
}
