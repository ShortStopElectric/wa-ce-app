// Extraction script — run once with: node scripts/extract-modules.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const src = join(__dirname, '../../wa-electrical-ce-full-app.jsx')
const raw = readFileSync(src, 'utf8')

// ── Extract MODULES array ─────────────────────────────────────────────────────
// Find the start and end of the MODULES constant
const modsStart = raw.indexOf('const MODULES = [')
if (modsStart === -1) throw new Error('Could not find MODULES array')

// Walk forward to find the matching closing bracket
let depth = 0
let inString = false
let strChar = ''
let escaped = false
let modsEnd = -1

for (let i = modsStart; i < raw.length; i++) {
  const ch = raw[i]
  const prev = raw[i - 1]

  if (escaped) { escaped = false; continue }
  if (ch === '\\' && inString) { escaped = true; continue }

  if (!inString && (ch === '"' || ch === "'" || ch === '`')) {
    inString = true; strChar = ch; continue
  }
  if (inString && ch === strChar && (strChar !== '`' || prev !== '$')) {
    inString = false; continue
  }
  if (inString) continue

  if (ch === '[' || ch === '{') depth++
  if (ch === ']' || ch === '}') {
    depth--
    if (depth === 0) { modsEnd = i + 1; break }
  }
}

if (modsEnd === -1) throw new Error('Could not find end of MODULES array')

const modsBody = raw.slice(modsStart, modsEnd)
  .replace('const MODULES = ', '')

// ── Extract FINAL_EXAM ────────────────────────────────────────────────────────
const examStart = raw.indexOf('const FINAL_EXAM')
let examEnd = -1
depth = 0; inString = false; escaped = false

for (let i = examStart; i < raw.length; i++) {
  const ch = raw[i]
  if (escaped) { escaped = false; continue }
  if (ch === '\\' && inString) { escaped = true; continue }
  if (!inString && (ch === '"' || ch === "'" || ch === '`')) { inString = true; strChar = ch; continue }
  if (inString && ch === strChar) { inString = false; continue }
  if (inString) continue
  if (ch === '[' || ch === '{') depth++
  if (ch === ']' || ch === '}') { depth--; if (depth === 0) { examEnd = i + 1; break } }
}

const examBody = examStart !== -1 && examEnd !== -1
  ? raw.slice(examStart, examEnd).replace('const FINAL_EXAM = ', '')
  : '[]'

// ── Write TypeScript data file ────────────────────────────────────────────────
const out = `import type { CourseModule, QuizQuestion } from '@/types'

// Auto-extracted from wa-electrical-ce-full-app.jsx
// 12 modules × 4 sections × 10 quiz questions = 24 CE hours

export const MODULES: CourseModule[] = ${modsBody}

export const FINAL_EXAM: QuizQuestion[] = ${examBody}

export function getModule(num: number): CourseModule | undefined {
  return MODULES.find(m => m.num === num)
}

export const TOTAL_MODULES = MODULES.length
export const TOTAL_HOURS = MODULES.reduce((s, m) => s + m.hours, 0)
export const PASS_THRESHOLD_MODULE = 70   // 70% to pass each module quiz
export const PASS_THRESHOLD_FINAL  = 75   // 75% to pass the final exam
export const MAX_FINAL_ATTEMPTS    = 3    // max final exam attempts
`

mkdirSync(join(__dirname, '../data'), { recursive: true })
writeFileSync(join(__dirname, '../data/modules.ts'), out, 'utf8')
console.log('✓ data/modules.ts written')
console.log(`  ${MODULES?.length ?? '?'} modules extracted`)
