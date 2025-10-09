import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useChatStore } from '@/stores/useChatStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { chatApi } from '@/apis/chat'
import { ChatHeader } from './components/ChatHeader'
import { MessageList } from './components/MessageList'
import { MessageInput } from './components/MessageInput'
import type { Message } from '@/types/chat'

export default function ChatPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const { currentChatRoom, setCurrentChatRoom, addMessage } = useChatStore()
  const [allMessages, setAllMessages] = useState<Message[]>([])

  // Fetch chat room details
  const { data: chatRoom, isLoading: isLoadingRoom, error: chatRoomError } = useQuery({
    queryKey: ['chatRoom', id],
    queryFn: () => chatApi.getChatRoom(Number(id)),
    enabled: !!id,
    staleTime: 0, // Always fetch fresh data
    retry: 3, // Retry 3 times if it fails
    retryDelay: 1000 // Wait 1 second between retries
  })

  // Fetch message history
  const { data: messagesData, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['chatMessages', id],
    queryFn: () => chatApi.getMessages(Number(id!), { page: 0, size: 50 }),
    enabled: !!id && !!chatRoom?.data, // Only fetch messages after chat room is loaded
    staleTime: 0
  })

  // Initialize messages (sort by sentAt ascending - oldest first)
  useEffect(() => {
    if (messagesData?.data?.content) {
      const sortedMessages = [...messagesData.data.content].sort((a, b) => {
        return new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
      })
      console.log('[Chat Page] Loaded messages, sorted oldest to newest:', sortedMessages.length)
      setAllMessages(sortedMessages)
    }
  }, [messagesData])

  // Set current chat room
  useEffect(() => {
    if (chatRoom?.data) {
      setCurrentChatRoom(chatRoom.data)
    }
  }, [chatRoom, setCurrentChatRoom])

  // Mark messages as read when entering chat room
  useEffect(() => {
    if (id && chatRoom?.data) {
      chatApi.markAsRead(Number(id))
        .then(() => {
          console.log('[Chat Page] Messages marked as read')
          // Invalidate chat rooms list to update unread count
          queryClient.invalidateQueries({ queryKey: ['chatRooms'] })
        })
        .catch((error) => {
          console.error('[Chat Page] Failed to mark as read:', error)
        })
    }
  }, [id, chatRoom?.data, queryClient])

  // Mark as read when leaving the page
  useEffect(() => {
    return () => {
      if (id) {
        chatApi.markAsRead(Number(id))
          .then(() => {
            // Invalidate chat rooms list to update unread count
            queryClient.invalidateQueries({ queryKey: ['chatRooms'] })
          })
          .catch((error) => {
            console.error('[Chat Page] Failed to mark as read on unmount:', error)
          })
      }
    }
  }, [id, queryClient])

  // WebSocket connection
  const { isConnected, sendMessage } = useWebSocket({
    chatRoomId: id!,
    onMessageReceived: (message) => {
      console.log('[Chat Page] New message received:', message)

      // Add message only if it doesn't exist (avoid duplicates)
      setAllMessages((prev) => {
        console.log('[Chat Page] Current messages count:', prev.length)
        const exists = prev.some((msg) =>
          msg.id === message.id ||
          (msg.content === message.content && msg.senderId === message.senderId &&
           Math.abs(new Date(msg.sentAt).getTime() - new Date(message.sentAt).getTime()) < 1000)
        )
        if (exists) {
          console.log('[Chat Page] ❌ Message already exists, skipping')
          return prev
        }
        console.log('[Chat Page] ✅ Adding new message')
        return [...prev, message]
      })

      // Update chat store
      if (id) {
        addMessage(Number(id), message)
      }
    },
    onConnected: () => {
      console.log('Chat WebSocket connected')
    },
    onDisconnected: () => {
      console.log('Chat WebSocket disconnected')
    },
    onError: (error) => {
      console.error('Chat WebSocket error:', error)
    }
  })

  const handleSendMessage = async (content: string) => {
    if (isConnected) {
      // WebSocket으로 전송 (실시간)
      sendMessage(content)
    } else {
      // WebSocket 끊어진 경우 HTTP API로 전송 (DB 저장)
      try {
        console.log('WebSocket disconnected, sending via HTTP API...')
        const response = await chatApi.sendMessage(Number(id), content)
        console.log('Message sent via HTTP:', response)

        // HTTP 응답에서 메시지 추출하여 로컬에 추가
        if (response.data) {
          const newMessage = response.data

          // Add message only if it doesn't exist (avoid duplicates)
          setAllMessages((prev) => {
            const exists = prev.some((msg) =>
              msg.id === newMessage.id ||
              (msg.content === newMessage.content && msg.senderId === newMessage.senderId &&
               Math.abs(new Date(msg.sentAt).getTime() - new Date(newMessage.sentAt).getTime()) < 1000)
            )
            if (exists) {
              console.log('Message already exists, skipping...')
              return prev
            }
            return [...prev, newMessage]
          })

          if (id) {
            addMessage(Number(id), newMessage)
          }
        }
      } catch (error) {
        console.error('Failed to send message via HTTP:', error)
        alert('메시지 전송에 실패했습니다. 다시 시도해주세요.')
      }
    }
  }

  if (!id) {
    navigate('/chat')
    return null
  }

  if (!user) {
    navigate('/login')
    return null
  }

  if (isLoadingRoom) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
          <p className="text-sm text-gray-500">채팅방을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (chatRoomError || !chatRoom?.data) {
    console.error('Chat room error:', chatRoomError)
    console.log('Chat room data:', chatRoom)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-2">채팅방을 찾을 수 없습니다</p>
          {chatRoomError && (
            <p className="text-sm text-red-500 mb-4">
              오류: {chatRoomError instanceof Error ? chatRoomError.message : '알 수 없는 오류'}
            </p>
          )}
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-blue-500 hover:underline"
          >
            경기 목록으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  const gatheringId = chatRoom.data.meetingInfo?.id

  // Find other user (not current user)
  const otherUser = chatRoom.data.participants.find(
    (participant) => participant.id !== user.id
  )

  if (!otherUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">상대방 정보를 찾을 수 없습니다</p>
      </div>
    )
  }

  // Check if current user is the host
  const isHost = chatRoom.data.hostId === user.id

  console.log('Chat Room Full Data:', JSON.stringify(chatRoom.data, null, 2))
  console.log('Chat Room Debug:', {
    chatRoomData: chatRoom.data,
    hostId: chatRoom.data.hostId,
    applicantId: chatRoom.data.applicantId,
    currentUserId: user.id,
    isHost
  })

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <ChatHeader
        otherUser={otherUser}
        meetingInfo={chatRoom.data.meetingInfo}
        isConnected={isConnected}
        isHost={isHost}
      />

      <MessageList
        messages={allMessages}
        currentUserId={user.id}
        isLoading={isLoadingMessages}
      />

      <MessageInput
        onSend={handleSendMessage}
      />
    </div>
  )
}
