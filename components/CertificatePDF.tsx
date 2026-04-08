'use client'

import {
  Document, Page, Text, View, StyleSheet, Font,
} from '@react-pdf/renderer'

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc9.ttf', fontWeight: 700 },
  ],
})

const s = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    padding: 0,
    fontFamily: 'Helvetica',
  },
  topBand: {
    backgroundColor: '#0B1A2E',
    padding: '30 50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  companyName: { color: '#F5A623', fontSize: 20, fontWeight: 700 },
  companyTag: { color: '#94A3B8', fontSize: 9, marginTop: 2 },
  certTypeBox: { alignItems: 'flex-end' },
  certTypeText: { color: '#FFFFFF', fontSize: 11, fontWeight: 700 },
  certTypeState: { color: '#F5A623', fontSize: 9, marginTop: 2 },
  body: { padding: '40 60', flex: 1 },
  bigTitle: { fontSize: 13, color: '#475569', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 },
  recipientName: { fontSize: 34, color: '#0B1A2E', fontWeight: 700, marginBottom: 8 },
  dividerAmber: { height: 3, backgroundColor: '#F5A623', width: 80, marginBottom: 20 },
  bodyText: { fontSize: 11, color: '#334155', lineHeight: 1.6, marginBottom: 20 },
  detailsRow: { flexDirection: 'row', gap: 40, marginBottom: 30 },
  detailBox: { flex: 1 },
  detailLabel: { fontSize: 8, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  detailValue: { fontSize: 13, color: '#0B1A2E', fontWeight: 700 },
  detailSub: { fontSize: 9, color: '#64748B', marginTop: 2 },
  courseRow: { flexDirection: 'row', marginTop: 4, paddingBottom: 4, borderBottom: '1 solid #E2E8F0' },
  courseLabel: { fontSize: 9, color: '#64748B', flex: 1 },
  courseValue: { fontSize: 9, color: '#0B1A2E', fontWeight: 700 },
  bottomBand: {
    backgroundColor: '#0B1A2E',
    padding: '20 50',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomLeft: {},
  bottomText: { color: '#94A3B8', fontSize: 8 },
  certNum: { color: '#F5A623', fontSize: 9, fontWeight: 700, marginTop: 2 },
  sigBlock: { alignItems: 'flex-end' },
  sigLine: { width: 140, borderBottom: '1 solid #64748B', marginBottom: 4 },
  sigLabel: { color: '#94A3B8', fontSize: 8 },
  scoreBox: { backgroundColor: '#F5F9FF', border: '1 solid #CBD5E1', borderRadius: 4, padding: '8 16', alignItems: 'center' },
  scoreLabel: { fontSize: 8, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 },
  scoreValue: { fontSize: 22, color: '#0B1A2E', fontWeight: 700 },
})

type Props = {
  name: string
  license: string
  certNumber: string
  issuedAt: string
  expiresAt: string
  finalScore: number
  providerId: string
}

export function CertificatePDF({ name, license, certNumber, issuedAt, expiresAt, finalScore, providerId }: Props) {
  const issued = new Date(issuedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const expires = new Date(expiresAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <Document title={`WA CE Certificate — ${name}`} author="Short Stop Electrical LLC">
      <Page size="LETTER" orientation="landscape" style={s.page}>

        {/* Top band */}
        <View style={s.topBand}>
          <View>
            <Text style={s.companyName}>Short Stop Electrical LLC</Text>
            <Text style={s.companyTag}>Washington State Approved CE Provider · {providerId}</Text>
          </View>
          <View style={s.certTypeBox}>
            <Text style={s.certTypeText}>CERTIFICATE OF COMPLETION</Text>
            <Text style={s.certTypeState}>Washington State RCW 19.28 · WAC 296-46B</Text>
          </View>
        </View>

        {/* Body */}
        <View style={s.body}>
          <Text style={s.bigTitle}>This certifies that</Text>
          <Text style={s.recipientName}>{name}</Text>
          <View style={s.dividerAmber} />

          <Text style={s.bodyText}>
            has successfully completed 24 hours of Washington State approved continuing education
            in electrical code and safety, satisfying the requirements of RCW 19.28 and WAC 296-46B
            for the current license renewal cycle.
          </Text>

          {/* Details row */}
          <View style={s.detailsRow}>
            <View style={s.detailBox}>
              <Text style={s.detailLabel}>Contractor License</Text>
              <Text style={s.detailValue}>{license}</Text>
            </View>
            <View style={s.detailBox}>
              <Text style={s.detailLabel}>Date of Issue</Text>
              <Text style={s.detailValue}>{issued}</Text>
              <Text style={s.detailSub}>Expires: {expires}</Text>
            </View>
            <View style={s.detailBox}>
              <Text style={s.detailLabel}>Course Hours</Text>
              <Text style={s.detailValue}>24 Credit Hours</Text>
              <Text style={s.detailSub}>12 modules × 2 hours each</Text>
            </View>
            <View style={[s.detailBox, s.scoreBox]}>
              <Text style={s.scoreLabel}>Final Score</Text>
              <Text style={s.scoreValue}>{finalScore}%</Text>
            </View>
          </View>

          {/* Course modules summary */}
          <View style={s.courseRow}><Text style={s.courseLabel}>NEC 2023 Code Updates & Article 100 Definitions</Text><Text style={s.courseValue}>2 hrs</Text></View>
          <View style={s.courseRow}><Text style={s.courseLabel}>Wiring Methods, Conductors & Protection</Text><Text style={s.courseValue}>2 hrs</Text></View>
          <View style={s.courseRow}><Text style={s.courseLabel}>Overcurrent Protection & Grounding</Text><Text style={s.courseValue}>2 hrs</Text></View>
          <View style={s.courseRow}><Text style={s.courseLabel}>Branch Circuits, Feeders & Service Entrance</Text><Text style={s.courseValue}>2 hrs</Text></View>
          <View style={s.courseRow}><Text style={s.courseLabel}>GFCI, AFCI & Receptacle Requirements</Text><Text style={s.courseValue}>2 hrs</Text></View>
          <View style={s.courseRow}><Text style={s.courseLabel}>Dwelling Unit Load Calculations</Text><Text style={s.courseValue}>2 hrs</Text></View>
        </View>

        {/* Bottom band */}
        <View style={s.bottomBand}>
          <View style={s.bottomLeft}>
            <Text style={s.bottomText}>Short Stop Electrical LLC · WA Electrical CE Provider</Text>
            <Text style={s.certNum}>Certificate No: {certNumber}</Text>
          </View>
          <View style={s.sigBlock}>
            <View style={s.sigLine} />
            <Text style={s.sigLabel}>Authorized Signature · Short Stop Electrical LLC</Text>
          </View>
        </View>

      </Page>
    </Document>
  )
}
