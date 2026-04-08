import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  )

  // Verify caller is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: callerProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (callerProfile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name, email, license, role, created_at')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  const { data: progressRows } = await supabase
    .from('course_progress')
    .select('user_id, modules, final_exam_passed, final_score, cert_issued, final_exam_attempts')

  const { data: certs } = await supabase
    .from('certificates')
    .select('user_id, cert_number, issued_at, expires_at')

  const students = (profiles ?? []).map(p => {
    const prog = progressRows?.find(r => r.user_id === p.id)
    const cert = certs?.find(c => c.user_id === p.id)
    const completedModules = prog?.modules?.filter((m: { completed: boolean }) => m.completed).length ?? 0
    return {
      ...p,
      completed_modules: completedModules,
      final_exam_passed: prog?.final_exam_passed ?? false,
      final_score: prog?.final_score ?? null,
      cert_issued: prog?.cert_issued ?? false,
      cert_number: cert?.cert_number ?? null,
      cert_issued_at: cert?.issued_at ?? null,
    }
  })

  return NextResponse.json({ students })
}
