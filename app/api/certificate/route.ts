import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { CertificatePDF } from '@/components/CertificatePDF'
import { getResend, FROM_ADDRESS } from '@/lib/resend'
import { v4 as uuidv4 } from 'uuid'

function makeSupabase() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  )
}

export async function POST() {
  const supabase = makeSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify final exam passed
  const { data: progress } = await supabase
    .from('course_progress')
    .select('final_exam_passed, final_score, cert_issued')
    .eq('user_id', user.id)
    .single()

  if (!progress?.final_exam_passed) {
    return NextResponse.json({ error: 'Final exam not passed' }, { status: 403 })
  }

  // Get or create certificate
  const { data: existing } = await supabase
    .from('certificates')
    .select('*')
    .eq('user_id', user.id)
    .single()

  let cert = existing

  if (!cert) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, license, email')
      .eq('id', user.id)
      .single()

    const year = new Date().getFullYear()
    const certNumber = `CE-WA-${year}-${String(Math.floor(10000 + Math.random() * 90000))}`
    const issuedAt = new Date().toISOString()
    const expiresAt = new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString()

    const { data: newCert, error: certErr } = await supabase
      .from('certificates')
      .insert({
        id: uuidv4(),
        user_id: user.id,
        cert_number: certNumber,
        issued_at: issuedAt,
        expires_at: expiresAt,
        final_score: progress.final_score,
        name: profile?.name ?? user.email,
        license: profile?.license ?? '',
      })
      .select()
      .single()

    if (certErr) return NextResponse.json({ error: certErr.message }, { status: 500 })

    cert = newCert

    // Mark cert_issued
    await supabase.from('course_progress').update({ cert_issued: true }).eq('user_id', user.id)

    // Generate PDF
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(
      createElement(CertificatePDF, {
        name: profile?.name ?? user.email ?? '',
        license: profile?.license ?? '',
        certNumber,
        issuedAt,
        expiresAt,
        finalScore: progress.final_score ?? 0,
        providerId: process.env.NEXT_PUBLIC_CE_PROVIDER_ID ?? 'WA-CE-PROV',
      }) as any
    )

    // Send email with PDF
    await getResend().emails.send({
      from: FROM_ADDRESS,
      to: user.email!,
      subject: `Your WA Electrical CE Certificate — ${certNumber}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#0B1A2E;padding:24px;text-align:center">
            <h1 style="color:#F5A623;margin:0">Short Stop Electrical LLC</h1>
            <p style="color:#94A3B8;margin:8px 0 0">Washington State CE Provider</p>
          </div>
          <div style="padding:32px 24px">
            <h2 style="color:#0B1A2E">Congratulations, ${profile?.name ?? 'student'}!</h2>
            <p style="color:#334155;line-height:1.6;margin-top:12px">
              You have successfully completed your 24-hour Washington State continuing education requirement.
              Your certificate is attached to this email.
            </p>
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:16px;margin:24px 0">
              <p style="margin:0;color:#64748B;font-size:13px">Certificate Number</p>
              <p style="margin:4px 0 0;color:#0B1A2E;font-size:18px;font-weight:700">${certNumber}</p>
            </div>
            <p style="color:#64748B;font-size:13px">
              Final Exam Score: <strong>${progress.final_score}%</strong> &nbsp;·&nbsp;
              Valid through: <strong>${new Date(cert.expires_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
            </p>
            <p style="color:#64748B;font-size:12px;margin-top:24px">
              Keep this certificate on file for your WA L&I license renewal.
            </p>
          </div>
        </div>
      `,
      attachments: [{
        filename: `WA-CE-Certificate-${certNumber}.pdf`,
        content: pdfBuffer,
      }],
    })
  }

  return NextResponse.json({ cert })
}

export async function GET() {
  const supabase = makeSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: cert } = await supabase
    .from('certificates')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, license')
    .eq('id', user.id)
    .single()

  return NextResponse.json({ cert, profile })
}
