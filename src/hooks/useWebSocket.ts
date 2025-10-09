import { useEffect, useRef, useState, useCallback } from 'react'
import SockJS from 'sockjs-client'
import { Client, IMessage, StompSubscription } from '@stomp/stompjs'
import { useAuthStore } from '@/stores/useAuthStore'

interface Message {
  id?: number
  chatRoomId: number
  senderId: number
  content: string
  status?: 'SENT' | 'DELIVERED' | 'READ'
  sentAt: string
}

interface UseWebSocketOptions {
  chatRoomId: string
  onMessageReceived?: (message: Message) => void
  onConnected?: () => void
  onDisconnected?: () => void
  onError?: (error: any) => void
}

export const useWebSocket = ({
  chatRoomId,
  onMessageReceived,
  onConnected,
  onDisconnected,
  onError
}: UseWebSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const clientRef = useRef<Client | null>(null)
  const subscriptionRef = useRef<StompSubscription | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { accessToken } = useAuthStore()

  const connect = useCallback(() => {
    if (clientRef.current?.connected) {
      console.log('WebSocket already connected')
      return
    }

    try {
      // Use dedicated WebSocket URL from environment
      const wsUrl = `${import.meta.env.VITE_WS_URL}/ws`
      console.log('Connecting to WebSocket:', wsUrl)

      const socket = new SockJS(wsUrl)
      const client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${accessToken}`
        },
        debug: (str) => {
          console.log('[STOMP Debug]', str)
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log('WebSocket connected')
          setIsConnected(true)
          onConnected?.()

          // Subscribe to chat room
          subscriptionRef.current = client.subscribe(
            `/topic/chat/${chatRoomId}`,
            (message: IMessage) => {
              const receivedMessage = JSON.parse(message.body) as Message
              console.log('[WebSocket] Received message:', receivedMessage)
              onMessageReceived?.(receivedMessage)
            }
          )
        },
        onDisconnect: () => {
          console.log('WebSocket disconnected')
          setIsConnected(false)
          onDisconnected?.()
        },
        onStompError: (frame) => {
          console.error('STOMP error:', frame)
          onError?.(frame)
        },
        onWebSocketError: (error) => {
          console.error('WebSocket error:', error)
          onError?.(error)
        }
      })

      client.activate()
      clientRef.current = client
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
      onError?.(error)

      // Retry connection after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connect()
      }, 3000)
    }
  }, [chatRoomId, accessToken, onConnected, onDisconnected, onError, onMessageReceived])

  const disconnect = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe()
      subscriptionRef.current = null
    }

    if (clientRef.current) {
      clientRef.current.deactivate()
      clientRef.current = null
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    setIsConnected(false)
  }, [])

  const sendMessage = useCallback((content: string) => {
    if (!clientRef.current?.connected) {
      console.error('WebSocket is not connected')
      return
    }

    try {
      const message = {
        content
      }

      clientRef.current.publish({
        destination: `/app/chat/${chatRoomId}`,
        body: JSON.stringify(message)
      })

      console.log('Message sent:', message)
    } catch (error) {
      console.error('Failed to send message:', error)
      onError?.(error)
    }
  }, [chatRoomId, onError])

  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    isConnected,
    messages,
    sendMessage,
    connect,
    disconnect
  }
}
