import { useState, useRef, KeyboardEvent } from 'react'

interface MessageInputProps {
  onSend: (content: string) => void
  disabled?: boolean
}

export const MessageInput = ({ onSend, disabled = false }: MessageInputProps) => {
  const [message, setMessage] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage) return

    console.log('[MessageInput] Sending message:', trimmedMessage)
    onSend(trimmedMessage)
    setMessage('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter (without Shift)
    // Prevent sending during IME composition (한글 입력 중)
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCompositionStart = () => {
    console.log('[MessageInput] Composition started (한글 입력 시작)')
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    console.log('[MessageInput] Composition ended (한글 입력 완료)')
    setIsComposing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder="메시지를 입력하세요..."
          disabled={disabled}
          rows={1}
          className="
            flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3
            text-sm leading-relaxed outline-none
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            max-h-[120px] overflow-y-auto
          "
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="
            flex h-12 w-12 shrink-0 items-center justify-center rounded-lg
            bg-blue-500 text-white transition-colors
            hover:bg-blue-600
            disabled:bg-gray-300 disabled:cursor-not-allowed
          "
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Enter: 전송 | Shift + Enter: 줄바꿈
      </p>
    </div>
  )
}
