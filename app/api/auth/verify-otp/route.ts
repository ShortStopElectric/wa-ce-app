import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

function getTwilio() {
  const sid = process.env.TWILIO_ACCOUNT_SID!
  const token = process.env.TWILIO_AUTH_TOKEN!
  const verifySid = process.env.TWILIO_VERIFY_SID!
  const auth = Buffer.from(`${sid}:${token}`).toString('base64')
  return { auth, url: `https://verify.twilio.com/v2/Services/${verifySid}/VerificationCheck` }
}

export async function POST(req: Request) {
  const { code, phone, setup } = await req.json()
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Resolve phone: provided (setup) or from profile (login)
  let verifyPhone: string = phone
  if (!verifyPhone) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('phone_number')
      .eq('id', user.id)
      .single()
    verifyPhone = profile?.phone_number
  }

  if (!verifyPhone) return NextResponse.json({ error: 'No phone on file' }, { status: 400 })

  const { auth, url } = getTwilio()
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ To: verifyPhone, Code: code }).toString(),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.status !== 'approved') {
    return NextResponse.json({ error: 'Invalid code — try again' }, { status: 401 })
  }

  // Setup flow: save phone and mark enrolled
  if (setup) {
    await supabase
      .from('profiles')
      .update({ phone_number: verifyPhone, mfa_enrolled: true })
      .eq('id', user.id)
  }

  return NextResponse.json({ ok: true })
}
