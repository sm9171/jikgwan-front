import { useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble'
import type { Message } from '@/types/chat'

interface MessageListProps {
  messages: Message[]
  currentUserId: number
  isLoading?: boolean
}

export const MessageList = ({
  messages,
  currentUserId,
  isLoading = false
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new message arrives or on initial load
  useEffect(() => {
    // Use setTimeout to ensure DOM is updated
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [messages])

  // Scroll to bottom on initial load (immediate, no smooth)
  useEffect(() => {
    if (messages.length > 0 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' })
    }
  }, [messages.length > 0])

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
          <p className="text-sm text-gray-500">메시지를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="mt-4 text-sm text-gray-500">
            아직 메시지가 없습니다
          </p>
          <p className="mt-1 text-xs text-gray-400">
            첫 메시지를 보내보세요!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto px-4 py-6"
    >
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isMine={message.senderId === currentUserId}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
