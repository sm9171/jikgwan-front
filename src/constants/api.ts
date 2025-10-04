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
  MEETINGS: {
    LIST: '/meetings',
    DETAIL: (id: number) => `/meetings/${id}`,
    CREATE: '/meetings',
    UPDATE: (id: number) => `/meetings/${id}`,
    DELETE: (id: number) => `/meetings/${id}`,
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
