import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'

/**
 * 날짜를 "MM/dd (E)" 형식으로 포맷팅
 * 예: "10/15 (일)"
 */
export const formatGameDate = (dateString: string): string => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString
    return format(date, 'MM/dd (E)', { locale: ko })
  } catch {
    return dateString
  }
}

/**
 * 시간을 "HH:mm" 형식으로 포맷팅
 * 예: "18:30"
 */
export const formatTime = (timeString: string): string => {
  try {
    const date = typeof timeString === 'string' ? parseISO(timeString) : timeString
    return format(date, 'HH:mm')
  } catch {
    return timeString
  }
}

/**
 * 날짜/시간을 "yyyy.MM.dd HH:mm" 형식으로 포맷팅
 * 예: "2025.10.15 18:30"
 */
export const formatDateTime = (dateString: string): string => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString
    return format(date, 'yyyy.MM.dd HH:mm')
  } catch {
    return dateString
  }
}

/**
 * 상대 시간 표시
 * 예: "3분 전", "2시간 전"
 */
export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString
    return formatDistanceToNow(date, { addSuffix: true, locale: ko })
  } catch {
    return dateString
  }
}
