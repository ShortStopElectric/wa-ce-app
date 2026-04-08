'use client'

import { useState, useEffect } from 'react'
import styles from './setup-mfa.module.css'

export default function SetupMFAPage() {
  const [factorId, setFactorId] = useState('')
  const [qr, setQr] = useState('')
  const [secret, setSecret] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [enrolling, setEnrolling] = useState(true)

  useEffect(() => {
    fetch('/api/auth/enroll-mfa', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      .then(r => r.json())
      .then(data => {
        if (data.factorId) { setFactorId(data.factorId); setQr(data.qr); setSecret(data.secret) }
        else setError(data.error ?? 'Could not start enrollment')
      })
      .catch(() => setError('Network error'))
      .finally(() => setEnrolling(false))
  }, [])

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/enroll-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ factorId, code }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Verification failed'); return }
      window.location.href = '/dashboard'
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}>🔐</span>
          <h1 className={styles.title}>Set Up Two-Factor Authentication</h1>
          <p className={styles.sub}>Required for course access. Protects your CE records.</p>
        </div>

        {enrolling ? (
          <div className={styles.loading}>Loading QR code…</div>
        ) : error && !factorId ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <>
            <div className={styles.steps}>
              <div className={styles.step}>
                <span className={styles.stepNum}>1</span>
                <p>Install an authenticator app — <strong>Google Authenticator</strong>, <strong>Authy</strong>, or <strong>1Password</strong>.</p>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNum}>2</span>
                <p>Scan the QR code below, or enter the key manually.</p>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNum}>3</span>
                <p>Enter the 6-digit code from the app to confirm.</p>
              </div>
            </div>

            {qr && (
              <div className={styles.qrWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr} alt="TOTP QR Code" className={styles.qr} />
                <div className={styles.secretWrap}>
                  <span className={styles.secretLabel}>Manual entry key:</span>
                  <code className={styles.secret}>{secret}</code>
                </div>
              </div>
            )}

            <form onSubmit={handleVerify} className={styles.form}>
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
                {loading ? 'Verifying…' : 'Activate Two-Factor Auth →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
