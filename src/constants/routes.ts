export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  MEETING_LIST: '/meetings',
  MEETING_DETAIL: '/meeting/:id',
  MEETING_CREATE: '/meeting/create',
  CHAT_LIST: '/chat',
  CHAT_ROOM: '/chat/:id',
  MY_PAGE: '/mypage',
  PROFILE_EDIT: '/mypage/profile',
} as const

export const getRoute = {
  meetingDetail: (id: number) => `/meeting/${id}`,
  chatRoom: (id: number) => `/chat/${id}`,
}
