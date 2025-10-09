import { format } from 'date-fns'
import type { Message } from '@/types/chat'

interface MessageBubbleProps {
  message: Message
  isMine: boolean
}

export const MessageBubble = ({ message, isMine }: MessageBubbleProps) => {
  const formatTime = (sentAt: string) => {
    try {
      return format(new Date(sentAt), 'a h:mm')
    } catch {
      return ''
    }
  }

  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className="flex flex-col max-w-[70%]">
        <div
          className={`
            rounded-2xl px-4 py-3
            ${
              isMine
                ? 'bg-blue-500 text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-900 rounded-bl-sm'
            }
          `}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        <span
          className={`
            text-xs text-gray-500 mt-1 px-1
            ${isMine ? 'text-right' : 'text-left'}
          `}
        >
          {formatTime(message.sentAt)}
          {message.status === 'READ' && isMine && ' · 읽음'}
          {message.status === 'SENT' && isMine && ' · 전송됨'}
        </span>
      </div>
    </div>
  )
}
