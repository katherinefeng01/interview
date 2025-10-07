'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExampleApiUsage } from "@/components/example-api-usage"
import { useVapi } from "@/hooks/useVapi"

interface RecentCall {
  id: string
  startedAt: string | null
  endedAt: string | null
  transcript: string
}

export default function Home() {
  // set states for phone number and recent calls (+transcripts)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [recentCalls, setRecentCalls] = useState<RecentCall[]>([])
  const { startCall, endCall, isCallActive } = useVapi()

  // start call with phone number
  const handleStartCall = () => {
    if (phoneNumber.trim()) {
      startCall(phoneNumber)
    }
  }

  // get recent calls 
  const fetchRecentCalls = async () => {
    try {
      const response = await fetch('/api/recent-calls')
      if (response.ok) {
        const calls = await response.json()
        setRecentCalls(calls)
      }
    } catch (error) {
      console.error('Failed to fetch recent calls:', error)
    }
  }

  useEffect(() => {
    fetchRecentCalls()
  }, [])

  return (
    <main className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AI Phone Screen Operator Console</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Start New Call</CardTitle>
              <CardDescription>
                Initiate an automated phone screen with a candidate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isCallActive}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleStartCall} 
                  disabled={!phoneNumber.trim() || isCallActive}
                >
                  {isCallActive ? "Call Active..." : "Start Call"}
                </Button>
                {/* Show end call button only when call is active */}
                {isCallActive && (
                  <Button variant="destructive" onClick={endCall}>
                    End Call
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Calls</CardTitle>
              <CardDescription>
                View transcripts and details from previous screening calls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={fetchRecentCalls} className="mb-4">
                Refresh
              </Button>
              <div className="space-y-4">
                {/* Render each recent call */}
                {recentCalls.map((call) => (
                  <div key={call.id} className="border rounded p-4">
                    <div className="text-sm text-muted-foreground mb-2">
                      Call ID: {call.id}
                    </div>
                    <div className="text-sm mb-2">
                      Started: {call.startedAt ? new Date(call.startedAt).toLocaleString() : 'N/A'}
                    </div>
                    <div className="text-sm mb-2">
                      Ended: {call.endedAt ? new Date(call.endedAt).toLocaleString() : 'N/A'}
                    </div>
                    <div className="text-sm">
                      <strong>Transcript:</strong>
                      <div className="mt-1 p-2 bg-gray-50 rounded text-xs">
                        {call.transcript}
                      </div>
                    </div>
                  </div>
                ))}
                {/* Show message when no calls exist */}
                {recentCalls.length === 0 && (
                  <p className="text-muted-foreground">No recent calls found.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <ExampleApiUsage />
        </div>
      </div>
    </main>
  )
}
