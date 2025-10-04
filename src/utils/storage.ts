/**
 * LocalStorage 유틸리티 함수
 */

const STORAGE_PREFIX = 'jikgwan_'

export const storage = {
  /**
   * 값 저장
   */
  set: <T>(key: string, value: T): void => {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(STORAGE_PREFIX + key, serializedValue)
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  },

  /**
   * 값 가져오기
   */
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Failed to get from localStorage:', error)
      return null
    }
  },

  /**
   * 값 제거
   */
  remove: (key: string): void => {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key)
    } catch (error) {
      console.error('Failed to remove from localStorage:', error)
    }
  },

  /**
   * 전체 삭제
   */
  clear: (): void => {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }
  },
}
