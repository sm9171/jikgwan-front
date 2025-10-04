# 직관 (Jikgwan) - 프론트엔드

야구 팬들의 직관 메이트 찾기 서비스

## 🚀 시작하기

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

### 환경 변수

`.env.development` 파일을 생성하고 다음 내용을 추가하세요:

```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080
```

## 📁 프로젝트 구조

```
src/
├── apis/           # API 클라이언트
├── assets/         # 정적 리소스
├── components/     # 공통 컴포넌트
├── constants/      # 상수
├── hooks/          # 커스텀 훅
├── layouts/        # 레이아웃
├── pages/          # 페이지 컴포넌트
├── stores/         # Zustand 스토어
├── styles/         # 스타일
├── types/          # TypeScript 타입
└── utils/          # 유틸리티 함수
```

## 🛠 기술 스택

- **React 18** + **TypeScript**
- **Vite** - 빌드 툴
- **Tailwind CSS** - 스타일링
- **React Router** - 라우팅
- **Zustand** - 전역 상태 관리
- **Tanstack Query** - 서버 상태 관리
- **Axios** - HTTP 클라이언트

## 📝 개발 가이드

자세한 개발 가이드는 [CLAUDE.md](./CLAUDE.md) 파일을 참조하세요.

## 🔑 주요 기능

- 회원가입 / 로그인
- 모임 생성 / 조회 / 참여
- 1:1 채팅
- 프로필 관리
- 구단별 필터링

## 📄 라이선스

MIT
