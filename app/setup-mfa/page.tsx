'use client'

import { useState } from 'react'
import styles from './setup-mfa.module.css'

type Step = 'phone' | 'code'

export default function SetupMFAPage() {
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [maskedPhone, setMaskedPhone] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function formatPhone(raw: string) {
    // Ensure E.164 format, default to +1 if no country code
    const digits = raw.replace(/\D/g, '')
    if (digits.startsWith('1') && digits.length === 11) return `+${digits}`
    if (digits.length === 10) return `+1${digits}`
    return raw.startsWith('+') ? raw : `+${digits}`
  }

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const formattedPhone = formatPhone(phone)
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Failed to send code'); return }
      setPhone(formattedPhone)
      setMaskedPhone(data.masked_phone)
      setStep('code')
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
        body: JSON.stringify({ code, phone, setup: true }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Invalid code'); return }
      window.location.href = '/dashboard'
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}>📱</span>
          <h1 className={styles.title}>Set Up Phone Verification</h1>
          <p className={styles.sub}>
            {step === 'phone'
              ? 'Enter your mobile number to receive a verification code.'
              : `We sent a 6-digit code to ${maskedPhone}`}
          </p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendCode} className={styles.form}>
            <label className={styles.label}>Mobile Number</label>
            <input
              type="tel"
              className={styles.phoneInput}
              value={phone}
              onChange={e => setPhone(e.target.value)}
              autoComplete="tel"
              required
              placeholder="(555) 555-5555"
              autoFocus
            />
            <p className={styles.hint}>US numbers: enter 10 digits. International: include country code (e.g. +44…)</p>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.btn} disabled={loading || phone.replace(/\D/g, '').length < 10}>
              {loading ? 'Sending…' : 'Send Verification Code →'}
            </button>
          </form>
        ) : (
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
              {loading ? 'Verifying…' : 'Verify →'}
            </button>
            <button
              type="button"
              className={styles.resendBtn}
              onClick={() => { setStep('phone'); setCode(''); setError('') }}
            >
              Wrong number? Go back
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
