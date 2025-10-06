import client from './client'
import type { ApiResponse } from '@/types/auth'
import type { Gathering, CreateGatheringRequest, PageableResponse } from '@/types/meeting'

export const gatheringApi = {
  // 모임 목록 조회
  getGatherings: async (params?: {
    page?: number
    size?: number
    sort?: string
  }): Promise<ApiResponse<PageableResponse<Gathering>>> => {
    const queryParams = new URLSearchParams()
    if (params?.page !== undefined) queryParams.append('page', params.page.toString())
    if (params?.size !== undefined) queryParams.append('size', params.size.toString())
    if (params?.sort) queryParams.append('sort', params.sort)

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
}
