import client from './client'
import type { ApiResponse } from '@/types/auth'
import type { ConfirmedParticipant } from '@/types/user'
import type { Gathering, CreateGatheringRequest, PageableResponse } from '@/types/meeting'

export const gatheringApi = {
  // 모임 목록 조회
  getGatherings: async (params?: {
    page?: number
    size?: number
    sort?: string
    team?: string
  }): Promise<ApiResponse<PageableResponse<Gathering>>> => {
    const queryParams = new URLSearchParams()
    if (params?.page !== undefined) queryParams.append('page', params.page.toString())
    if (params?.size !== undefined) queryParams.append('size', params.size.toString())
    if (params?.sort) queryParams.append('sort', params.sort)
    if (params?.team) queryParams.append('team', params.team)

    const url = `/gatherings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return await client.get(url)
  },

  // 모임 상세 조회
  getGathering: async (id: number): Promise<ApiResponse<Gathering>> => {
    return await client.get(`/gatherings/${id}`)
  },

  // 모임 생성
  createGathering: async (data: CreateGatheringRequest): Promise<ApiResponse<Gathering>> => {
    return await client.post('/gatherings', data)
  },

  // 모임 참여자 확정 (호스트만 가능)
  confirmParticipant: async (gatheringId: number, participantUserId: number): Promise<ApiResponse<void>> => {
    return await client.post(`/gatherings/${gatheringId}/confirm`, {
      participantUserId
    })
  },

  // 확정된 참여자 목록 조회
  getParticipants: async (gatheringId: number): Promise<ApiResponse<ConfirmedParticipant[]>> => {
    return await client.get(`/gatherings/${gatheringId}/participants`)
  },

  // 모임 참여자 취소 (호스트만 가능)
  cancelParticipant: async (gatheringId: number, participantUserId: number): Promise<ApiResponse<void>> => {
    return await client.delete(`/gatherings/${gatheringId}/participants/${participantUserId}`)
  },

  // 내가 참여 중인 모임 목록 조회
  getMyParticipatingGatherings: async (): Promise<ApiResponse<Gathering[]>> => {
    return await client.get('/gatherings/my-participating')
  },
}
