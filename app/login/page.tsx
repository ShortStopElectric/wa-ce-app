'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './login.module.css'

type Step = 'credentials' | 'sms'

export default function LoginPage() {
  const [step, setStep] = useState<Step>('credentials')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [maskedPhone, setMaskedPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Login failed'); return }

      if (data.mfa_enrolled) {
        // Send SMS code to the user's phone on file
        const otpRes = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        })
        const otpData = await otpRes.json()
        if (!otpRes.ok) { setError(otpData.error ?? 'Could not send code'); return }
        setMaskedPhone(otpData.masked_phone)
        setStep('sms')
      } else {
        window.location.href = '/setup-mfa'
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Invalid code'); return }
      window.location.href = '/dashboard'
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Could not resend')
      }
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

        {step === 'credentials' ? (
          <>
            <form onSubmit={handleLogin} className={styles.form}>
              <h1 className={styles.title}>Sign In</h1>
              <p className={styles.subtitle}>Access your continuing education course</p>

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
                autoComplete="current-password"
                required
                placeholder="••••••••"
              />

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" className={styles.btn} disabled={loading}>
                {loading ? 'Signing in…' : 'Continue →'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--gray-400)' }}>
              No account?{' '}
              <Link href="/signup" style={{ color: 'var(--amber)', textDecoration: 'none', fontWeight: 600 }}>
                Create one
              </Link>
            </p>
          </>
        ) : (
          <form onSubmit={handleVerify} className={styles.form}>
            <h1 className={styles.title}>Check Your Phone</h1>
            <p className={styles.subtitle}>
              We sent a 6-digit code to {maskedPhone}
            </p>

            <label className={styles.label}>Verification Code</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              className={styles.input}
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              autoComplete="one-time-code"
              required
              placeholder="000000"
              autoFocus
            />

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.btn} disabled={loading || code.length !== 6}>
              {loading ? 'Verifying…' : 'Verify →'}
            </button>

            <button
              type="button"
              className={styles.backBtn}
              onClick={handleResend}
              disabled={loading}
            >
              Resend code
            </button>

            <button
              type="button"
              className={styles.backBtn}
              onClick={() => { setStep('credentials'); setError(''); setCode('') }}
            >
              ← Back to sign in
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
