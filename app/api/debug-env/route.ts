import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    has_sid: !!process.env.TWILIO_ACCOUNT_SID,
    sid_prefix: process.env.TWILIO_ACCOUNT_SID?.slice(0, 4),
    has_token: !!process.env.TWILIO_AUTH_TOKEN,
    token_length: process.env.TWILIO_AUTH_TOKEN?.length,
    has_verify: !!process.env.TWILIO_VERIFY_SID,
    verify_prefix: process.env.TWILIO_VERIFY_SID?.slice(0, 4),
  })
}
