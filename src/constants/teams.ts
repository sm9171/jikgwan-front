export const TEAMS = [
  { code: 'LG', name: 'LG 트윈스', color: '#C30452' },
  { code: 'DOOSAN', name: '두산 베어스', color: '#131230' },
  { code: 'KT', name: 'KT 위즈', color: '#000000' },
  { code: 'SSG', name: 'SSG 랜더스', color: '#CE0E2D' },
  { code: 'NC', name: 'NC 다이노스', color: '#315288' },
  { code: 'KIWOOM', name: '키움 히어로즈', color: '#820024' },
  { code: 'KIA', name: 'KIA 타이거즈', color: '#EA0029' },
  { code: 'LOTTE', name: '롯데 자이언츠', color: '#041E42' },
  { code: 'SAMSUNG', name: '삼성 라이온즈', color: '#074CA1' },
  { code: 'HANWHA', name: '한화 이글스', color: '#FF6600' },
] as const

export type TeamCode = typeof TEAMS[number]['code']

export const STADIUMS = [
  { code: 'JAMSIL', name: '잠실야구장' },
  { code: 'GOCHEOK', name: '고척스카이돔' },
  { code: 'SUWON', name: '수원KT위즈파크' },
  { code: 'INCHEON', name: '인천SSG랜더스필드' },
  { code: 'DAEJEON', name: '대전한화생명이글스파크' },
  { code: 'GWANGJU', name: '광주-기아챔피언스필드' },
  { code: 'DAEGU', name: '대구삼성라이온즈파크' },
  { code: 'BUSAN', name: '사직야구장' },
  { code: 'CHANGWON', name: '창원NC파크' },
] as const

export type StadiumCode = typeof STADIUMS[number]['code']
