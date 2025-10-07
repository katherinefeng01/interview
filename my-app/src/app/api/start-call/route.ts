import { VapiClient } from "@vapi-ai/server-sdk"

const vapi = new VapiClient({
  token: process.env.VAPI_API_KEY!
})

export async function POST(request: Request) {
  try {
    // get phone number from UI
    const { phoneNumber } = await request.json()

    // initiate call via Vapi
    const call = await vapi.calls.create({
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID!,
      customer: { number: phoneNumber },
      assistantId: process.env.VAPI_ASSISTANT_ID!
    })

    console.log('Full call response:', JSON.stringify(call, null, 2))
    
    // if (call.endedReason) {
    //   console.log('Call ended reason:', call.endedReason)
    // }

    return Response.json({ 
      callId: call.id,
      startedAt: call.startedAt
    })
  } catch (error) {
    console.error('Failed to start call:', error)
    return Response.json({ error: 'Failed to start call' }, { status: 500 })
  }
}
