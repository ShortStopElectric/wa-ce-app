'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './module.module.css'
import { getModule } from '@/data/modules'
import { PASS_THRESHOLD_MODULE } from '@/data/modules'
import { SECTION_ILLUSTRATIONS } from '@/components/illustrations/ModuleIllustrations'

type Phase = 'reading' | 'quiz' | 'result'

export default function ModulePage({ params }: { params: { id: string } }) {
  const moduleNum = parseInt(params.id)
  const mod = getModule(moduleNum)

  const [phase, setPhase] = useState<Phase>('reading')
  const [sectionIdx, setSectionIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!mod) return
    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'start_module', module_num: moduleNum }),
    })
  }, [moduleNum, mod])

  if (!mod) return (
    <div className={styles.notFound}>
      Module {moduleNum} not found. <Link href="/dashboard">← Dashboard</Link>
    </div>
  )

  const section = mod.sections[sectionIdx]
  const isLastSection = sectionIdx === mod.sections.length - 1

  async function submitQuiz() {
    setSaving(true)
    const correct = mod!.quiz.filter((q, i) => answers[i] === q.ans).length
    const pct = Math.round((correct / mod!.quiz.length) * 100)
    setScore(pct)
    setSubmitted(true)

    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'complete_module', module_num: moduleNum, score: pct }),
    })
    setSaving(false)
    setPhase('result')
  }

  // ── Reading phase ─────────────────────────────────────────────────────────────
  if (phase === 'reading') {
    return (
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link href="/dashboard" className={styles.back}>← Dashboard</Link>
          <div className={styles.headerCenter}>
            <span className={styles.modBadge}>Module {mod.num}</span>
            <span className={styles.modTitle}>{mod.title}</span>
          </div>
          <span className={styles.headerHours}>{mod.hours} hrs · {mod.ref}</span>
        </header>

        <div className={styles.sectionNav}>
          {mod.sections.map((s, i) => (
            <button
              key={s.id}
              className={`${styles.sectionTab} ${i === sectionIdx ? styles.sectionTabActive : ''} ${i < sectionIdx ? styles.sectionTabDone : ''}`}
              onClick={() => setSectionIdx(i)}
            >
              {i + 1}. {s.title.length > 30 ? s.title.slice(0, 28) + '…' : s.title}
            </button>
          ))}
        </div>

        <main className={styles.content}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            <span className={styles.sectionRef}>{section.ref}</span>
          </div>

          <p className={styles.sectionBody}>{section.body}</p>

          {SECTION_ILLUSTRATIONS[section.id] && (
            <div className={styles.illustrationWrap}>
              {(() => { const Illus = SECTION_ILLUSTRATIONS[section.id]; return <Illus /> })()}
            </div>
          )}

          {section.points.length > 0 && (
            <ul className={styles.points}>
              {section.points.map((pt, i) => (
                <li key={i} className={styles.point}>{pt}</li>
              ))}
            </ul>
          )}

          <div className={styles.sectionFooter}>
            {sectionIdx > 0 && (
              <button className={styles.navBtn} onClick={() => setSectionIdx(s => s - 1)}>← Previous</button>
            )}
            {!isLastSection ? (
              <button className={`${styles.navBtn} ${styles.navBtnPrimary}`} onClick={() => setSectionIdx(s => s + 1)}>
                Next Section →
              </button>
            ) : (
              <button className={`${styles.navBtn} ${styles.navBtnAmber}`} onClick={() => setPhase('quiz')}>
                Take Module Quiz →
              </button>
            )}
          </div>
        </main>
      </div>
    )
  }

  // ── Quiz phase ────────────────────────────────────────────────────────────────
  if (phase === 'quiz') {
    const allAnswered = mod.quiz.every((_, i) => answers[i] !== undefined)

    return (
      <div className={styles.shell}>
        <header className={styles.header}>
          <button className={styles.back} onClick={() => setPhase('reading')}>← Back to Reading</button>
          <div className={styles.headerCenter}>
            <span className={styles.modBadge}>Module {mod.num} Quiz</span>
            <span className={styles.modTitle}>{mod.quiz.length} questions · Pass at {PASS_THRESHOLD_MODULE}%</span>
          </div>
          <span className={styles.headerHours}>{Object.keys(answers).length}/{mod.quiz.length} answered</span>
        </header>

        <main className={styles.quizContent}>
          {mod.quiz.map((q, qi) => (
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
              <p className={styles.submitNote}>Answer all {mod.quiz.length} questions to submit</p>
            )}
            <button
              className={`${styles.navBtn} ${styles.navBtnAmber} ${styles.submitBtn}`}
              onClick={submitQuiz}
              disabled={!allAnswered || saving}
            >
              {saving ? 'Saving…' : 'Submit Quiz →'}
            </button>
          </div>
        </main>
      </div>
    )
  }

  // ── Result phase ──────────────────────────────────────────────────────────────
  const passed = score >= PASS_THRESHOLD_MODULE
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.back}>← Dashboard</Link>
        <div className={styles.headerCenter}>
          <span className={styles.modBadge}>Module {mod.num}</span>
          <span className={styles.modTitle}>Quiz Result</span>
        </div>
        <span />
      </header>

      <main className={styles.resultContent}>
        <div className={`${styles.resultCard} ${passed ? styles.resultPass : styles.resultFail}`}>
          <div className={styles.resultIcon}>{passed ? '✅' : '❌'}</div>
          <div className={styles.resultScore}>{score}%</div>
          <div className={styles.resultLabel}>{passed ? 'Passed!' : 'Not Passed'}</div>
          <p className={styles.resultSub}>
            {passed
              ? `You passed Module ${mod.num} with ${score}%. ${mod.hours} CE hours credited.`
              : `You need ${PASS_THRESHOLD_MODULE}% to pass. Review the material and try again.`}
          </p>
        </div>

        {!passed && (
          <div className={styles.reviewSection}>
            <h3 className={styles.reviewTitle}>Review Incorrect Answers</h3>
            {mod.quiz.map((q, qi) => {
              if (answers[qi] === q.ans) return null
              return (
                <div key={qi} className={styles.reviewItem}>
                  <p className={styles.reviewQ}>{qi + 1}. {q.q}</p>
                  <p className={styles.reviewYours}>Your answer: {q.opts[answers[qi]] ?? '(no answer)'}</p>
                  <p className={styles.reviewCorrect}>Correct: {q.opts[q.ans]}</p>
                  <p className={styles.reviewExp}>{q.exp} <span className={styles.reviewRef}>{q.ref}</span></p>
                </div>
              )
            })}
          </div>
        )}

        <div className={styles.resultActions}>
          {!passed && (
            <button className={`${styles.navBtn} ${styles.navBtnPrimary}`} onClick={() => {
              setPhase('reading'); setSectionIdx(0); setAnswers({}); setSubmitted(false)
            }}>
              Review Material
            </button>
          )}
          {!passed && (
            <button className={`${styles.navBtn} ${styles.navBtnAmber}`} onClick={() => {
              setPhase('quiz'); setAnswers({}); setSubmitted(false)
            }}>
              Retake Quiz
            </button>
          )}
          {passed && (
            <Link href="/dashboard" className={`${styles.navBtn} ${styles.navBtnAmber}`}>
              Back to Dashboard →
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}
