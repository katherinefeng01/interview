import { VapiClient } from "@vapi-ai/server-sdk"

const vapi = new VapiClient({
  token: process.env.VAPI_API_KEY!
})

// get recent calls and display in UI
export async function GET() {
  try {
    // fetch last 5 calls
    const calls = await vapi.calls.list({ limit: 5 })

    // get call id, timestamps, and transcript if not null 
    const recentCalls = calls.map(call => ({
      id: call.id,
      startedAt: call.startedAt,
      endedAt: call.endedAt,
      transcript: call.artifact?.transcript || 'No transcript available'
      // can add more metadata here
    }))
    
    return Response.json(recentCalls)
  } catch (error) {
    console.error('Failed to get recent calls:', error)
    return Response.json({ error: 'Failed to get recent calls' }, { status: 500 })
  }
}
