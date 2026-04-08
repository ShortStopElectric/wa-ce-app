'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './exam.module.css'
import { FINAL_EXAM, PASS_THRESHOLD_FINAL, MAX_FINAL_ATTEMPTS } from '@/data/modules'

type Phase = 'intro' | 'exam' | 'result'

export default function ExamPage() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [passed, setPassed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [progressData, setProgressData] = useState<{ final_exam_attempts: number; final_exam_passed: boolean; final_exam_unlocked: boolean } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/progress').then(r => r.json()).then(d => {
      setProgressData(d)
      setAttempts(d.final_exam_attempts ?? 0)
      if (d.final_exam_passed) setPassed(true)
    }).finally(() => setLoading(false))
  }, [])

  async function submitExam() {
    setSaving(true)
    const correct = FINAL_EXAM.filter((q, i) => answers[i] === q.ans).length
    const pct = Math.round((correct / FINAL_EXAM.length) * 100)
    setScore(pct)

    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'submit_final', score: pct }),
    })
    const data = await res.json()
    setSaving(false)
    setPassed(data.passed)
    setAttempts(data.attempts)
    setPhase('result')
  }

  if (loading) return <div className={styles.loading}><span className={styles.spinner} />Loading exam…</div>

  if (!progressData?.final_exam_unlocked && !passed) {
    return (
      <div className={styles.locked}>
        <span className={styles.lockIcon}>🔒</span>
        <h2>Final Exam Locked</h2>
        <p>Complete all 12 modules with a passing score of 70% to unlock the final exam.</p>
        <Link href="/dashboard" className={styles.dashLink}>← Back to Dashboard</Link>
      </div>
    )
  }

  if (passed) {
    return (
      <div className={styles.passed}>
        <span className={styles.passIcon}>🎓</span>
        <h2>Final Exam Passed!</h2>
        <p>You scored {score > 0 ? score : progressData?.final_exam_passed ? '—' : score}% and earned your certificate.</p>
        <Link href="/certificate" className={styles.certLink}>View Your Certificate →</Link>
        <Link href="/dashboard" className={styles.dashLink}>← Dashboard</Link>
      </div>
    )
  }

  const attemptsLeft = MAX_FINAL_ATTEMPTS - attempts
  const allAnswered = FINAL_EXAM.every((_, i) => answers[i] !== undefined)

  // ── Intro ──────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link href="/dashboard" className={styles.back}>← Dashboard</Link>
          <span className={styles.headerTitle}>Final Exam</span>
          <span />
        </header>

        <div className={styles.introContent}>
          <div className={styles.introCard}>
            <div className={styles.introIcon}>📝</div>
            <h1 className={styles.introTitle}>WA Electrical CE Final Exam</h1>
            <div className={styles.introStats}>
              <div className={styles.introStat}><span>{FINAL_EXAM.length}</span><label>Questions</label></div>
              <div className={styles.introStat}><span>{PASS_THRESHOLD_FINAL}%</span><label>Pass Score</label></div>
              <div className={styles.introStat}><span>{attemptsLeft}</span><label>Attempts Left</label></div>
            </div>
            <ul className={styles.introRules}>
              <li>100 questions covering all 12 modules</li>
              <li>Must score 75% or higher to pass</li>
              <li>You have {MAX_FINAL_ATTEMPTS} attempts total ({attemptsLeft} remaining)</li>
              <li>Answer all questions before submitting — no partial saves</li>
              <li>Take your time — there is no time limit</li>
            </ul>
            {attemptsLeft > 0 ? (
              <button className={styles.startBtn} onClick={() => setPhase('exam')}>
                Begin Exam →
              </button>
            ) : (
              <div className={styles.noAttempts}>
                <p>You have used all {MAX_FINAL_ATTEMPTS} attempts.</p>
                <p>Contact Short Stop Electrical to request a reset.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Exam ───────────────────────────────────────────────────────────────────
  if (phase === 'exam') {
    return (
      <div className={styles.shell}>
        <header className={styles.header}>
          <button className={styles.back} onClick={() => setPhase('intro')}>← Back</button>
          <span className={styles.headerTitle}>Final Exam — {Object.keys(answers).length}/{FINAL_EXAM.length} answered</span>
          <span />
        </header>

        <main className={styles.examContent}>
          {FINAL_EXAM.map((q, qi) => (
            <div key={qi} className={styles.question}>
              <p className={styles.questionText}><span className={styles.questionNum}>{qi + 1}.</span> {q.q}</p>
              <div className={styles.options}>
                {q.opts.map((opt, oi) => (
                  <button
                    key={oi}
                    className={`${styles.option} ${answers[qi] === oi ? styles.optionSelected : ''}`}
                    onClick={() => setAnswers(a => ({ ...a, [qi]: oi }))}
                  >
                    <span className={styles.optionLetter}>{String.fromCharCode(65 + oi)}</span>
                    {opt}
                  </button>
                ))}
              </div>
              <p className={styles.questionRef}>{q.ref}</p>
            </div>
          ))}

          <div className={styles.submitRow}>
            {!allAnswered && (
              <p className={styles.submitNote}>
                {FINAL_EXAM.length - Object.keys(answers).length} questions unanswered
              </p>
            )}
            <button
              className={styles.submitBtn}
              onClick={submitExam}
              disabled={!allAnswered || saving}
            >
              {saving ? 'Submitting…' : 'Submit Final Exam →'}
            </button>
          </div>
        </main>
      </div>
    )
  }

  // ── Result ─────────────────────────────────────────────────────────────────
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.back}>← Dashboard</Link>
        <span className={styles.headerTitle}>Final Exam Result</span>
        <span />
      </header>

      <div className={styles.resultContent}>
        <div className={`${styles.resultCard} ${passed ? styles.resultPass : styles.resultFail}`}>
          <div className={styles.resultIcon}>{passed ? '🎓' : '❌'}</div>
          <div className={styles.resultScore}>{score}%</div>
          <div className={styles.resultLabel}>{passed ? 'Passed!' : 'Not Passed'}</div>
          <p className={styles.resultSub}>
            {passed
              ? 'Congratulations! You have completed your 24-hour WA CE requirement.'
              : `Need ${PASS_THRESHOLD_FINAL}% to pass. ${attemptsLeft > 0 ? `${attemptsLeft} attempt(s) remaining.` : 'All attempts used — contact SSE to reset.'}`}
          </p>
        </div>

        <div className={styles.resultActions}>
          {passed && (
            <Link href="/certificate" className={styles.certBtn}>
              View Certificate →
            </Link>
          )}
          {!passed && attemptsLeft > 0 && (
            <button className={styles.retryBtn} onClick={() => { setPhase('exam'); setAnswers({}) }}>
              Retake Exam ({attemptsLeft} left)
            </button>
          )}
          <Link href="/dashboard" className={styles.dashBtn}>
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
