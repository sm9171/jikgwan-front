export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USER: {
    ME: '/users/me',
    UPDATE_PROFILE: '/users/me',
    MY_MEETINGS: '/users/me/meetings',
    MY_APPLICATIONS: '/users/me/applications',
  },
  GATHERINGS: {
    LIST: '/gatherings',
    DETAIL: (id: number) => `/gatherings/${id}`,
    CREATE: '/gatherings',
  },
  // 하위 호환성 (제거 예정)
  MEETINGS: {
    LIST: '/gatherings',
    DETAIL: (id: number) => `/gatherings/${id}`,
    CREATE: '/gatherings',
    UPDATE: (id: number) => `/gatherings/${id}`,
    DELETE: (id: number) => `/gatherings/${id}`,
  },
  CHAT: {
    ROOMS: '/chat/rooms',
    CREATE_ROOM: '/chat/rooms',
    MESSAGES: (roomId: number) => `/chat/rooms/${roomId}/messages`,
  },
  GAMES: {
    LIST: '/games',
  },
} as const
