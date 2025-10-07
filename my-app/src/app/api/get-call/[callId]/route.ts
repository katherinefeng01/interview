import { VapiClient } from "@vapi-ai/server-sdk"

const vapi = new VapiClient({
  token: process.env.VAPI_API_KEY!
})

export async function GET(request: Request, { params }: { params: { callId: string } }) {
  try {
    const call = await vapi.calls.get(params.callId)
    
    console.log('Call details:', {
      id: call.id,
      status: call.status,
      startedAt: call.startedAt,
      endedAt: call.endedAt,
      endedReason: call.endedReason,
      transcript: call.artifact?.transcript
    })
    
    return Response.json({
      id: call.id,
      status: call.status,
      startedAt: call.startedAt,
      endedAt: call.endedAt,
      endedReason: call.endedReason,
      transcript: call.artifact?.transcript
    })
  } catch (error) {
    console.error('Failed to get call:', error)
    return Response.json({ error: 'Failed to get call' }, { status: 500 })
  }
}
