export const queryKeys = {
  meetings: {
    all: ['meetings'] as const,
    list: (team?: string) => [...queryKeys.meetings.all, 'list', team] as const,
    detail: (id: number) => [...queryKeys.meetings.all, 'detail', id] as const,
  },
  chat: {
    all: ['chat'] as const,
    rooms: () => [...queryKeys.chat.all, 'rooms'] as const,
    messages: (roomId: number) => [...queryKeys.chat.all, 'messages', roomId] as const,
  },
  user: {
    all: ['user'] as const,
    me: () => [...queryKeys.user.all, 'me'] as const,
    myMeetings: () => [...queryKeys.user.all, 'myMeetings'] as const,
    myApplications: () => [...queryKeys.user.all, 'myApplications'] as const,
  },
  games: {
    all: ['games'] as const,
    list: (date?: string, team?: string) => [...queryKeys.games.all, 'list', date, team] as const,
  },
}
