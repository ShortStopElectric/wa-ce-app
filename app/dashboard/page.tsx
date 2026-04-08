'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './dashboard.module.css'
import { MODULES, TOTAL_HOURS } from '@/data/modules'
import type { CourseProgress } from '@/types'

export default function DashboardPage() {
  const [progress, setProgress] = useState<CourseProgress | null>(null)
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/progress').then(r => r.json()),
      import('@/lib/supabase').then(({ createClient }) => createClient().auth.getUser()),
    ]).then(([prog, { data: { user } }]) => {
      setProgress(prog)
      setUserName(user?.email?.split('@')[0] ?? 'student')
    }).finally(() => setLoading(false))
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  if (loading) return <div className={styles.loading}><span className={styles.spinner} />Loading your course…</div>

  const completedCount = progress?.modules?.filter(m => m.completed).length ?? 0
  const totalHoursEarned = completedCount * 2
  const allModulesComplete = completedCount === 12

  return (
    <div className={styles.shell}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerIcon}>⚡</span>
          <div>
            <div className={styles.headerTitle}>WA Electrical CE</div>
            <div className={styles.headerSub}>Short Stop Electrical LLC</div>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>Sign Out</button>
      </header>

      <main className={styles.main}>
        {/* Welcome banner */}
        <div className={styles.welcome}>
          <div>
            <h1 className={styles.welcomeName}>Welcome, {userName}</h1>
            <p className={styles.welcomeSub}>Washington State 24-Hour Continuing Education</p>
          </div>
          <div className={styles.progressSummary}>
            <div className={styles.progressStat}>
              <span className={styles.progressNum}>{totalHoursEarned}</span>
              <span className={styles.progressLabel}>/ {TOTAL_HOURS} hrs</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${(totalHoursEarned / TOTAL_HOURS) * 100}%` }} />
            </div>
            <div className={styles.progressModules}>{completedCount} of 12 modules complete</div>
          </div>
        </div>

        {/* Final exam / cert CTAs */}
        {progress?.final_exam_passed && (
          <Link href="/certificate" className={styles.certBanner}>
            <span>🎓</span>
            <div>
              <strong>Certificate Ready!</strong>
              <span>Download your WA CE certificate — {progress.final_score}% final score</span>
            </div>
            <span className={styles.certArrow}>→</span>
          </Link>
        )}

        {allModulesComplete && !progress?.final_exam_passed && (
          <Link href="/exam" className={styles.examBanner}>
            <span>📝</span>
            <div>
              <strong>Final Exam Unlocked</strong>
              <span>Complete the 100-question final exam to earn your certificate</span>
            </div>
            <span className={styles.certArrow}>→</span>
          </Link>
        )}

        {/* Module grid */}
        <h2 className={styles.sectionTitle}>Course Modules</h2>
        <div className={styles.moduleGrid}>
          {MODULES.map((mod, idx) => {
            const modProgress = progress?.modules?.find(m => m.module_num === mod.num)
            const prevComplete = idx === 0 || (progress?.modules?.find(m => m.module_num === mod.num - 1)?.completed ?? false)
            const locked = !prevComplete && !modProgress?.started
            const completed = modProgress?.completed ?? false
            const started = modProgress?.started ?? false

            return (
              <div key={mod.num} className={`${styles.moduleCard} ${completed ? styles.done : ''} ${locked ? styles.locked : ''}`}>
                <div className={styles.moduleNum}>Module {mod.num}</div>
                <div className={styles.moduleTitle}>{mod.title}</div>
                <div className={styles.moduleMeta}>
                  <span>{mod.hours} hrs</span>
                  {completed && <span className={styles.score}>{modProgress?.score}%</span>}
                  {!completed && started && <span className={styles.inProgress}>In progress</span>}
                  {locked && <span className={styles.lockIcon}>🔒</span>}
                </div>
                {!locked && (
                  <Link
                    href={`/module/${mod.num}`}
                    className={`${styles.moduleBtn} ${completed ? styles.moduleBtnDone : ''}`}
                  >
                    {completed ? 'Review' : started ? 'Continue' : 'Start'}
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
