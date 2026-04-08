// Module illustrations — SVG diagrams keyed to section IDs
// All use the navy/amber color scheme and are fully responsive via viewBox

const A = '#F5A623'   // amber
const W = '#FFFFFF'   // white
const N = '#132340'   // navy card
const G = '#64748B'   // gray
const G2 = '#94A3B8'  // light gray
const R = '#EF4444'   // red/danger
const GR = '#22C55E'  // green
const BL = '#3B82F6'  // blue

const base = { fontFamily: 'inherit' }

// ── 1.2  License Category Hierarchy ──────────────────────────────────────────
export function LicenseHierarchy() {
  const tiers = [
    { label: 'Electrical Contractor', sub: 'Business license + admin + bond + insurance', w: 420, color: A },
    { label: 'Administrator / Elect. Administrator', sub: 'Journeyman + admin exam + business law', w: 360, color: '#E09012' },
    { label: 'Journeyman Electrician', sub: 'Unlimited scope · 8,000 hr apprenticeship', w: 300, color: '#3B82F6' },
    { label: 'Specialty Electrician', sub: 'Scope-limited: HVAC, Sign, Pump, Low-Voltage…', w: 240, color: '#8B5CF6' },
    { label: 'Electrician Trainee', sub: 'Must register with L&I · No unsupervised work', w: 180, color: G },
  ]
  return (
    <svg viewBox="0 0 480 260" style={{ ...base, width: '100%', display: 'block' }}>
      <rect width={480} height={260} fill="transparent" />
      <text x={240} y={20} textAnchor="middle" fill={G2} fontSize={11} fontWeight={700} letterSpacing={1}>WA ELECTRICAL LICENSE TIERS</text>
      {tiers.map((t, i) => {
        const y = 32 + i * 44
        const x = (480 - t.w) / 2
        return (
          <g key={i}>
            <rect x={x} y={y} width={t.w} height={36} rx={4} fill={t.color} opacity={0.15} />
            <rect x={x} y={y} width={t.w} height={36} rx={4} fill="none" stroke={t.color} strokeWidth={1.5} />
            <text x={240} y={y + 13} textAnchor="middle" fill={t.color} fontSize={12} fontWeight={700}>{t.label}</text>
            <text x={240} y={y + 27} textAnchor="middle" fill={G2} fontSize={10}>{t.sub}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ── 1.3  CE 3-Year Renewal Cycle ──────────────────────────────────────────────
export function CERenewalCycle() {
  const steps = [
    { label: 'License\nIssued', angle: -90 },
    { label: 'Year 1\nWork', angle: -10 },
    { label: 'Year 2\nCE Hours', angle: 70 },
    { label: 'Year 3\nRenewal', angle: 150 },
    { label: 'Renewed\nLicense', angle: -90 },
  ]
  const cx = 240, cy = 135, r = 90
  return (
    <svg viewBox="0 0 480 280" style={{ ...base, width: '100%', display: 'block' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={N} strokeWidth={18} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={A} strokeWidth={18} strokeDasharray={`${0.75 * 2 * Math.PI * r} ${2 * Math.PI * r}`} strokeDashoffset={0} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy - 14} textAnchor="middle" fill={A} fontSize={26} fontWeight={800}>24</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill={W} fontSize={13} fontWeight={600}>CE Hours</text>
      <text x={cx} y={cy + 24} textAnchor="middle" fill={G2} fontSize={10}>every 3 years</text>
      {[
        { label: 'Start', x: cx, y: cy - r - 22, sub: 'License active' },
        { label: 'Year 1', x: cx + r + 22, y: cy + 10, sub: 'Work & earn' },
        { label: 'Year 2–3', x: cx + 20, y: cy + r + 22, sub: 'Complete 24 hrs CE' },
        { label: 'Renew', x: cx - r - 22, y: cy + 10, sub: 'Submit & pay fee' },
      ].map((s, i) => (
        <g key={i}>
          <text x={s.x} y={s.y} textAnchor="middle" fill={A} fontSize={11} fontWeight={700}>{s.label}</text>
          <text x={s.x} y={s.y + 13} textAnchor="middle" fill={G2} fontSize={9}>{s.sub}</text>
        </g>
      ))}
      <text x={240} y={268} textAnchor="middle" fill={G} fontSize={10}>WAC 296-46B-910 · Lapsed license = same penalty as unlicensed work</text>
    </svg>
  )
}

// ── 2.1  Permit Workflow ──────────────────────────────────────────────────────
export function PermitWorkflow() {
  const steps = [
    { icon: '📋', label: 'Obtain Permit', sub: 'BEFORE work begins', color: A },
    { icon: '🔧', label: 'Perform Work', sub: 'Per approved plans', color: BL },
    { icon: '🔍', label: 'Inspections', sub: 'Rough-in · Service · Final', color: '#8B5CF6' },
    { icon: '✅', label: 'Permit Closed', sub: 'Final approval', color: GR },
  ]
  return (
    <svg viewBox="0 0 480 130" style={{ ...base, width: '100%', display: 'block' }}>
      {steps.map((s, i) => {
        const x = 30 + i * 110
        return (
          <g key={i}>
            <rect x={x} y={15} width={90} height={90} rx={8} fill={s.color} fillOpacity={0.12} stroke={s.color} strokeWidth={1.5} />
            <text x={x + 45} y={43} textAnchor="middle" fontSize={22}>{s.icon}</text>
            <text x={x + 45} y={62} textAnchor="middle" fill={s.color} fontSize={11} fontWeight={700}>{s.label}</text>
            <text x={x + 45} y={76} textAnchor="middle" fill={G2} fontSize={9}>{s.sub}</text>
            {i < steps.length - 1 && (
              <text x={x + 98} y={63} textAnchor="middle" fill={G} fontSize={18}>›</text>
            )}
          </g>
        )
      })}
      <rect x={10} y={112} width={460} height={16} rx={3} fill={R} fillOpacity={0.1} />
      <text x={240} y={123} textAnchor="middle" fill={R} fontSize={9} fontWeight={700}>NO PERMIT = Gross Misdemeanor · Civil penalty up to $10,000/day · RCW 19.28.161</text>
    </svg>
  )
}

// ── 2.2  Inspection Sequence ──────────────────────────────────────────────────
export function InspectionSequence() {
  const stages = [
    { num: '1', label: 'ROUGH-IN', sub: 'Before walls\nclosed/concealed', detail: 'Conduit, boxes, wiring\nin place — not connected', color: A },
    { num: '2', label: 'SERVICE', sub: 'Before service\nequipment energized', detail: 'Meter socket, service\npanel, grounding', color: BL },
    { num: '3', label: 'FINAL', sub: 'Before occupancy\nor use', detail: 'All devices installed,\ncircuits tested, covers on', color: GR },
  ]
  return (
    <svg viewBox="0 0 480 180" style={{ ...base, width: '100%', display: 'block' }}>
      <text x={240} y={16} textAnchor="middle" fill={G2} fontSize={11} fontWeight={700} letterSpacing={1}>INSPECTION SEQUENCE — 24 HR ADVANCE NOTICE REQUIRED</text>
      {stages.map((s, i) => {
        const x = 20 + i * 155
        return (
          <g key={i}>
            <rect x={x} y={26} width={140} height={140} rx={8} fill={s.color} fillOpacity={0.1} stroke={s.color} strokeWidth={1.5} />
            <circle cx={x + 70} cy={56} r={20} fill={s.color} fillOpacity={0.2} stroke={s.color} strokeWidth={2} />
            <text x={x + 70} y={62} textAnchor="middle" fill={s.color} fontSize={18} fontWeight={800}>{s.num}</text>
            <text x={x + 70} y={92} textAnchor="middle" fill={s.color} fontSize={13} fontWeight={700}>{s.label}</text>
            {s.sub.split('\n').map((line, li) => (
              <text key={li} x={x + 70} y={108 + li * 14} textAnchor="middle" fill={G2} fontSize={10}>{line}</text>
            ))}
            {s.detail.split('\n').map((line, li) => (
              <text key={li} x={x + 70} y={140 + li * 13} textAnchor="middle" fill={G} fontSize={9}>{line}</text>
            ))}
            {i < stages.length - 1 && (
              <text x={x + 148} y={102} fill={G} fontSize={20}>›</text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ── 3.3  Working Space — NEC 110.26 ──────────────────────────────────────────
export function WorkingSpace() {
  return (
    <svg viewBox="0 0 480 260" style={{ ...base, width: '100%', display: 'block' }}>
      <text x={240} y={16} textAnchor="middle" fill={G2} fontSize={11} fontWeight={700} letterSpacing={1}>NEC 110.26 — REQUIRED WORKING SPACE (≤600V)</text>
      {/* Panel box */}
      <rect x={195} y={30} width={90} height={160} rx={4} fill={N} stroke={A} strokeWidth={2.5} />
      <text x={240} y={100} textAnchor="middle" fill={A} fontSize={11} fontWeight={700}>PANEL</text>
      <text x={240} y={116} textAnchor="middle" fill={G2} fontSize={9}>Electrical</text>
      <text x={240} y={128} textAnchor="middle" fill={G2} fontSize={9}>Equipment</text>
      {/* Working space zone */}
      <rect x={145} y={30} width={190} height={190} rx={4} fill={A} fillOpacity={0.06} stroke={A} strokeWidth={1} strokeDasharray="6,4" />
      {/* Width arrow */}
      <line x1={145} y1={232} x2={335} y2={232} stroke={BL} strokeWidth={1.5} markerEnd="url(#arr)" />
      <line x1={145} y1={228} x2={145} y2={236} stroke={BL} strokeWidth={1.5} />
      <line x1={335} y1={228} x2={335} y2={236} stroke={BL} strokeWidth={1.5} />
      <text x={240} y={248} textAnchor="middle" fill={BL} fontSize={11} fontWeight={700}>30" min width (or equip. width)</text>
      {/* Depth arrow */}
      <line x1={345} y1={190} x2={345} y2={30} stroke={GR} strokeWidth={1.5} />
      <line x1={341} y1={190} x2={349} y2={190} stroke={GR} strokeWidth={1.5} />
      <line x1={341} y1={30} x2={349} y2={30} stroke={GR} strokeWidth={1.5} />
      <text x={380} y={116} textAnchor="middle" fill={GR} fontSize={11} fontWeight={700} transform="rotate(90 380 116)">36" min depth</text>
      {/* Height label */}
      <line x1={135} y1={30} x2={135} y2={190} stroke={R} strokeWidth={1.5} />
      <text x={100} y={116} textAnchor="middle" fill={R} fontSize={11} fontWeight={700} transform="rotate(-90 100 116)">6.5 ft height</text>
      {/* Floor */}
      <line x1={100} y1={220} x2={400} y2={220} stroke={G} strokeWidth={1} strokeDasharray="4,3" />
      <text x={240} y={260} textAnchor="middle" fill={G} fontSize={9}>⚠ No storage, pipes, or obstructions permitted in working space</text>
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={BL} />
        </marker>
      </defs>
    </svg>
  )
}

// ── 3.4  Temperature Derating Chain ──────────────────────────────────────────
export function TempDerating() {
  return (
    <svg viewBox="0 0 480 160" style={{ ...base, width: '100%', display: 'block' }}>
      <text x={240} y={16} textAnchor="middle" fill={G2} fontSize={11} fontWeight={700} letterSpacing={1}>NEC 110.14(C) — CONDUCTOR TEMPERATURE LIMITATION</text>
      {/* Wire */}
      <rect x={20} y={65} width={100} height={30} rx={6} fill={A} fillOpacity={0.15} stroke={A} strokeWidth={1.5} />
      <text x={70} y={77} textAnchor="middle" fill={A} fontSize={10} fontWeight={700}>THHN Wire</text>
      <text x={70} y={90} textAnchor="middle" fill={G2} fontSize={9}>Rated 90°C</text>
      {/* Arrow */}
      <line x1={120} y1={80} x2={155} y2={80} stroke={G} strokeWidth={1.5} markerEnd="url(#arr2)" />
      <text x={137} y={74} textAnchor="middle" fill={G} fontSize={9}>connects to</text>
      {/* Terminal */}
      <rect x={155} y={55} width={130} height={50} rx={6} fill={BL} fillOpacity={0.15} stroke={BL} strokeWidth={1.5} />
      <text x={220} y={75} textAnchor="middle" fill={BL} fontSize={10} fontWeight={700}>Device Terminal</text>
      <text x={220} y={90} textAnchor="middle" fill={G2} fontSize={9}>Rated 75°C or 60°C</text>
      {/* Arrow */}
      <line x1={285} y1={80} x2={315} y2={80} stroke={G} strokeWidth={1.5} markerEnd="url(#arr2)" />
      <text x={300} y={74} textAnchor="middle" fill={G} fontSize={9}>use column</text>
      {/* Result */}
      <rect x={315} y={55} width={145} height={50} rx={6} fill={GR} fillOpacity={0.15} stroke={GR} strokeWidth={1.5} />
      <text x={388} y={75} textAnchor="middle" fill={GR} fontSize={10} fontWeight={700}>Ampacity From</text>
      <text x={388} y={89} textAnchor="middle" fill={GR} fontSize={10} fontWeight={700}>75°C (or 60°C) Column</text>
      {/* Rule box */}
      <rect x={20} y={120} width={440} height={28} rx={4} fill={R} fillOpacity={0.1} />
      <text x={240} y={132} textAnchor="middle" fill={R} fontSize={10} fontWeight={700}>RULE: Always use the LOWEST temperature rating in the circuit path</text>
      <text x={240} y={145} textAnchor="middle" fill={G2} fontSize={9}>90°C wire does NOT give you 90°C ampacity when connected to 60°C or 75°C terminals</text>
      <defs>
        <marker id="arr2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={G} />
        </marker>
      </defs>
    </svg>
  )
}

// ── 4.1  Underground Burial Depths ────────────────────────────────────────────
export function BurialDepths() {
  const methods = [
    { label: 'RMC / IMC', depth: 60, minDepth: '6"', color: '#94A3B8' },
    { label: 'PVC (residential driveway)', depth: 80, minDepth: '12"', color: '#8B5CF6' },
    { label: 'PVC Conduit', depth: 120, minDepth: '18"', color: BL },
    { label: 'Direct Burial\n(USE-2, UF)', depth: 160, minDepth: '24"', color: A },
  ]
  return (
    <svg viewBox="0 0 480 220" style={{ ...base, width: '100%', display: 'block' }}>
      <text x={240} y={14} textAnchor="middle" fill={G2} fontSize={11} fontWeight={700} letterSpacing={1}>NEC 300.5 — MINIMUM BURIAL DEPTHS</text>
      {/* Ground surface */}
      <rect x={20} y={24} width={440} height={10} rx={2} fill="#4B7A2B" fillOpacity={0.4} />
      <text x={240} y={22} textAnchor="middle" fill="#4B7A2B" fontSize={9}>GRADE LEVEL</text>
      {/* Earth fill */}
      <rect x={20} y={34} width={440} height={180} rx={0} fill="#8B6914" fillOpacity={0.1} />
      {methods.map((m, i) => {
        const x = 30 + i * 110
        const y = 34 + m.depth
        return (
          <g key={i}>
            {/* Conduit line */}
            <line x1={x + 45} y1={34} x2={x + 45} y2={y} stroke={m.color} strokeWidth={2} strokeDasharray="4,2" />
            {/* Conduit circle */}
            <circle cx={x + 45} cy={y + 10} r={14} fill={m.color} fillOpacity={0.2} stroke={m.color} strokeWidth={2} />
            <text x={x + 45} y={y + 15} textAnchor="middle" fill={m.color} fontSize={9} fontWeight={700}>{m.minDepth}</text>
            {/* Label */}
            {m.label.split('\n').map((line, li) => (
              <text key={li} x={x + 45} y={y + 34 + li * 12} textAnchor="middle" fill={G2} fontSize={9}>{line}</text>
            ))}
          </g>
        )
      })}
      <text x={240} y={212} textAnchor="middle" fill={G} fontSize={9}>Depths increase in specific locations — always check Table 300.5 for all conditions</text>
    </svg>
  )
}

// ── 4.2  Conduit Types ─────────────────────────────────────────────────────────
export function ConduitTypes() {
  const types = [
    { name: 'RMC', full: 'Rigid Metal', wall: 8, color: '#94A3B8', features: ['All locations', 'Direct burial', 'Hazardous', 'Provides EGC'] },
    { name: 'IMC', full: 'Intermediate', wall: 6, color: '#64748B', features: ['Same as RMC', 'Lighter', 'Threaded', 'Provides EGC'] },
    { name: 'EMT', full: 'Elec. Metallic', wall: 3, color: A, features: ['Most common WA', 'No hazardous', 'No direct bury', 'Provides EGC'] },
    { name: 'PVC', full: 'Non-Metallic', wall: 4, color: BL, features: ['Direct burial OK', 'No EGC path', 'Separate EGC', 'Expansion needed'] },
  ]
  const cx = [60, 180, 300, 420], cy = 80, outerR = 44
  return (
    <svg viewBox="0 0 480 200" style={{ ...base, width: '100%', display: 'block' }}>
      <text x={240} y={14} textAnchor="middle" fill={G2} fontSize={11} fontWeight={700} letterSpacing={1}>CONDUIT TYPES — CROSS SECTION & KEY PROPERTIES</text>
      {types.map((t, i) => {
        const innerR = outerR - t.wall
        return (
          <g key={i}>
            <circle cx={cx[i]} cy={cy} r={outerR} fill={t.color} fillOpacity={0.2} stroke={t.color} strokeWidth={2} />
            <circle cx={cx[i]} cy={cy} r={innerR} fill="#0B1A2E" />
            <text x={cx[i]} y={cy + 4} textAnchor="middle" fill={t.color} fontSize={12} fontWeight={800}>{t.name}</text>
            <text x={cx[i]} y={cy + 18} textAnchor="middle" fill={G2} fontSize={8}>{t.full}</text>
            {t.features.map((f, fi) => (
              <text key={fi} x={cx[i]} y={140 + fi * 13} textAnchor="middle" fill={fi === 0 ? t.color : G2} fontSize={9} fontWeight={fi === 0 ? 700 : 400}>{f}</text>
            ))}
          </g>
        )
      })}
    </svg>
  )
}

// ── 4.4  Conduit Fill ─────────────────────────────────────────────────────────
export function ConduitFill() {
  const rules = [
    { label: '1 Conductor', pct: 53, color: GR },
    { label: '2 Conductors', pct: 31, color: A },
    { label: '3+ Conductors', pct: 40, color: BL },
  ]
  const r = 52, cx = [80, 240, 400], cy = 100
  function arc(pct: number, radius: number) {
    const angle = (pct / 100) * 2 * Math.PI - Math.PI / 2
    const x = cx[0] + radius * Math.cos(angle)
    const y = cy + radius * Math.sin(angle)
    return `M ${cx[0]} ${cy - radius} A ${radius} ${radius} 0 ${pct > 50 ? 1 : 0} 1 ${x} ${y}`
  }
  return (
    <svg viewBox="0 0 480 200" style={{ ...base, width: '100%', display: 'block' }}>
      <text x={240} y={14} textAnchor="middle" fill={G2} fontSize={11} fontWeight={700} letterSpacing={1}>NEC CHAPTER 9 TABLE 1 — CONDUIT FILL LIMITS</text>
      {rules.map((rule, i) => {
        const x = cx[i]
        const angle = (rule.pct / 100) * 2 * Math.PI
        const endX = x + r * Math.cos(angle - Math.PI / 2)
        const endY = cy + r * Math.sin(angle - Math.PI / 2)
        const largeArc = rule.pct > 50 ? 1 : 0
        return (
          <g key={i}>
            <circle cx={x} cy={cy} r={r} fill={rule.color} fillOpacity={0.08} stroke={rule.color} strokeWidth={1} strokeDasharray="3,2" />
            <path
              d={`M ${x} ${cy - r} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY} L ${x} ${cy} Z`}
              fill={rule.color}
              fillOpacity={0.4}
            />
            <circle cx={x} cy={cy} r={r} fill="none" stroke={rule.color} strokeWidth={2} />
            <text x={x} y={cy - 6} textAnchor="middle" fill={rule.color} fontSize={20} fontWeight={800}>{rule.pct}%</text>
            <text x={x} y={cy + 10} textAnchor="middle" fill={W} fontSize={9}>MAX FILL</text>
            <text x={x} y={cy + 26} textAnchor="middle" fill={G2} fontSize={9}>allowed</text>
            <text x={x} y={cy + r + 18} textAnchor="middle" fill={rule.color} fontSize={11} fontWeight={700}>{rule.label}</text>
          </g>
        )
      })}
      <text x={240} y={192} textAnchor="middle" fill={G} fontSize={9}>Use Chapter 9 Table 5 wire areas for calculations · Applies to all conduit types</text>
    </svg>
  )
}

// ── 4.4  Box Fill ─────────────────────────────────────────────────────────────
export function BoxFill() {
  const items = [
    { label: 'Each current-carrying conductor', count: '= 1 unit each', color: A },
    { label: 'Wiring device (receptacle/switch)', count: '= 2 units each', color: BL },
    { label: 'All internal cable clamps', count: '= 1 unit total', color: '#8B5CF6' },
    { label: 'All EGC conductors combined', count: '= 1 unit total', color: GR },
    { label: 'Fittings mounted in box', count: '= 1 unit each', color: G2 },
  ]
  return (
    <svg viewBox="0 0 480 210" style={{ ...base, width: '100%', display: 'block' }}>
      <text x={240} y={14} textAnchor="middle" fill={G2} fontSize={11} fontWeight={700} letterSpacing={1}>NEC 314.16 — BOX FILL CALCULATION</text>
      <rect x={10} y={24} width={460} height={30} rx={4} fill={N} />
      <text x={240} y={35} textAnchor="middle" fill={G2} fontSize={10}>Each "unit" = volume allowance based on largest conductor in the box (Table 314.16(B))</text>
      <text x={240} y={49} textAnchor="middle" fill={G2} fontSize={9}>Example: 14 AWG = 2.00 in³ · 12 AWG = 2.25 in³ · 10 AWG = 2.50 in³</text>
      {items.map((item, i) => {
        const y = 64 + i * 28
        return (
          <g key={i}>
            <rect x={10} y={y} width={460} height={24} rx={4} fill={item.color} fillOpacity={0.08} stroke={item.color} strokeWidth={1} />
            <circle cx={30} cy={y + 12} r={7} fill={item.color} fillOpacity={0.3} stroke={item.color} strokeWidth={1.5} />
            <text x={30} y={y + 16} textAnchor="middle" fill={item.color} fontSize={9} fontWeight={800}>{i + 1}</text>
            <text x={48} y={y + 15} fill={W} fontSize={10}>{item.label}</text>
            <text x={450} y={y + 15} textAnchor="end" fill={item.color} fontSize={11} fontWeight={700}>{item.count}</text>
          </g>
        )
      })}
      <rect x={10} y={204} width={460} height={4} rx={2} fill={R} fillOpacity={0.4} />
    </svg>
  )
}

// ── 5.1  Grounding System ─────────────────────────────────────────────────────
export function GroundingSystem() {
  return (
    <svg viewBox="0 0 480 260" style={{ ...base, width: '100%', display: 'block' }}>
      <text x={240} y={14} textAnchor="middle" fill={G2} fontSize={11} fontWeight={700} letterSpacing={1}>NEC ART. 250 — SERVICE GROUNDING & BONDING</text>
      {/* Utility */}
      <rect x={170} y={24} width={140} height={36} rx={4} fill={BL} fillOpacity={0.15} stroke={BL} strokeWidth={1.5} />
      <text x={240} y={42} textAnchor="middle" fill={BL} fontSize={11} fontWeight={700}>Utility Transformer</text>
      <text x={240} y={55} textAnchor="middle" fill={G2} fontSize={9}>Grounded (neutral) at source</text>
      {/* Line down */}
      <line x1={240} y1={60} x2={240} y2={86} stroke={W} strokeWidth={2} />
      {/* Service panel */}
      <rect x={170} y={86} width={140} height={50} rx={4} fill={N} stroke={A} strokeWidth={2} />
      <text x={240} y={107} textAnchor="middle" fill={A} fontSize={12} fontWeight={700}>Service Panel</text>
      <text x={240} y={122} textAnchor="middle" fill={G2} fontSize={9}>Main Bonding Jumper (MBJ)</text>
      <text x={240} y={133} textAnchor="middle" fill={G2} fontSize={9}>connects neutral → panel enclosure</text>
      {/* GEC line down */}
      <line x1={240} y1={136} x2={240} y2={165} stroke={GR} strokeWidth={2} strokeDasharray="5,3" />
      <text x={260} y={155} fill={GR} fontSize={9}>GEC</text>
      {/* Ground rods */}
      <rect x={190} y={165} width={100} height={30} rx={4} fill={GR} fillOpacity={0.15} stroke={GR} strokeWidth={1.5} />
      <text x={240} y={181} textAnchor="middle" fill={GR} fontSize={10} fontWeight={700}>Grounding Electrode(s)</text>
      <text x={240} y={193} textAnchor="middle" fill={G2} fontSize={9}>Rod, plate, Ufer, water pipe</text>
      {/* Bonding branches */}
      <line x1={170} y1={111} x2={80} y2={111} stroke={A} strokeWidth={1.5} strokeDasharray="4,2" />
      <rect x={20} y={95} width={60} height={30} rx={4} fill={A} fillOpacity={0.1} stroke={A} strokeWidth={1} />
      <text x={50} y={108} textAnchor="middle" fill={A} fontSize={9} fontWeight={700}>Water</text>
      <text x={50} y={120} textAnchor="middle" fill={A} fontSize={9}>Pipe</text>
      <line x1={310} y1={111} x2={400} y2={111} stroke={A} strokeWidth={1.5} strokeDasharray="4,2" />
      <rect x={400} y={95} width={60} height={30} rx={4} fill={A} fillOpacity={0.1} stroke={A} strokeWidth={1} />
      <text x={430} y={108} textAnchor="middle" fill={A} fontSize={9} fontWeight={700}>Gas</text>
      <text x={430} y={120} textAnchor="middle" fill={A} fontSize={9}>Pipe</text>
      <text x={240} y={220} textAnchor="middle" fill={G2} fontSize={9}>Bonding = connecting all metal parts to same ground potential</text>
      <text x={240} y={234} textAnchor="middle" fill={G2} fontSize={9}>Grounding = connecting system to earth via electrodes</text>
      <text x={240} y={250} textAnchor="middle" fill={G} fontSize={9}>Two separate concepts — both required · NEC 250.24 / 250.50 / 250.104</text>
    </svg>
  )
}

// ── 6.1  Service Entrance Components ─────────────────────────────────────────
export function ServiceEntrance() {
  const comps = [
    { label: 'Utility Lines', sub: 'Owned by utility', y: 30, color: BL },
    { label: 'Service Drop/Lateral', sub: 'To weatherhead or underground', y: 80, color: G2 },
    { label: 'Meter Socket', sub: 'Utility-owned meter · Sealed', y: 130, color: '#8B5CF6' },
    { label: 'Service Entrance Conductors', sub: 'Sized per NEC 230.42 · Min #8 Cu', y: 180, color: G2 },
    { label: 'Service Disconnect', sub: 'Max 6 disconnects · Must be accessible · 230.70', y: 230, color: A },
    { label: 'Main Panel / Load Center', sub: 'Grounded · Bonded · Labeled', y: 280, color: GR },
  ]
  return (
    <svg viewBox="0 0 480 330" style={{ ...base, width: '100%', display: 'block' }}>
      <text x={240} y={16} textAnchor="middle" fill={G2} fontSize={11} fontWeight={700} letterSpacing={1}>NEC ART. 230 — SERVICE ENTRANCE COMPONENTS</text>
      <line x1={240} y1={24} x2={240} y2={320} stroke={G} strokeWidth={1} strokeDasharray="3,3" />
      {comps.map((c, i) => (
        <g key={i}>
          <circle cx={240} cy={c.y + 18} r={6} fill={c.color} />
          <rect x={260} y={c.y} width={200} height={36} rx={4} fill={c.color} fillOpacity={0.1} stroke={c.color} strokeWidth={1} />
          <text x={268} y={c.y + 14} fill={c.color} fontSize={11} fontWeight={700}>{c.label}</text>
          <text x={268} y={c.y + 27} fill={G2} fontSize={9}>{c.sub}</text>
        </g>
      ))}
    </svg>
  )
}

// ── 7.1  Panel Layout & Breaker Types ─────────────────────────────────────────
export function PanelLayout() {
  return (
    <svg viewBox="0 0 480 280" style={{ ...base, width: '100%', display: 'block' }}>
      <text x={240} y={14} textAnchor="middle" fill={G2} fontSize={11} fontWeight={700} letterSpacing={1}>PANEL LAYOUT & BREAKER TYPES</text>
      {/* Panel box */}
      <rect x={140} y={22} width={200} height={240} rx={6} fill={N} stroke={G} strokeWidth={2} />
      {/* Main breaker */}
      <rect x={160} y={30} width={160} height={30} rx={3} fill={R} fillOpacity={0.2} stroke={R} strokeWidth={1.5} />
      <text x={240} y={43} textAnchor="middle" fill={R} fontSize={10} fontWeight={700}>MAIN BREAKER</text>
      <text x={240} y={55} textAnchor="middle" fill={G2} fontSize={8}>Disconnects entire panel</text>
      {/* Branch breakers left */}
      {[
        { label: '20A KITCHEN', color: A, y: 70 },
        { label: '20A KITCHEN', color: A, y: 92 },
        { label: '15A LIGHTS', color: BL, y: 114 },
        { label: '15A OUTLETS', color: BL, y: 136 },
        { label: '20A BATH', color: GR, y: 158 },
        { label: '30A DRYER', color: '#8B5CF6', y: 180 },
      ].map((b, i) => (
        <g key={i}>
          <rect x={152} y={b.y} width={70} height={18} rx={2} fill={b.color} fillOpacity={0.15} stroke={b.color} strokeWidth={1} />
          <text x={187} y={b.y + 12} textAnchor="middle" fill={b.color} fontSize={8} fontWeight={700}>{b.label}</text>
        </g>
      ))}
      {/* Branch breakers right */}
      {[
        { label: '20A KITCHEN', color: A, y: 70 },
        { label: '20A DISHWSH', color: A, y: 92 },
        { label: '15A LIGHTS', color: BL, y: 114 },
        { label: '15A OUTLETS', color: BL, y: 136 },
        { label: '20A GARAGE', color: GR, y: 158 },
        { label: '50A RANGE', color: R, y: 180 },
      ].map((b, i) => (
        <g key={i}>
          <rect x={258} y={b.y} width={70} height={18} rx={2} fill={b.color} fillOpacity={0.15} stroke={b.color} strokeWidth={1} />
          <text x={293} y={b.y + 12} textAnchor="middle" fill={b.color} fontSize={8} fontWeight={700}>{b.label}</text>
        </g>
      ))}
      {/* Neutral/ground bus */}
      <rect x={152} y={210} width={176} height={20} rx={2} fill={G} fillOpacity={0.2} stroke={G} strokeWidth={1} />
      <text x={240} y={223} textAnchor="middle" fill={G2} fontSize={9}>NEUTRAL / GROUND BUS</text>
      {/* Legend */}
      {[
        { color: A, label: 'Small appliance circuits (20A)' },
        { color: BL, label: 'General purpose (15A)' },
        { color: GR, label: 'GFCI/AFCI protected' },
        { color: R, label: 'Large appliance / Main' },
      ].map((l, i) => (
        <g key={i}>
          <rect x={10} y={232 + i * 12} width={10} height={10} rx={2} fill={l.color} fillOpacity={0.4} />
          <text x={26} y={241 + i * 12} fill={G2} fontSize={9}>{l.label}</text>
        </g>
      ))}
    </svg>
  )
}

// ── 8.1  Kitchen Circuit Requirements ────────────────────────────────────────
export function KitchenCircuits() {
  return (
    <svg viewBox="0 0 480 240" style={{ ...base, width: '100%', display: 'block' }}>
      <text x={240} y={14} textAnchor="middle" fill={G2} fontSize={11} fontWeight={700} letterSpacing={1}>NEC 210.52 — KITCHEN RECEPTACLE REQUIREMENTS</text>
      {/* Counter */}
      <rect x={30} y={60} width={420} height={120} rx={6} fill={N} stroke={G} strokeWidth={1.5} />
      <text x={240} y={130} textAnchor="middle" fill={G} fontSize={28} opacity={0.3}>KITCHEN COUNTER</text>
      {/* 20A circuit indicators */}
      {[80, 180, 280, 380].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={90} r={14} fill={A} fillOpacity={0.2} stroke={A} strokeWidth={1.5} />
          <text x={x} y={94} textAnchor="middle" fill={A} fontSize={9} fontWeight={700}>20A</text>
          <line x1={x} y1={104} x2={x} y2={150} stroke={A} strokeWidth={1} strokeDasharray="3,2" />
        </g>
      ))}
      {/* Rules */}
      <rect x={30} y={188} width={420} height={16} rx={3} fill={A} fillOpacity={0.1} />
      <text x={240} y={199} textAnchor="middle" fill={A} fontSize={10} fontWeight={700}>Minimum 2 small-appliance circuits (20A) required for countertop receptacles</text>
      <text x={240} y={216} textAnchor="middle" fill={G2} fontSize={9}>No point on counter more than 24" from a receptacle (measured horizontally)</text>
      <text x={240} y={230} textAnchor="middle" fill={G2} fontSize={9}>Refrigerator: dedicated 15A or 20A circuit recommended · GFCI required within 6 ft of sink</text>
    </svg>
  )
}

// ── 8.2  GFCI / AFCI Required Locations ──────────────────────────────────────
export function GFCILocations() {
  const gfci = ['Bathroom', 'Kitchen (within 6\' of sink)', 'Garage', 'Outdoor', 'Crawlspace', 'Unfinished basement', 'Boathouse', 'Swimming pool/spa']
  const afci = ['Bedroom', 'Family room', 'Dining room', 'Living room', 'Hallways', 'Closets', 'Sunrooms / similar']
  return (
    <svg viewBox="0 0 480 240" style={{ ...base, width: '100%', display: 'block' }}>
      <text x={240} y={14} textAnchor="middle" fill={G2} fontSize={11} fontWeight={700} letterSpacing={1}>NEC 210.8 & 210.12 — GFCI & AFCI REQUIRED LOCATIONS</text>
      {/* GFCI */}
      <rect x={10} y={24} width={220} height={200} rx={6} fill={GR} fillOpacity={0.06} stroke={GR} strokeWidth={1.5} />
      <text x={120} y={42} textAnchor="middle" fill={GR} fontSize={13} fontWeight={700}>GFCI Required</text>
      <text x={120} y={55} textAnchor="middle" fill={G2} fontSize={9}>Ground-fault protection</text>
      {gfci.map((loc, i) => (
        <g key={i}>
          <circle cx={26} cy={70 + i * 19} r={4} fill={GR} fillOpacity={0.4} />
          <text x={36} y={74 + i * 19} fill={G2} fontSize={10}>{loc}</text>
        </g>
      ))}
      {/* AFCI */}
      <rect x={250} y={24} width={220} height={200} rx={6} fill={A} fillOpacity={0.06} stroke={A} strokeWidth={1.5} />
      <text x={360} y={42} textAnchor="middle" fill={A} fontSize={13} fontWeight={700}>AFCI Required</text>
      <text x={360} y={55} textAnchor="middle" fill={G2} fontSize={9}>Arc-fault protection</text>
      {afci.map((loc, i) => (
        <g key={i}>
          <circle cx={266} cy={70 + i * 19} r={4} fill={A} fillOpacity={0.4} />
          <text x={276} y={74 + i * 19} fill={G2} fontSize={10}>{loc}</text>
        </g>
      ))}
    </svg>
  )
}

// ── 9.1  Motor Circuit Components ────────────────────────────────────────────
export function MotorCircuit() {
  const parts = [
    { label: 'Branch Circuit\nOCPD', sub: 'Max 250% FLA (inverse\ntime breaker) · 430.52', color: R },
    { label: 'Motor Circuit\nSwitch', sub: 'Disconnect means\n≥115% FLA · 430.110', color: A },
    { label: 'Controller\n(Starter)', sub: 'Starts/stops motor\nOLR sized 125% FLA', color: BL },
    { label: 'Overload\nRelay (OLR)', sub: 'Thermal protection\n125–140% FLA · 430.32', color: '#8B5CF6' },
    { label: 'Motor', sub: 'FLA from nameplate\nor NEC Table 430.248', color: GR },
  ]
  return (
    <svg viewBox="0 0 480 160" style={{ ...base, width: '100%', display: 'block' }}>
      <text x={240} y={14} textAnchor="middle" fill={G2} fontSize={11} fontWeight={700} letterSpacing={1}>NEC ART. 430 — MOTOR CIRCUIT COMPONENTS (IN ORDER)</text>
      {parts.map((p, i) => {
        const x = 8 + i * 93
        return (
          <g key={i}>
            <rect x={x} y={24} width={84} height={100} rx={6} fill={p.color} fillOpacity={0.1} stroke={p.color} strokeWidth={1.5} />
            {p.label.split('\n').map((line, li) => (
              <text key={li} x={x + 42} y={44 + li * 14} textAnchor="middle" fill={p.color} fontSize={10} fontWeight={700}>{line}</text>
            ))}
            {p.sub.split('\n').map((line, li) => (
              <text key={li} x={x + 42} y={76 + li * 12} textAnchor="middle" fill={G2} fontSize={8}>{line}</text>
            ))}
            {i < parts.length - 1 && (
              <text x={x + 90} y={78} fill={G} fontSize={16}>›</text>
            )}
          </g>
        )
      })}
      <text x={240} y={148} textAnchor="middle" fill={G} fontSize={9}>Order matters — NEC 430 requires each component sized and installed in sequence</text>
    </svg>
  )
}

// ── 9.2  Hazardous Location Classification ────────────────────────────────────
export function HazardousLocations() {
  const rows = [
    { label: 'Class I', desc: 'Flammable gases or vapors', examples: 'Paint booths, gas stations, refineries', color: R },
    { label: 'Class II', desc: 'Combustible dust', examples: 'Grain elevators, flour mills, coal plants', color: A },
    { label: 'Class III', desc: 'Ignitable fibers/flyings', examples: 'Textile mills, sawmills, cotton gins', color: '#8B5CF6' },
  ]
  const divs = [
    { div: 'Div. 1', desc: 'Hazardous material present under NORMAL conditions' },
    { div: 'Div. 2', desc: 'Hazardous material present only under ABNORMAL conditions' },
  ]
  return (
    <svg viewBox="0 0 480 220" style={{ ...base, width: '100%', display: 'block' }}>
      <text x={240} y={14} textAnchor="middle" fill={G2} fontSize={11} fontWeight={700} letterSpacing={1}>NEC ART. 500 — HAZARDOUS LOCATION CLASSIFICATION</text>
      {rows.map((r, i) => (
        <g key={i}>
          <rect x={10} y={24 + i * 52} width={460} height={48} rx={4} fill={r.color} fillOpacity={0.08} stroke={r.color} strokeWidth={1} />
          <rect x={10} y={24 + i * 52} width={80} height={48} rx={4} fill={r.color} fillOpacity={0.2} />
          <text x={50} y={45 + i * 52} textAnchor="middle" fill={r.color} fontSize={13} fontWeight={800}>{r.label}</text>
          <text x={50} y={60 + i * 52} textAnchor="middle" fill={r.color} fontSize={8}>NEC 500</text>
          <text x={100} y={40 + i * 52} fill={W} fontSize={11} fontWeight={600}>{r.desc}</text>
          <text x={100} y={55 + i * 52} fill={G2} fontSize={9}>Examples: {r.examples}</text>
        </g>
      ))}
      {divs.map((d, i) => (
        <g key={i}>
          <rect x={10 + i * 235} y={184} width={225} height={28} rx={4} fill={i === 0 ? R : A} fillOpacity={0.1} stroke={i === 0 ? R : A} strokeWidth={1} />
          <text x={122 + i * 235} y={196} textAnchor="middle" fill={i === 0 ? R : A} fontSize={10} fontWeight={700}>{d.div}</text>
          <text x={122 + i * 235} y={208} textAnchor="middle" fill={G2} fontSize={9}>{d.desc}</text>
        </g>
      ))}
    </svg>
  )
}

// ── 10.1  Solar PV System ─────────────────────────────────────────────────────
export function SolarPVSystem() {
  const comps = [
    { label: 'PV Array', sub: 'DC source · NEC 690.4', icon: '☀️', color: A },
    { label: 'DC Disconnect', sub: 'Rapid shutdown\n690.12', icon: '🔌', color: R },
    { label: 'Inverter', sub: 'DC → AC\n690.4(B)', icon: '⚡', color: BL },
    { label: 'AC Disconnect', sub: 'Utility side\n230.70', icon: '🔌', color: R },
    { label: 'Utility Meter', sub: 'Bidirectional\nnet metering', icon: '📊', color: G2 },
    { label: 'Load Panel', sub: 'Main distribution\n690.64', icon: '⚡', color: GR },
  ]
  return (
    <svg viewBox="0 0 480 150" style={{ ...base, width: '100%', display: 'block' }}>
      <text x={240} y={14} textAnchor="middle" fill={G2} fontSize={11} fontWeight={700} letterSpacing={1}>NEC ART. 690 — SOLAR PV SYSTEM OVERVIEW</text>
      {comps.map((c, i) => {
        const x = 8 + i * 77
        return (
          <g key={i}>
            <rect x={x} y={22} width={68} height={90} rx={5} fill={c.color} fillOpacity={0.1} stroke={c.color} strokeWidth={1.5} />
            <text x={x + 34} y={44} textAnchor="middle" fontSize={18}>{c.icon}</text>
            <text x={x + 34} y={60} textAnchor="middle" fill={c.color} fontSize={9} fontWeight={700}>{c.label}</text>
            {c.sub.split('\n').map((line, li) => (
              <text key={li} x={x + 34} y={73 + li * 11} textAnchor="middle" fill={G2} fontSize={8}>{line}</text>
            ))}
            {i < comps.length - 1 && (
              <text x={x + 74} y={72} fill={G} fontSize={14}>›</text>
            )}
          </g>
        )
      })}
      <text x={240} y={130} textAnchor="middle" fill={G2} fontSize={9}>Rapid shutdown required: system must de-energize within 30 sec · NEC 690.12</text>
      <text x={240} y={143} textAnchor="middle" fill={G} fontSize={9}>WA requires L&I permit · Interconnection agreement with utility required before operation</text>
    </svg>
  )
}

// ── 10.2  EV Charger Requirements ─────────────────────────────────────────────
export function EVCharger() {
  return (
    <svg viewBox="0 0 480 200" style={{ ...base, width: '100%', display: 'block' }}>
      <text x={240} y={14} textAnchor="middle" fill={G2} fontSize={11} fontWeight={700} letterSpacing={1}>NEC 625 — ELECTRIC VEHICLE SUPPLY EQUIPMENT (EVSE)</text>
      {/* Level 1 */}
      <rect x={10} y={24} width={140} height={140} rx={6} fill={GR} fillOpacity={0.08} stroke={GR} strokeWidth={1.5} />
      <text x={80} y={44} textAnchor="middle" fill={GR} fontSize={13} fontWeight={700}>Level 1</text>
      <text x={80} y={58} textAnchor="middle" fill={G2} fontSize={9}>120V / 15–20A</text>
      <text x={80} y={73} textAnchor="middle" fill={G2} fontSize={9}>3–5 miles/hour</text>
      <text x={80} y={88} textAnchor="middle" fill={G2} fontSize={9}>Standard outlet</text>
      <text x={80} y={103} textAnchor="middle" fill={G2} fontSize={9}>No special circuit</text>
      <text x={80} y={120} textAnchor="middle" fill={GR} fontSize={9} fontWeight={700}>Slow overnight charge</text>
      {/* Level 2 */}
      <rect x={170} y={24} width={140} height={140} rx={6} fill={A} fillOpacity={0.08} stroke={A} strokeWidth={1.5} />
      <text x={240} y={44} textAnchor="middle" fill={A} fontSize={13} fontWeight={700}>Level 2</text>
      <text x={240} y={58} textAnchor="middle" fill={G2} fontSize={9}>240V / 30–50A</text>
      <text x={240} y={73} textAnchor="middle" fill={G2} fontSize={9}>15–30 miles/hour</text>
      <text x={240} y={88} textAnchor="middle" fill={G2} fontSize={9}>Dedicated circuit</text>
      <text x={240} y={103} textAnchor="middle" fill={G2} fontSize={9}>GFCI protection req.</text>
      <text x={240} y={120} textAnchor="middle" fill={A} fontSize={9} fontWeight={700}>Most common install</text>
      {/* DC Fast */}
      <rect x={330} y={24} width={140} height={140} rx={6} fill={R} fillOpacity={0.08} stroke={R} strokeWidth={1.5} />
      <text x={400} y={44} textAnchor="middle" fill={R} fontSize={13} fontWeight={700}>DC Fast</text>
      <text x={400} y={58} textAnchor="middle" fill={G2} fontSize={9}>480V / 3-phase</text>
      <text x={400} y={73} textAnchor="middle" fill={G2} fontSize={9}>100–200+ miles/hr</text>
      <text x={400} y={88} textAnchor="middle" fill={G2} fontSize={9}>Commercial only</text>
      <text x={400} y={103} textAnchor="middle" fill={G2} fontSize={9}>Special equipment</text>
      <text x={400} y={120} textAnchor="middle" fill={R} fontSize={9} fontWeight={700}>Commercial/fleet</text>
      <text x={240} y={180} textAnchor="middle" fill={G2} fontSize={9}>NEC 625.17: EVSE must be listed · GFCI required for Level 1 & 2 · 125% continuous load rule applies</text>
      <text x={240} y={194} textAnchor="middle" fill={G} fontSize={9}>WA requires permit for Level 2 and DC Fast installations · WAC 296-46B</text>
    </svg>
  )
}

// ── 12.1  Arc Flash Boundaries ────────────────────────────────────────────────
export function ArcFlashBoundaries() {
  const cx = 240, cy = 150
  const zones = [
    { r: 130, label: 'Arc Flash Boundary', sub: 'Incident energy ≥ 1.2 cal/cm²', color: R, opacity: 0.06 },
    { r: 85, label: 'Limited Approach', sub: 'Unqualified: escort required', color: A, opacity: 0.08 },
    { r: 50, label: 'Restricted Approach', sub: 'Qualified only · Insulated tools', color: '#8B5CF6', opacity: 0.12 },
    { r: 22, label: 'Prohibited / Live Parts', sub: 'Full PPE required', color: R, opacity: 0.3 },
  ]
  return (
    <svg viewBox="0 0 480 310" style={{ ...base, width: '100%', display: 'block' }}>
      <text x={240} y={14} textAnchor="middle" fill={G2} fontSize={11} fontWeight={700} letterSpacing={1}>NFPA 70E — ARC FLASH APPROACH BOUNDARIES</text>
      {zones.map((z, i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={z.r} fill={z.color} fillOpacity={z.opacity} stroke={z.color} strokeWidth={i === 0 ? 2 : 1} strokeDasharray={i > 0 ? '5,3' : undefined} />
        </g>
      ))}
      {/* Center - energized equipment */}
      <rect x={cx - 18} y={cy - 12} width={36} height={24} rx={3} fill={R} fillOpacity={0.4} stroke={R} strokeWidth={2} />
      <text x={cx} y={cy + 4} textAnchor="middle" fill={W} fontSize={8} fontWeight={700}>LIVE</text>
      {/* Labels */}
      {zones.map((z, i) => (
        <g key={i}>
          <line x1={cx + z.r} y1={cy} x2={cx + z.r + 20} y2={cy - 30 + i * 20} stroke={z.color} strokeWidth={1} strokeOpacity={0.6} />
          <text x={cx + z.r + 24} y={cy - 34 + i * 20} fill={z.color} fontSize={9} fontWeight={700}>{z.label}</text>
          <text x={cx + z.r + 24} y={cy - 22 + i * 20} fill={G2} fontSize={8}>{z.sub}</text>
        </g>
      ))}
      <rect x={10} y={278} width={460} height={28} rx={4} fill={R} fillOpacity={0.08} />
      <text x={240} y={291} textAnchor="middle" fill={R} fontSize={10} fontWeight={700}>Always perform arc flash risk assessment before energized work · NFPA 70E 130.5</text>
      <text x={240} y={303} textAnchor="middle" fill={G2} fontSize={9}>PPE Category determines required protection level — see Table 130.5(C)</text>
    </svg>
  )
}

// ── 12.2  LOTO Procedure ─────────────────────────────────────────────────────
export function LOTOProcedure() {
  const steps = [
    { num: '1', label: 'Notify', sub: 'Inform all affected employees', color: BL },
    { num: '2', label: 'Identify', sub: 'Locate all energy sources', color: A },
    { num: '3', label: 'Isolate', sub: 'Open all disconnects / switches', color: '#8B5CF6' },
    { num: '4', label: 'Lockout', sub: 'Apply lock AND tag to each point', color: R },
    { num: '5', label: 'Release', sub: 'Release stored energy (bleed capacitors)', color: A },
    { num: '6', label: 'Verify', sub: 'Test: confirm zero energy state', color: GR },
  ]
  return (
    <svg viewBox="0 0 480 200" style={{ ...base, width: '100%', display: 'block' }}>
      <text x={240} y={14} textAnchor="middle" fill={G2} fontSize={11} fontWeight={700} letterSpacing={1}>LOCKOUT / TAGOUT — 6 STEP PROCEDURE (OSHA 1910.147)</text>
      {steps.map((s, i) => {
        const x = 8 + i * 78
        return (
          <g key={i}>
            <rect x={x} y={22} width={68} height={140} rx={5} fill={s.color} fillOpacity={0.1} stroke={s.color} strokeWidth={1.5} />
            <circle cx={x + 34} cy={44} r={16} fill={s.color} fillOpacity={0.25} stroke={s.color} strokeWidth={1.5} />
            <text x={x + 34} y={50} textAnchor="middle" fill={s.color} fontSize={16} fontWeight={800}>{s.num}</text>
            <text x={x + 34} y={74} textAnchor="middle" fill={s.color} fontSize={11} fontWeight={700}>{s.label}</text>
            {s.sub.split(' ').reduce((acc: string[][], word) => {
              const last = acc[acc.length - 1]
              if (!last || (last.join(' ') + ' ' + word).length > 12) acc.push([word])
              else last.push(word)
              return acc
            }, []).map((line, li) => (
              <text key={li} x={x + 34} y={90 + li * 13} textAnchor="middle" fill={G2} fontSize={8}>{line.join(' ')}</text>
            ))}
            {i < steps.length - 1 && (
              <text x={x + 74} y={96} fill={G} fontSize={14}>›</text>
            )}
          </g>
        )
      })}
      <rect x={10} y={170} width={460} height={24} rx={4} fill={R} fillOpacity={0.08} />
      <text x={240} y={182} textAnchor="middle" fill={R} fontSize={10} fontWeight={700}>⚠ LOTO is OSHA-required for all work on energized systems — violations carry heavy fines</text>
      <text x={240} y={192} textAnchor="middle" fill={G2} fontSize={9}>Each authorized employee must apply their OWN personal lock · Never use one lock for the crew</text>
    </svg>
  )
}

// ── 12.3  PPE Categories ─────────────────────────────────────────────────────
export function PPECategories() {
  const cats = [
    { cat: '0', cal: '≤ 1.2', label: 'Non-melting or untreated natural fiber', color: GR },
    { cat: '1', cal: '4', label: 'Arc-rated shirt & pants / coverall · Face shield', color: BL },
    { cat: '2', cal: '8', label: 'Cat 1 + arc-rated long sleeves · Hard hat · Gloves', color: A },
    { cat: '3', cal: '25', label: 'Arc flash suit over Cat 2 · Hood · Gloves rated 25 cal', color: '#E09012' },
    { cat: '4', cal: '40', label: 'Full arc flash suit 40 cal/cm² · Multiple layers', color: R },
  ]
  return (
    <svg viewBox="0 0 480 220" style={{ ...base, width: '100%', display: 'block' }}>
      <text x={240} y={14} textAnchor="middle" fill={G2} fontSize={11} fontWeight={700} letterSpacing={1}>NFPA 70E TABLE 130.5(C) — PPE CATEGORIES</text>
      <text x={10} y={30} fill={G2} fontSize={9} fontWeight={700}>CAT</text>
      <text x={50} y={30} fill={G2} fontSize={9} fontWeight={700}>INCIDENT ENERGY (cal/cm²)</text>
      <text x={200} y={30} fill={G2} fontSize={9} fontWeight={700}>MINIMUM PPE REQUIRED</text>
      {cats.map((c, i) => (
        <g key={i}>
          <rect x={10} y={34 + i * 34} width={460} height={30} rx={3} fill={c.color} fillOpacity={0.08} stroke={c.color} strokeWidth={1} strokeOpacity={0.4} />
          <rect x={10} y={34 + i * 34} width={34} height={30} rx={3} fill={c.color} fillOpacity={0.2} />
          <text x={27} y={53 + i * 34} textAnchor="middle" fill={c.color} fontSize={14} fontWeight={800}>{c.cat}</text>
          <text x={140} y={50 + i * 34} textAnchor="middle" fill={c.color} fontSize={11} fontWeight={700}>{c.cal} cal/cm²</text>
          <text x={215} y={50 + i * 34} fill={G2} fontSize={9}>{c.label}</text>
        </g>
      ))}
    </svg>
  )
}

// ── Export mapping: section ID → component ───────────────────────────────────
export const SECTION_ILLUSTRATIONS: Record<string, () => JSX.Element> = {
  '1.2': LicenseHierarchy,
  '1.3': CERenewalCycle,
  '2.1': PermitWorkflow,
  '2.2': InspectionSequence,
  '3.3': WorkingSpace,
  '3.4': TempDerating,
  '4.1': BurialDepths,
  '4.2': ConduitTypes,
  '4.4': ConduitFill,
  '5.1': GroundingSystem,
  '6.1': ServiceEntrance,
  '7.1': PanelLayout,
  '8.1': KitchenCircuits,
  '8.2': GFCILocations,
  '9.1': MotorCircuit,
  '9.2': HazardousLocations,
  '10.1': SolarPVSystem,
  '10.2': EVCharger,
  '12.1': ArcFlashBoundaries,
  '12.2': LOTOProcedure,
  '12.3': PPECategories,
}
