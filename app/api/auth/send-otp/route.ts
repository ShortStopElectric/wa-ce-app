import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

function getTwilio() {
  const sid = process.env.TWILIO_ACCOUNT_SID!
  const token = process.env.TWILIO_AUTH_TOKEN!
  const verifySid = process.env.TWILIO_VERIFY_SID!
  const auth = Buffer.from(`${sid}:${token}`).toString('base64')
  return { auth, url: `https://verify.twilio.com/v2/Services/${verifySid}/Verifications` }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
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

  // Use provided phone (setup flow) or look up from profile (login flow)
  let phone: string = body.phone
  if (!phone) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('phone_number')
      .eq('id', user.id)
      .single()
    phone = profile?.phone_number
  }

  if (!phone) {
    return NextResponse.json({ error: 'No phone number on file' }, { status: 400 })
  }

  const { auth, url } = getTwilio()
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ To: phone, Channel: 'sms' }).toString(),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return NextResponse.json({ error: err.message ?? 'Failed to send SMS' }, { status: 400 })
  }

  const masked = phone.replace(/(\+\d{1,3})\d+(\d{4})$/, '$1*****$2')
  return NextResponse.json({ masked_phone: masked })
}
