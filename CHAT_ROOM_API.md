# 채팅방 생성 API 가이드

## 📋 API 명세

### 엔드포인트
```
POST /api/chat/rooms?gatheringId={모임ID}
```

### 인증
```
Authorization: Bearer {accessToken}
```

---

## 🔧 구현 방법

### 1. API 함수 (src/apis/chat.ts)

```typescript
export const chatApi = {
  createChatRoom: async (gatheringId: number) => {
    return await client.post(API_ENDPOINTS.CHAT.CREATE_ROOM, null, {
      params: { gatheringId }
    })
  }
}
```

**주요 포인트:**
- ✅ Query Parameter로 `gatheringId` 전달
- ✅ Request Body는 `null` (데이터 없음)
- ✅ Axios의 `params` 옵션 사용

---

### 2. 컴포넌트에서 사용 (GatheringDetail)

```typescript
const createChatMutation = useMutation({
  mutationFn: (gatheringId: number) => chatApi.createChatRoom(gatheringId),
  onSuccess: (response) => {
    console.log('Chat room created:', response)
    const chatRoomId = response.data?.id
    if (chatRoomId) {
      navigate(`/chat/${chatRoomId}`)
    }
  },
  onError: (error: any) => {
    console.error('Chat room creation error:', error)
    toast.error(error.response?.data?.error?.message || '채팅방 생성에 실패했습니다.')
  }
})

const handleParticipate = () => {
  if (gathering.chatRoomId) {
    // 이미 채팅방이 있으면 바로 이동
    navigate(`/chat/${gathering.chatRoomId}`)
  } else {
    // 새 채팅방 생성
    createChatMutation.mutate(Number(id))
  }
}
```

---

## 📥 요청 예시

### cURL
```bash
curl -X POST "http://localhost:8080/api/chat/rooms?gatheringId=1" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Axios
```javascript
axios.post('/api/chat/rooms', null, {
  params: { gatheringId: 1 },
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})
```

### Fetch
```javascript
fetch('http://localhost:8080/api/chat/rooms?gatheringId=1', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + accessToken
  }
})
```

---

## 📤 응답 형식

### 성공 (201 Created)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "gatheringId": 1,
    "hostId": 2,
    "applicantId": 3,
    "status": "ACTIVE",
    "createdAt": "2025-10-07T14:30:00"
  },
  "error": null
}
```

### 중복 참여 (기존 채팅방 반환)

같은 모임에 이미 채팅방이 있으면 기존 채팅방을 반환합니다.

```json
{
  "success": true,
  "data": {
    "id": 1,
    "gatheringId": 1,
    "hostId": 2,
    "applicantId": 3,
    "status": "ACTIVE",
    "createdAt": "2025-10-07T14:30:00"
  },
  "error": null
}
```

---

## ❌ 에러 응답

### 401 Unauthorized (로그인 필요)

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "A001",
    "message": "인증이 필요합니다"
  }
}
```

### 404 Not Found (모임 없음)

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "G001",
    "message": "모임을 찾을 수 없습니다"
  }
}
```

### 400 Bad Request (본인 모임 참여 시도)

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "본인이 만든 모임에는 참여할 수 없습니다"
  }
}
```

---

## 📊 응답 필드 설명

| 필드          | 타입       | 설명                      |
|-------------|----------|-------------------------|
| id          | Long     | 채팅방 ID                  |
| gatheringId | Long     | 모임 ID                   |
| hostId      | Long     | 모임 주최자 ID               |
| applicantId | Long     | 참여 신청자 ID (나)           |
| status      | String   | 채팅방 상태 (ACTIVE, CLOSED) |
| createdAt   | DateTime | 채팅방 생성 시간               |

---

## 🔄 비즈니스 로직

1. **모임 존재 확인**: `gatheringId`로 모임 조회
2. **본인 모임 체크**: 자신이 만든 모임에는 참여 불가
3. **중복 체크**: 이미 채팅방이 있으면 기존 채팅방 반환
4. **채팅방 생성**: 호스트와 신청자 간 1:1 채팅방 생성

---

## 🧪 Postman 테스트

### 1. Request 설정
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/chat/rooms`
- **Params**:
  - Key: `gatheringId`
  - Value: `1`
- **Headers**:
  - Key: `Authorization`
  - Value: `Bearer {your_token}`

### 2. Send 클릭

### 3. 예상 결과
- Status: `201 Created`
- Body: 채팅방 정보 JSON

---

## 💡 TypeScript 타입 정의

```typescript
// src/types/chat.d.ts
export interface CreateChatRoomResponse {
  id: number
  gatheringId: number
  hostId: number
  applicantId: number
  status: 'ACTIVE' | 'CLOSED'
  createdAt: string
}
```

---

## 🎯 사용 흐름

```mermaid
graph TD
    A[모임 상세 페이지] --> B{채팅방 존재?}
    B -->|Yes| C[기존 채팅방으로 이동]
    B -->|No| D[참여 신청하기 클릭]
    D --> E[POST /api/chat/rooms?gatheringId=X]
    E --> F{성공?}
    F -->|Yes| G[채팅방 ID 반환]
    F -->|No| H[에러 메시지 표시]
    G --> I[/chat/:id로 이동]
    I --> J[WebSocket 연결]
    J --> K[실시간 채팅 시작]
```

---

## ✅ 체크리스트

- [x] Query Parameter로 `gatheringId` 전달
- [x] Response에서 `data.id`로 채팅방 ID 추출
- [x] 중복 생성 방지 (서버에서 처리)
- [x] 본인 모임 참여 방지
- [x] 에러 핸들링 (Toast 알림)
- [x] 성공 시 채팅 페이지로 이동

---

**작성일**: 2025-10-07
**버전**: 1.0.0
