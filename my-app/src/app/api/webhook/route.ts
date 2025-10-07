// webhook receiver for vapi status updates
export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    console.log('Webhook received:', message.type)
    
    // check if call ended
    if (message.type === 'status-update' && message.call?.status === 'ended') {
      console.log('Call ended via webhook:', {
        callId: message.call.id,
        endedAt: message.call.endedAt,
        endedReason: message.call.endedReason
      })
      
      // todo: emit this to connected clients via websocket 
    }

    return Response.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return Response.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
