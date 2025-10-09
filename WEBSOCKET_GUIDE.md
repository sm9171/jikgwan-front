# WebSocket 채팅 기능 사용 가이드

## 📋 구현 내용

실시간 1:1 채팅 기능이 SockJS와 STOMP를 사용하여 구현되었습니다.

### 설치된 패키지
- `sockjs-client`: WebSocket 연결을 위한 클라이언트 라이브러리
- `@stomp/stompjs`: STOMP 프로토콜 지원

---

## 🏗️ 구조

### 1. WebSocket Hook (`src/hooks/useWebSocket.ts`)

커스텀 훅으로 WebSocket 연결을 관리합니다.

```typescript
const {
  isConnected,      // 연결 상태
  messages,         // 수신된 메시지 목록
  sendMessage,      // 메시지 전송 함수
  connect,          // 수동 연결
  disconnect        // 수동 연결 해제
} = useWebSocket({
  chatRoomId: '1',
  onMessageReceived: (message) => {
    console.log('새 메시지:', message)
  },
  onConnected: () => {
    console.log('연결됨')
  },
  onDisconnected: () => {
    console.log('연결 해제됨')
  },
  onError: (error) => {
    console.error('에러:', error)
  }
})
```

**주요 기능:**
- 자동 연결 및 재연결 (3초 후)
- JWT 토큰을 사용한 인증
- Heartbeat (4초 간격)
- 구독 관리
- 에러 처리

---

### 2. 채팅 컴포넌트

#### MessageBubble (`src/pages/Chat/components/MessageBubble.tsx`)
메시지를 말풍선 형태로 표시합니다.

**특징:**
- 내 메시지 / 상대방 메시지 구분
- 시간 표시 (오전/오후 형식)
- 읽음 표시 (내 메시지만)
- 말풍선 방향 (내 메시지: 오른쪽, 상대방: 왼쪽)

#### MessageInput (`src/pages/Chat/components/MessageInput.tsx`)
메시지 입력 컴포넌트입니다.

**특징:**
- 자동 높이 조절 textarea (최대 120px)
- Enter: 전송, Shift+Enter: 줄바꿈
- 전송 버튼 (비활성화 상태 처리)
- 빈 메시지 전송 방지

#### MessageList (`src/pages/Chat/components/MessageList.tsx`)
메시지 목록을 표시합니다.

**특징:**
- 자동 스크롤 (새 메시지 도착 시)
- 로딩 상태 표시
- 빈 메시지 목록 안내
- 무한 스크롤 지원 가능

#### ChatHeader (`src/pages/Chat/components/ChatHeader.tsx`)
채팅방 헤더입니다.

**특징:**
- 상대방 프로필 정보
- 경기 정보 표시
- 연결 상태 표시 (초록색/회색 점)
- 뒤로가기 버튼
- 메뉴 버튼 (신고, 차단 등 - 미구현)

---

### 3. Chat Page (`src/pages/Chat/index.tsx`)

채팅 페이지 메인 컴포넌트입니다.

**주요 기능:**
1. 채팅방 정보 조회 (`useQuery`)
2. 메시지 히스토리 조회 (`useQuery`)
3. WebSocket 연결 및 실시간 메시지 수신
4. 메시지 전송
5. 메시지 중복 방지

**상태 관리:**
- `allMessages`: 히스토리 + 실시간 메시지 통합
- `currentChatRoom`: 현재 채팅방 정보
- `isConnected`: WebSocket 연결 상태

---

## 📡 서버 연동

### WebSocket 엔드포인트

```
연결: http://localhost:8080/ws (SockJS)
구독: /topic/chat/{chatRoomId}
전송: /app/chat/{chatRoomId}
```

### 메시지 형식

#### 전송 메시지
```json
{
  "content": "안녕하세요!"
}
```

#### 수신 메시지
```json
{
  "id": 1,
  "chatRoomId": 1,
  "senderId": 3,
  "content": "안녕하세요!",
  "status": "SENT",
  "sentAt": "2025-10-07T14:35:00"
}
```

#### 메시지 상태 (status)
- `SENT`: 전송됨
- `DELIVERED`: 전달됨
- `READ`: 읽음

---

## 🔒 인증

WebSocket 연결 시 JWT 토큰을 헤더에 포함합니다:

```typescript
connectHeaders: {
  Authorization: `Bearer ${accessToken}`
}
```

---

## 🎨 UI/UX 특징

### 메시지 스타일
- **내 메시지**: 파란색 배경, 오른쪽 정렬
- **상대방 메시지**: 회색 배경, 왼쪽 정렬
- **말풍선 꼬리**: 말풍선 방향에 따라 표시

### 연결 상태 표시
- **연결됨**: 초록색 점 + 메시지 입력 가능
- **연결 끊김**: 회색 점 + 메시지 입력 불가 + 재연결 중 알림

### 로딩 상태
- 채팅방 로딩: 전체 화면 로딩 스피너
- 메시지 로딩: 메시지 영역 로딩 스피너

---

## 🚀 사용 방법

### 1. 채팅 페이지로 이동

```typescript
navigate(`/chat/${chatRoomId}`)
```

### 2. 모임 상세에서 채팅 시작

```typescript
// 채팅방 생성 후 이동 (Query Parameter 방식)
const createChatMutation = useMutation({
  mutationFn: (gatheringId: number) => chatApi.createChatRoom(gatheringId),
  onSuccess: (response) => {
    // response.data.id가 채팅방 ID
    navigate(`/chat/${response.data.id}`)
  }
})

// API 호출 형태: POST /api/chat/rooms?gatheringId=1
```

---

## 🔧 설정

### 환경 변수 (`.env.development`)

```env
VITE_API_BASE_URL=/api
VITE_WS_URL=http://localhost:8080
```

### Vite 프록시 설정 (`vite.config.ts`)

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
      },
    },
  },
})
```

---

## 🐛 디버깅

### WebSocket 연결 확인

콘솔에서 다음 로그를 확인하세요:

```
[STOMP Debug] >>> CONNECT
[STOMP Debug] <<< CONNECTED
WebSocket connected
Received message: { content: "안녕하세요", ... }
```

### 재연결 로직

연결이 끊어지면 3초 후 자동으로 재연결을 시도합니다.

```typescript
reconnectTimeoutRef.current = setTimeout(() => {
  connect()
}, 3000)
```

---

## 📝 TODO

- [ ] 메시지 읽음 처리
- [ ] 타이핑 중 표시
- [ ] 이미지 전송
- [ ] 메시지 삭제
- [ ] 신고/차단 기능
- [ ] 채팅방 나가기
- [ ] 푸시 알림

---

## 🎯 테스트 시나리오

### 1. 기본 채팅 테스트
1. 로그인 후 모임 상세 페이지 접속
2. "참여 신청하기" 버튼 클릭
3. 채팅방으로 이동
4. 메시지 입력 및 전송
5. 상대방이 메시지를 보내면 실시간으로 수신

### 2. 재연결 테스트
1. 채팅 중 서버 재시작
2. 3초 후 자동 재연결 확인
3. 재연결 후 메시지 전송 가능 확인

### 3. 연결 상태 표시 테스트
1. 채팅방 접속 (초록색 점 확인)
2. 서버 중단 (회색 점 + 재연결 중 알림 확인)
3. 서버 재시작 (초록색 점 + 알림 사라짐 확인)

---

## 📚 참고 자료

- [SockJS Client](https://github.com/sockjs/sockjs-client)
- [STOMP.js](https://stomp-js.github.io/stomp-websocket/)
- [Spring WebSocket](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#websocket)

---

**작성일**: 2025-10-07
**버전**: 1.0.0
