import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

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

export async function GET() {
  const supabase = makeSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('course_progress')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code === 'PGRST116') {
    // No row yet — return empty progress
    return NextResponse.json(emptyProgress())
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const supabase = makeSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { module_num, score, action } = body

  if (action === 'start_module') {
    const { data: existing } = await supabase
      .from('course_progress')
      .select('modules')
      .eq('user_id', user.id)
      .single()

    const modules = existing?.modules ?? emptyProgress().modules
    const idx = modules.findIndex((m: { module_num: number }) => m.module_num === module_num)
    if (idx >= 0) modules[idx].started = true
    else modules.push({ module_num, started: true, completed: false, score: null, completed_at: null })

    await supabase.from('course_progress').upsert({ user_id: user.id, modules }, { onConflict: 'user_id' })
    return NextResponse.json({ ok: true })
  }

  if (action === 'complete_module') {
    const { data: existing } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const modules = existing?.modules ?? emptyProgress().modules
    const idx = modules.findIndex((m: { module_num: number }) => m.module_num === module_num)
    const passed = score >= 70

    if (idx >= 0) {
      modules[idx] = { ...modules[idx], completed: passed, score, completed_at: passed ? new Date().toISOString() : null }
    } else {
      modules.push({ module_num, started: true, completed: passed, score, completed_at: passed ? new Date().toISOString() : null })
    }

    const allPassed = modules.filter((m: { completed: boolean }) => m.completed).length === 12
    const updates: Record<string, unknown> = { modules }
    if (allPassed) updates.final_exam_unlocked = true

    await supabase.from('course_progress').upsert({ user_id: user.id, ...existing, ...updates }, { onConflict: 'user_id' })
    return NextResponse.json({ ok: true, passed, score })
  }

  if (action === 'submit_final') {
    const { data: existing } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!existing?.final_exam_unlocked) {
      return NextResponse.json({ error: 'Final exam not unlocked' }, { status: 403 })
    }

    const attempts = (existing.final_exam_attempts ?? 0) + 1
    if (attempts > 3) return NextResponse.json({ error: 'Max attempts exceeded' }, { status: 403 })

    const passed = score >= 75
    const updates: Record<string, unknown> = {
      final_exam_attempts: attempts,
      final_score: score,
      final_exam_passed: passed,
    }

    // Record attempt in final_exams table
    await supabase.from('final_exams').insert({
      user_id: user.id,
      attempt: attempts,
      score,
      passed,
      taken_at: new Date().toISOString(),
    })

    await supabase.from('course_progress').upsert({ user_id: user.id, ...existing, ...updates }, { onConflict: 'user_id' })
    return NextResponse.json({ ok: true, passed, score, attempts })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

function emptyProgress() {
  return {
    modules: Array.from({ length: 12 }, (_, i) => ({
      module_num: i + 1,
      started: false,
      completed: false,
      score: null,
      completed_at: null,
    })),
    final_exam_unlocked: false,
    final_exam_attempts: 0,
    final_exam_passed: false,
    final_score: null,
    cert_issued: false,
  }
}
