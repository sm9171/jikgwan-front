export const TEAMS = [
  { id: 'LG', name: 'LG 트윈스', color: '#C6004A' },
  { id: 'DOOSAN', name: '두산 베어스', color: '#131230' },
  { id: 'SAMSUNG', name: '삼성 라이온즈', color: '#074CA1' },
  { id: 'KIA', name: 'KIA 타이거즈', color: '#EA0029' },
  { id: 'LOTTE', name: '롯데 자이언츠', color: '#041E42' },
  { id: 'SSG', name: 'SSG 랜더스', color: '#CE0E2D' },
  { id: 'KIWOOM', name: '키움 히어로즈', color: '#820024' },
  { id: 'HANWHA', name: '한화 이글스', color: '#FF6600' },
  { id: 'NC', name: 'NC 다이노스', color: '#315288' },
  { id: 'KT', name: 'KT 위즈', color: '#000000' },
] as const

export type TeamId = typeof TEAMS[number]['id']
