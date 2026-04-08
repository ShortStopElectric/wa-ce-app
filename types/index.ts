// ── Course types ──────────────────────────────────────────────────────────────

export type CourseSection = {
  id: string
  title: string
  ref: string
  body: string
  points: string[]
}

export type QuizQuestion = {
  q: string
  opts: string[]
  ans: number
  ref: string
  exp: string
}

export type CourseModule = {
  num: number
  title: string
  ref: string
  hours: number
  sections: CourseSection[]
  quiz: QuizQuestion[]
}

// ── User / auth types ─────────────────────────────────────────────────────────

export type UserRole = 'student' | 'admin'

export type Profile = {
  id: string
  email: string
  name: string
  license: string
  role: UserRole
  mfa_enrolled: boolean
  created_at: string
}

// ── Progress types ────────────────────────────────────────────────────────────

export type ModuleStatus = {
  module_num: number
  completed: boolean
  score: number | null
  started: boolean
  completed_at: string | null
}

export type CourseProgress = {
  modules: ModuleStatus[]        // 12 entries
  final_exam_unlocked: boolean
  final_exam_attempts: number
  final_exam_passed: boolean
  final_score: number | null
  cert_issued: boolean
}

// ── Certificate ───────────────────────────────────────────────────────────────

export type Certificate = {
  id: string
  user_id: string
  cert_number: string
  issued_at: string
  expires_at: string
  final_score: number
  profile: Profile
}
