'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './admin.module.css'

type Student = {
  id: string
  name: string
  email: string
  license: string
  created_at: string
  completed_modules: number
  final_exam_passed: boolean
  final_score: number | null
  cert_issued: boolean
  cert_number: string | null
  cert_issued_at: string | null
}

export default function AdminPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/students')
      .then(r => r.json())
      .then(({ students: s }) => setStudents(s ?? []))
      .finally(() => setLoading(false))
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.license?.toLowerCase().includes(search.toLowerCase())
  )

  const certCount = students.filter(s => s.cert_issued).length
  const passedCount = students.filter(s => s.final_exam_passed).length
  const inProgressCount = students.filter(s => s.completed_modules > 0 && !s.final_exam_passed).length

  function exportCSV() {
    const headers = ['Name', 'Email', 'License', 'Modules Complete', 'Final Passed', 'Final Score', 'Cert Number', 'Cert Issued', 'Enrolled']
    const rows = students.map(s => [
      s.name, s.email, s.license,
      s.completed_modules,
      s.final_exam_passed ? 'Yes' : 'No',
      s.final_score ?? '',
      s.cert_number ?? '',
      s.cert_issued_at ? new Date(s.cert_issued_at).toLocaleDateString() : '',
      new Date(s.created_at).toLocaleDateString(),
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `sse-ce-students-${new Date().toISOString().slice(0, 10)}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerIcon}>⚡</span>
          <div>
            <div className={styles.headerTitle}>CE Admin</div>
            <div className={styles.headerSub}>Short Stop Electrical LLC</div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <Link href="/dashboard" className={styles.headerLink}>Course View</Link>
          <button className={styles.logoutBtn} onClick={handleLogout}>Sign Out</button>
        </div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Student Dashboard</h1>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{students.length}</span>
            <span className={styles.statLabel}>Total Students</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{inProgressCount}</span>
            <span className={styles.statLabel}>In Progress</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{passedCount}</span>
            <span className={styles.statLabel}>Exam Passed</span>
          </div>
          <div className={`${styles.stat} ${styles.statGreen}`}>
            <span className={styles.statNum}>{certCount}</span>
            <span className={styles.statLabel}>Certs Issued</span>
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <input
            type="search"
            className={styles.search}
            placeholder="Search by name, email, or license…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className={styles.exportBtn} onClick={exportCSV}>
            ⬇ Export CSV
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className={styles.loading}><span className={styles.spinner} />Loading…</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>License</th>
                  <th>Progress</th>
                  <th>Final Exam</th>
                  <th>Certificate</th>
                  <th>Enrolled</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className={styles.empty}>No students found</td></tr>
                ) : filtered.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div className={styles.studentName}>{s.name || '—'}</div>
                      <div className={styles.studentEmail}>{s.email}</div>
                    </td>
                    <td className={styles.license}>{s.license || '—'}</td>
                    <td>
                      <div className={styles.progressCell}>
                        <div className={styles.progressBar}>
                          <div className={styles.progressFill} style={{ width: `${(s.completed_modules / 12) * 100}%` }} />
                        </div>
                        <span className={styles.progressText}>{s.completed_modules}/12</span>
                      </div>
                    </td>
                    <td>
                      {s.final_exam_passed ? (
                        <span className={styles.badgeGreen}>{s.final_score}% ✓</span>
                      ) : s.completed_modules === 12 ? (
                        <span className={styles.badgeAmber}>Unlocked</span>
                      ) : (
                        <span className={styles.badgeGray}>—</span>
                      )}
                    </td>
                    <td>
                      {s.cert_issued ? (
                        <div>
                          <span className={styles.badgeGreen}>Issued</span>
                          <div className={styles.certNum}>{s.cert_number}</div>
                        </div>
                      ) : (
                        <span className={styles.badgeGray}>—</span>
                      )}
                    </td>
                    <td className={styles.dateCell}>
                      {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* L&I note */}
        <div className={styles.liNote}>
          <strong>L&I Reporting:</strong> Export CSV and submit to WA L&I as required.
          CE Provider ID: <code>{process.env.NEXT_PUBLIC_CE_PROVIDER_ID ?? 'WA-CE-PROV-XXXX'}</code>
        </div>
      </main>
    </div>
  )
}
