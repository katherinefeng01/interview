import { VapiClient } from "@vapi-ai/server-sdk"

const vapi = new VapiClient({
  token: process.env.VAPI_API_KEY!
})

export async function POST(request: Request, { params }: { params: { callId: string } }) {
  try {
    // try to update status field to ended (may not work)
    await vapi.calls.update(params.callId, { status: 'ended' })
    return Response.json({ success: true })
  } catch (error) {
    console.error('Failed to end call:', error)
    return Response.json({ error: 'Failed to end call' }, { status: 500 })
  }
}
