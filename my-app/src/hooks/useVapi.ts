'use client'

import { useState, useRef, useEffect } from 'react'

export const useVapi = () => {
  const [isCallActive, setIsCallActive] = useState(false)
  const [currentCallId, setCurrentCallId] = useState<string | null>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // check if call ended 
  const pollCallStatus = async (callId: string) => {
    try {
      // check status of call
      const response = await fetch(`/api/get-call/${callId}`)
      if (response.ok) {
        const callData = await response.json()
        if (callData.status === 'ended') {
          console.log('Call ended:', {
            endedAt: callData.endedAt,
            endedReason: callData.endedReason,
            transcript: callData.transcript
          })
          // reset state
          setIsCallActive(false)
          setCurrentCallId(null)
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
            pollIntervalRef.current = null
          }
        }
      }
    } catch (error) {
      console.error('Failed to poll call status:', error)
    }
  }

  // start vapi call
  const startCall = async (phoneNumber: string) => {
    const startTime = new Date().toISOString()
    console.log('Call started at:', startTime)
    
    setIsCallActive(true)
    try {
      // invoke start call API
      const response = await fetch('/api/start-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      })
      
      // throw error if API fails
      if (!response.ok) {
        throw new Error('Failed to start call')
      }
      
      // get call id from API response
      const data = await response.json()
      setCurrentCallId(data.callId)
      console.log('Call ID:', data.callId)
      
      // start polling every 3 sec to check if call ended
      pollIntervalRef.current = setInterval(() => {
        pollCallStatus(data.callId)
      }, 3000) 
      
    } catch (error) {
      console.error('Failed to start call:', error)
      setIsCallActive(false)
    }
  }

  // end vapi call (from UI)
  const endCall = async () => {
    if (currentCallId) {
      try {
        // invoke end call API
        await fetch(`/api/end-call/${currentCallId}`, { method: 'POST' })
        console.log('Call ended via UI')
      } catch (error) {
        console.error('Failed to end call:', error)
      }
    }
    
    // reset state
    setIsCallActive(false)
    setCurrentCallId(null)
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [])

  return { startCall, endCall, isCallActive }
}
