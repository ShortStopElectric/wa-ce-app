'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from '../login/login.module.css'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Signup failed'); return }
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>⚡</span>
          <div>
            <div className={styles.logoName}>Short Stop Electrical</div>
            <div className={styles.logoCourse}>WA Electrical CE</div>
          </div>
        </div>

        {done ? (
          <div>
            <h1 className={styles.title}>Account Created</h1>
            <p className={styles.subtitle} style={{ marginBottom: 24 }}>
              Your account has been created. Sign in to set up two-factor authentication and start your course.
            </p>
            <Link href="/login" className={styles.btn} style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
              Sign In →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSignup} className={styles.form}>
            <h1 className={styles.title}>Create Account</h1>
            <p className={styles.subtitle}>Register for the WA Electrical CE course</p>

            <label className={styles.label}>Full Name</label>
            <input
              type="text"
              className={styles.input}
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              autoComplete="name"
              required
              placeholder="Jane Smith"
            />

            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
              placeholder="you@example.com"
            />

            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              placeholder="Min. 8 characters"
              minLength={8}
            />

            <label className={styles.label}>Confirm Password</label>
            <input
              type="password"
              className={styles.input}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
              placeholder="Re-enter password"
            />

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>

            <Link href="/login" className={styles.backBtn} style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: 12 }}>
              ← Back to Sign In
            </Link>
          </form>
        )}
      </div>
    </div>
  )
}
