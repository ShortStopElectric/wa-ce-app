import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

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

  // Step 1: GET — enroll and return QR
  if (!body.factorId) {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      issuer: 'Short Stop Electrical CE',
      friendlyName: user.email ?? 'user',
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret })
  }

  // Step 2: POST with code — verify and mark enrolled
  const { factorId, code } = body
  const { data: challengeData, error: cErr } = await supabase.auth.mfa.challenge({ factorId })
  if (cErr) return NextResponse.json({ error: cErr.message }, { status: 400 })

  const { error: vErr } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challengeData.id,
    code,
  })
  if (vErr) return NextResponse.json({ error: 'Invalid code — try again' }, { status: 401 })

  // Mark profile as MFA enrolled
  await supabase.from('profiles').update({ mfa_enrolled: true }).eq('id', user.id)

  return NextResponse.json({ ok: true })
}
