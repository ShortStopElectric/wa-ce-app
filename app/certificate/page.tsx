'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import styles from './certificate.module.css'
import type { Certificate, Profile } from '@/types'

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
  { ssr: false }
)
const CertificatePDF = dynamic(
  () => import('@/components/CertificatePDF').then(mod => mod.CertificatePDF),
  { ssr: false }
)

export default function CertificatePage() {
  const [cert, setCert] = useState<Certificate | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [issuing, setIssuing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/certificate')
      .then(r => r.json())
      .then(({ cert: c, profile: p }) => {
        setCert(c)
        setProfile(p)
      })
      .finally(() => setLoading(false))
  }, [])

  async function issueCertificate() {
    setIssuing(true)
    setError('')
    try {
      const res = await fetch('/api/certificate', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Could not issue certificate'); return }
      setCert(data.cert)
    } finally {
      setIssuing(false)
    }
  }

  if (loading) return (
    <div className={styles.loading}><span className={styles.spinner} />Loading certificate…</div>
  )

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.back}>← Dashboard</Link>
        <span className={styles.headerTitle}>CE Certificate</span>
        <span />
      </header>

      <main className={styles.main}>
        {cert ? (
          <>
            {/* Certificate preview */}
            <div className={styles.certPreview}>
              <div className={styles.certTop}>
                <div>
                  <div className={styles.certCompany}>Short Stop Electrical LLC</div>
                  <div className={styles.certProvider}>WA CE Provider · {process.env.NEXT_PUBLIC_CE_PROVIDER_ID ?? 'WA-CE-PROV'}</div>
                </div>
                <div className={styles.certBadge}>CERTIFICATE OF COMPLETION</div>
              </div>

              <div className={styles.certBody}>
                <div className={styles.certPreamble}>This certifies that</div>
                <div className={styles.certName}>{profile?.name ?? cert.user_id}</div>
                <div className={styles.certDivider} />
                <p className={styles.certText}>
                  has successfully completed 24 hours of Washington State approved continuing education
                  in electrical code and safety per RCW 19.28 and WAC 296-46B.
                </p>

                <div className={styles.certDetails}>
                  <div className={styles.certDetail}>
                    <span className={styles.certDetailLabel}>License</span>
                    <span className={styles.certDetailValue}>{profile?.license ?? '—'}</span>
                  </div>
                  <div className={styles.certDetail}>
                    <span className={styles.certDetailLabel}>Issued</span>
                    <span className={styles.certDetailValue}>
                      {new Date(cert.issued_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className={styles.certDetail}>
                    <span className={styles.certDetailLabel}>Expires</span>
                    <span className={styles.certDetailValue}>
                      {new Date(cert.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className={styles.certDetail}>
                    <span className={styles.certDetailLabel}>Final Score</span>
                    <span className={styles.certDetailValue}>{cert.final_score}%</span>
                  </div>
                </div>
              </div>

              <div className={styles.certFooter}>
                <div className={styles.certNum}>Certificate No: {cert.cert_number}</div>
                <div className={styles.certHours}>24 Credit Hours</div>
              </div>
            </div>

            {/* Download */}
            <div className={styles.actions}>
              {typeof window !== 'undefined' && CertificatePDF && PDFDownloadLink && (
                <PDFDownloadLink
                  document={
                    <CertificatePDF
                      name={profile?.name ?? ''}
                      license={profile?.license ?? ''}
                      certNumber={cert.cert_number}
                      issuedAt={cert.issued_at}
                      expiresAt={cert.expires_at}
                      finalScore={cert.final_score}
                      providerId={process.env.NEXT_PUBLIC_CE_PROVIDER_ID ?? 'WA-CE-PROV'}
                    />
                  }
                  fileName={`WA-CE-Certificate-${cert.cert_number}.pdf`}
                  className={styles.downloadBtn}
                >
                  {({ loading: pdfLoading }) => pdfLoading ? 'Preparing PDF…' : '⬇ Download Certificate PDF'}
                </PDFDownloadLink>
              )}
              <p className={styles.emailNote}>
                A copy was also sent to your email address when the certificate was first issued.
              </p>
            </div>
          </>
        ) : (
          <div className={styles.nocert}>
            <div className={styles.nocertIcon}>📋</div>
            <h2 className={styles.nocertTitle}>No Certificate Yet</h2>
            <p className={styles.nocertSub}>
              Pass the final exam to generate your WA CE certificate.
            </p>
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.issueBtn} onClick={issueCertificate} disabled={issuing}>
              {issuing ? 'Generating…' : 'Generate Certificate'}
            </button>
            <Link href="/exam" className={styles.examLink}>Take the Final Exam →</Link>
          </div>
        )}
      </main>
    </div>
  )
}
