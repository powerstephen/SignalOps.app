'use client'
import { useState, useEffect, useRef } from 'react'
import { Lock, TrendingUp, AlertTriangle, CheckCircle, Star, Zap, ArrowRight, DollarSign, Users, MessageSquare, BookOpen, Video, FileText, ChevronRight, Shield, Target, BarChart2, Sparkles } from 'lucide-react'

const DATA = {
  summary: { champions:14, diamonds:10, quickwins:31, drains:45, total:100, champion_revenue_pct:71, drain_cost_pct:48 },
  top_actions: [
    { rank:1, action:'Fix onboarding for 19 drain accounts', value:'€171k at risk', owner:'CS Team', urgency:'high', detail:'19 customers never completed onboarding — averaging 18 support tickets/mo each' },
    { rank:2, action:'Reduce integration friction for 10 Diamonds', value:'€134k in recoverable margin', owner:'Product Team', urgency:'high', detail:'42% of Diamond tickets are integration setup issues fixable with video guides' },
    { rank:3, action:'Upgrade campaign for 18 Quick Win accounts', value:'€162k additional ARR', owner:'Sales Team', urgency:'medium', detail:'18 accounts on Starter plan are using Growth features — primed for upgrade' },
  ],
  leaks: [
    { id:'l1', type:'drain', title:'Onboarding never completed', count:19, revenue_impact:'€171k at risk', avg_tickets:18, urgency:'High', fix_type:'checklist', fix:'Automated onboarding checklist with milestone triggers', fix_detail:'Build a 5-step onboarding checklist triggered on signup. Customers who complete all 5 steps have 4x lower churn rate.', owner:'CS Team' },
    { id:'l2', type:'drain', title:'Single contact — no team adoption', count:14, revenue_impact:'€126k at risk', avg_tickets:12, urgency:'High', fix_type:'playbook', fix:'Champion expansion playbook', fix_detail:'Identify and engage a second stakeholder within first 30 days. Multi-contact accounts churn at 3x lower rate.', owner:'CS + Sales' },
    { id:'l3', type:'drain', title:'Technical integration issues', count:8, revenue_impact:'€72k at risk', avg_tickets:16, urgency:'Medium', fix_type:'video', fix:'Video explainer series for top 5 integration scenarios', fix_detail:'Record 5 x 3-minute setup videos for most common integrations. Reduces integration tickets by estimated 60%.', owner:'Product Team' },
    { id:'l4', type:'quickwin', title:'Low product usage after month 3', count:9, revenue_impact:'€81k churn risk', avg_tickets:3, urgency:'Medium', fix_type:'playbook', fix:'Re-engagement sequence at 60-day low usage mark', fix_detail:'Trigger automated re-engagement when weekly logins drop below 2. Early intervention recovers 40% of at-risk accounts.', owner:'CS Team' },
    { id:'l5', type:'drain', title:'Feature confusion — reporting module', count:4, revenue_impact:'€36k at risk', avg_tickets:9, urgency:'Low', fix_type:'faq', fix:'In-app tooltips and FAQ for reporting module', fix_detail:'Add contextual help to the 3 most-asked-about report types. Estimated 80% reduction in reporting tickets.', owner:'Product Team' },
  ],
  fixes: [
    { id:'f1', segment:'Diamond', title:'Fix integration setup friction', accounts:10, current_cost:'11.4 tickets/mo avg', after_cost:'~2.5 tickets/mo', value:'€134k margin recovery', effort:'Medium', actions:[
      { step:'Record 3 video walkthroughs for top integration scenarios', owner:'Product', timeframe:'2 weeks' },
      { step:'Add interactive field mapping wizard to onboarding flow', owner:'Engineering', timeframe:'4 weeks' },
      { step:'Add glossary and tooltip layer on all dashboard metrics', owner:'Product', timeframe:'1 week' },
    ]},
    { id:'f2', segment:'Diamond', title:'Fix data mapping confusion', accounts:7, current_cost:'8.2 tickets/mo avg', after_cost:'~1.8 tickets/mo', value:'€89k margin recovery', effort:'Low', actions:[
      { step:'Build interactive CSV field mapping guide', owner:'Product', timeframe:'1 week' },
      { step:'Add example data templates for each data source type', owner:'CS', timeframe:'3 days' },
    ]},
    { id:'f3', segment:'Quick Win', title:'Unlock expansion — Starter → Growth upgrade', accounts:18, current_cost:'€18k avg LTV', after_cost:'€36k avg LTV', value:'€162k additional ARR', effort:'Low', actions:[
      { step:'Identify 18 Starter accounts actively using Growth-tier features', owner:'Sales', timeframe:'1 day' },
      { step:'Send targeted upgrade sequence with feature comparison', owner:'Sales', timeframe:'1 week' },
      { step:'Offer 30-day Growth trial to highest-usage Starter accounts', owner:'Sales', timeframe:'2 days' },
    ]},
    { id:'f4', segment:'Quick Win', title:'Unlock expansion — exec sponsor engagement', accounts:4, current_cost:'No budget authority', after_cost:'Budget approved', value:'€72k additional ARR', effort:'Medium', actions:[
      { step:'Create executive briefing template for champion to share upward', owner:'CS', timeframe:'3 days' },
      { step:'Schedule exec QBR for top 4 accounts', owner:'CS + Sales', timeframe:'2 weeks' },
    ]},
  ],
  champions: {
    avg_ltv:74000, avg_tickets:2.1, avg_time_to_value:18, expansion_rate:82,
    shared_traits:['VP Sales or RevOps champion from day one','Connected CRM + billing within first week','Attended onboarding with 3+ team members','Used product daily within 14 days','Introduced exec sponsor proactively'],
    at_risk: 2,
    health_signals:['2 Champions have not logged in for 8+ days — flag for CS outreach','1 Champion contact changed role — confirm new champion immediately'],
  },
}

const FIX_ICON: Record<string,any> = { checklist:CheckCircle, playbook:BookOpen, video:Video, faq:FileText }
const URGENCY_STYLE: Record<string,string> = {
  High:'bg-red-500/15 text-red-400 border border-red-500/30',
  Medium:'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  Low:'bg-slate-700/50 text-slate-400 border border-slate-600',
}
const EFFORT_STYLE: Record<string,string> = {
  Low:'bg-green-500/15 text-green-400',
  Medium:'bg-amber-500/15 text-amber-400',
  High:'bg-red-500/15 text-red-400',
}
const SEGMENT_STYLE: Record<string,string> = {
  Diamond:'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  'Quick Win':'bg-blue-500/15 text-blue-400 border border-blue-500/30',
}

// ── Animated counter ──────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200, start = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(ease * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return value
}

// ── Animated donut chart ──────────────────────────────────────────────────
function DonutChart({ animate }: { animate: boolean }) {
  const segments = [
    { label: 'Drains', count: 45, pct: 45, color: '#ef4444', glow: 'rgba(239,68,68,0.4)' },
    { label: 'Quick Wins', count: 31, pct: 31, color: '#3b82f6', glow: 'rgba(59,130,246,0.4)' },
    { label: 'Champions', count: 14, pct: 14, color: '#14b8a6', glow: 'rgba(20,184,166,0.4)' },
    { label: 'Diamonds', count: 10, pct: 10, color: '#f59e0b', glow: 'rgba(245,158,11,0.4)' },
  ]
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!animate) return
    let start: number | null = null
    const duration = 1400
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setProgress(1 - Math.pow(1 - p, 3))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [animate])

  const cx = 80, cy = 80, r = 58, inner = 36
  const circumference = 2 * Math.PI * r
  let offset = 0
  const arcs = segments.map(seg => {
    const dash = (seg.pct / 100) * circumference * progress
    const gap = circumference - dash
    const rotation = (offset / 100) * 360 - 90
    offset += seg.pct
    return { ...seg, dash, gap, rotation }
  })

  return (
    <div className="flex items-center gap-6">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <defs>
          {arcs.map(a => (
            <filter key={a.label} id={`glow-${a.label}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          ))}
        </defs>
        {/* Background ring */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14"/>
        {arcs.map((a) => (
          <circle
            key={a.label}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={a.color}
            strokeWidth="14"
            strokeDasharray={`${a.dash} ${a.gap}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform={`rotate(${a.rotation} ${cx} ${cy})`}
            style={{ filter: `drop-shadow(0 0 6px ${a.glow})`, transition: 'stroke-dasharray 0.05s' }}
          />
        ))}
        {/* Inner */}
        <circle cx={cx} cy={cy} r={inner} fill="rgba(15,23,42,0.9)"/>
        <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="18" fontWeight="700">100</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#64748b" fontSize="9">accounts</text>
      </svg>
      <div className="space-y-2">
        {arcs.map(a => (
          <div key={a.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: a.color, boxShadow: `0 0 6px ${a.glow}` }}/>
            <span className="text-xs text-slate-400">{a.label}</span>
            <span className="text-xs font-bold ml-auto pl-4" style={{ color: a.color }}>{a.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Stat card with count-up ───────────────────────────────────────────────
function StatCard({ icon:Icon, label, value, sub, color='teal', animate=false, index=0 }: any) {
  const c: Record<string,string> = { teal:'text-teal-400', amber:'text-amber-400', red:'text-red-400', indigo:'text-indigo-400', green:'text-green-400', blue:'text-blue-400', slate:'text-slate-400' }
  const border: Record<string,string> = { teal:'border-teal-500/20', amber:'border-amber-500/20', red:'border-red-500/20', green:'border-green-500/20', blue:'border-blue-500/20', slate:'border-slate-700' }
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!animate) return
    const t = setTimeout(() => setVisible(true), index * 80)
    return () => clearTimeout(t)
  }, [animate, index])

  return (
    <div
      className={`bg-slate-800/50 border ${border[color] || 'border-slate-700'} rounded-xl p-4 transition-all duration-500`}
      style={{ opacity: animate ? (visible ? 1 : 0) : 1, transform: animate ? (visible ? 'translateY(0)' : 'translateY(12px)') : 'none' }}
    >
      <div className="flex items-center gap-2 mb-2"><Icon size={14} className={c[color]}/><span className="text-xs text-slate-500">{label}</span></div>
      <p className={`text-2xl font-bold ${c[color]} mb-0.5`}>{value}</p>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  )
}

// ── 2x2 Matrix diagram ────────────────────────────────────────────────────
function MatrixDiagram({ onSelect, animate }: { onSelect: (s:string)=>void, animate: boolean }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!animate) return
    const t = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(t)
  }, [animate])

  const quads = [
    { id:'tl', label:'Diamonds', sub:'High LTV · High cost', count:10, x:8, y:8, color:'#f59e0b', glow:'rgba(245,158,11,0.3)', section:'fixes', dot:'bg-amber-400' },
    { id:'tr', label:'Champions', sub:'High LTV · Low cost', count:14, x:58, y:8, color:'#14b8a6', glow:'rgba(20,184,166,0.35)', section:'protect', dot:'bg-teal-400' },
    { id:'bl', label:'Drains', sub:'Low LTV · High cost', count:45, x:8, y:58, color:'#ef4444', glow:'rgba(239,68,68,0.3)', section:'leaks', dot:'bg-red-400' },
    { id:'br', label:'Quick Wins', sub:'Low LTV · Low cost', count:31, x:58, y:58, color:'#3b82f6', glow:'rgba(59,130,246,0.3)', section:'fixes', dot:'bg-blue-400' },
  ]

  return (
    <div
      className="relative transition-all duration-700"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'scale(1)' : 'scale(0.97)' }}
    >
      {/* Axis labels */}
      <div className="flex justify-between text-xs text-slate-600 mb-1 px-1">
        <span>← Low LTV</span><span>High LTV →</span>
      </div>
      <div className="relative border border-slate-700/60 rounded-2xl overflow-hidden" style={{ background: 'rgba(15,23,42,0.6)' }}>
        {/* Cross lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-700/50"/>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-700/50"/>
        </div>
        <div className="grid grid-cols-2">
          {quads.map(q => (
            <button
              key={q.id}
              onClick={() => onSelect(q.section)}
              className="p-5 text-left hover:bg-white/3 transition-all duration-200 group relative"
            >
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-opacity-90">{q.label}</p>
                  <p className="text-xs text-slate-500">{q.sub}</p>
                </div>
                <span
                  className="text-2xl font-black"
                  style={{ color: q.color, textShadow: `0 0 20px ${q.glow}` }}
                >{q.count}</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <ChevronRight size={10} style={{ color: q.color }}/>
                <span className="text-xs" style={{ color: q.color }}>
                  {q.section === 'protect' ? 'Protect these' : q.section === 'leaks' ? 'Fix leaks' : 'Grow these'}
                </span>
              </div>
              {/* Corner glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-sm"
                style={{ background: `radial-gradient(circle at ${q.id.includes('r')?'100%':'0%'} ${q.id.includes('b')?'100%':'0%'}, ${q.glow} 0%, transparent 70%)` }}
              />
            </button>
          ))}
        </div>
        {/* Axis side label */}
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-slate-600 whitespace-nowrap">High cost ↑ · Low cost ↓</div>
      </div>
      <p className="text-xs text-slate-600 text-center mt-2">Click any quadrant to explore</p>
    </div>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function ProfitMatrix() {
  const [unlocked, setUnlocked] = useState(false)
  const [activeSection, setActiveSection] = useState('snapshot')
  const [expandedFix, setExpandedFix] = useState<string|null>(null)
  const [expandedLeak, setExpandedLeak] = useState<string|null>(null)
  const [chartAnimate, setChartAnimate] = useState(false)
  const [contentAnimate, setContentAnimate] = useState(false)
  const [pulseGlow, setPulseGlow] = useState(false)
  const D = DATA

  // Trigger lock screen chart animation on mount
  useEffect(() => {
    const t = setTimeout(() => setChartAnimate(true), 400)
    const t2 = setTimeout(() => setPulseGlow(true), 200)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [])

  // Trigger unlocked content animation
  useEffect(() => {
    if (unlocked) {
      setContentAnimate(false)
      const t = setTimeout(() => setContentAnimate(true), 100)
      return () => clearTimeout(t)
    }
  }, [unlocked, activeSection])

  const handleSectionChange = (s: string) => {
    setContentAnimate(false)
    setActiveSection(s)
    setTimeout(() => setContentAnimate(true), 80)
  }

  // ── LOCKED ───────────────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Profit Matrix</h2>
          <p className="text-slate-400 text-sm">Your revenue has a leak. Here's exactly where — and what to do about it.</p>
        </div>

        {/* Hero numbers */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="border border-red-500/25 rounded-2xl p-5 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(15,23,42,0.6) 100%)' }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 0% 0%, rgba(239,68,68,0.12) 0%, transparent 60%)' }}/>
            <p className="text-xs text-slate-500 mb-1 relative">Revenue at risk</p>
            <p className="text-4xl font-black text-red-400 relative" style={{ textShadow: '0 0 30px rgba(239,68,68,0.5)' }}>€405k</p>
            <p className="text-xs text-slate-500 mt-1 relative">from 45 drain accounts</p>
          </div>
          <div
            className="border border-teal-500/25 rounded-2xl p-5 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.08) 0%, rgba(15,23,42,0.6) 100%)' }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 100% 0%, rgba(20,184,166,0.12) 0%, transparent 60%)' }}/>
            <p className="text-xs text-slate-500 mb-1 relative">Recoverable value</p>
            <p className="text-4xl font-black text-teal-400 relative" style={{ textShadow: '0 0 30px rgba(20,184,166,0.5)' }}>€457k</p>
            <p className="text-xs text-slate-500 mt-1 relative">identified & actionable</p>
          </div>
        </div>

        {/* Donut chart teaser */}
        <div
          className="border border-slate-700/60 rounded-2xl p-5 relative overflow-hidden"
          style={{ background: 'rgba(15,23,42,0.5)' }}
        >
          <p className="text-xs text-slate-500 font-semibold mb-4 uppercase tracking-wider">Your 100 accounts, by profitability</p>
          <DonutChart animate={chartAnimate} />
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <p className="text-xs text-slate-500">
              <span className="text-red-400 font-semibold">45 drain accounts</span> are costing more than they generate. 
              <span className="text-teal-400 font-semibold"> 14 Champions</span> produce 71% of your revenue. Unlock to see exactly what to do.
            </p>
          </div>
        </div>

        {/* Unlock card */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(20,184,166,0.06) 0%, rgba(15,23,42,0.8) 50%, rgba(20,184,166,0.04) 100%)',
            border: '1px solid',
            borderColor: pulseGlow ? 'rgba(20,184,166,0.35)' : 'rgba(20,184,166,0.15)',
            boxShadow: pulseGlow ? '0 0 40px rgba(20,184,166,0.08), inset 0 0 40px rgba(20,184,166,0.03)' : 'none',
            transition: 'all 1.5s ease-in-out',
          }}
        >
          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(20,184,166,0.6), transparent)' }}/>
          
          <div className="text-center mb-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 relative"
              style={{
                background: 'rgba(20,184,166,0.1)',
                border: '1px solid rgba(20,184,166,0.3)',
                boxShadow: '0 0 20px rgba(20,184,166,0.2)',
              }}
            >
              <Lock size={22} className="text-teal-400"/>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Unlock Profit Matrix</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
              See the specific accounts that are draining your margin, which customers are one fix away from Champion status, and the step-by-step actions ranked by revenue impact.
            </p>
          </div>

          {/* Value items */}
          <div className="space-y-2 mb-5">
            {[
              { icon: BarChart2, text: 'Full profitability breakdown across all 4 customer segments', color: 'text-teal-400' },
              { icon: AlertTriangle, text: '5 revenue leaks identified — each with a named owner and fix', color: 'text-red-400' },
              { icon: Target, text: '4 high-value interventions with step-by-step action plans', color: 'text-amber-400' },
              { icon: Shield, text: 'Champion health monitoring with early warning signals', color: 'text-blue-400' },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-start gap-3 bg-slate-900/40 rounded-xl px-3 py-2.5">
                <Icon size={13} className={`${color} flex-shrink-0 mt-0.5`}/>
                <p className="text-xs text-slate-300">{text}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-teal-400 font-semibold mb-3">Available on Growth plan · €99/month</p>
          <button
            onClick={() => setUnlocked(true)}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white relative overflow-hidden transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            style={{
              background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #0d9488 100%)',
              boxShadow: '0 4px 24px rgba(20,184,166,0.35), 0 1px 0 rgba(255,255,255,0.1) inset',
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Sparkles size={14}/>
              Unlock Profit Matrix
              <ArrowRight size={14}/>
            </span>
          </button>
          <p className="text-center text-xs text-slate-600 mt-2">Demo mode — click to preview</p>
        </div>
      </div>
    )
  }

  // ── UNLOCKED ─────────────────────────────────────────────────────────────
  const sections = [
    { id:'snapshot', label:'Revenue Snapshot', icon: BarChart2 },
    { id:'leaks',    label:'Revenue Leaks', icon: AlertTriangle },
    { id:'fixes',    label:'What to Fix', icon: Target },
    { id:'protect',  label:'Who to Protect', icon: Shield },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-white">Profit Matrix</h2>
            <span
              className="text-xs text-white px-2 py-0.5 rounded-full font-semibold"
              style={{ background: 'linear-gradient(135deg, #0d9488, #14b8a6)', boxShadow: '0 0 10px rgba(20,184,166,0.3)' }}
            >Growth</span>
          </div>
          <p className="text-slate-400 text-sm">AI-identified revenue actions, ranked by impact.</p>
        </div>
      </div>

      {/* Section nav */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {sections.map(s => {
          const Icon = s.icon
          return (
            <button
              key={s.id}
              onClick={() => handleSectionChange(s.id)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200"
              style={activeSection === s.id ? {
                background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                color: 'white',
                boxShadow: '0 0 12px rgba(20,184,166,0.3)',
              } : {
                background: 'rgba(30,41,59,0.8)',
                color: '#94a3b8',
                border: '1px solid rgba(71,85,105,0.5)',
              }}
            >
              <Icon size={11}/>
              {s.label}
            </button>
          )
        })}
      </div>

      {/* ── REVENUE SNAPSHOT ── */}
      {activeSection === 'snapshot' && (
        <div
          className="space-y-5 transition-all duration-400"
          style={{ opacity: contentAnimate ? 1 : 0, transform: contentAnimate ? 'translateY(0)' : 'translateY(8px)' }}
        >
          {/* Top 3 actions */}
          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.06), rgba(15,23,42,0.8))', border: '1px solid rgba(20,184,166,0.2)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(20,184,166,0.5), transparent)' }}/>
            <div className="flex items-center gap-2 mb-4">
              <Zap size={15} className="text-teal-400"/>
              <p className="text-sm font-bold text-white">Your top 3 actions right now</p>
              <span className="text-xs text-slate-500 ml-auto">Ranked by revenue impact</span>
            </div>
            <div className="space-y-2.5">
              {D.top_actions.map((a, i) => (
                <div
                  key={a.rank}
                  className="flex items-center gap-3 rounded-xl p-3 transition-all duration-200 hover:bg-white/3"
                  style={{
                    background: 'rgba(15,23,42,0.6)',
                    border: '1px solid rgba(71,85,105,0.3)',
                    opacity: contentAnimate ? 1 : 0,
                    transform: contentAnimate ? 'translateX(0)' : 'translateX(-8px)',
                    transition: `all 0.4s ease ${i * 100}ms`,
                  }}
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0d9488, #14b8a6)', boxShadow: '0 0 10px rgba(20,184,166,0.3)' }}
                  >{a.rank}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{a.action}</p>
                    <p className="text-xs text-slate-500">{a.detail}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.urgency==='high'?'bg-red-500/15 text-red-400 border border-red-500/20':'bg-amber-500/15 text-amber-400 border border-amber-500/20'}`}>{a.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={Star} label="Champion accounts" value="14" sub="generate 71% of revenue" color="teal" animate={contentAnimate} index={0}/>
            <StatCard icon={DollarSign} label="Revenue at risk" value="€405k" sub="from 45 drain accounts" color="red" animate={contentAnimate} index={1}/>
            <StatCard icon={TrendingUp} label="Recoverable margin" value="€134k" sub="if Diamonds fixed" color="amber" animate={contentAnimate} index={2}/>
            <StatCard icon={Zap} label="Expansion potential" value="€315k" sub="from Quick Wins" color="blue" animate={contentAnimate} index={3}/>
          </div>

          {/* 2x2 matrix */}
          <div>
            <p className="text-xs text-slate-500 mb-3 font-semibold uppercase tracking-wider">Profitability matrix — your 100 accounts</p>
            <MatrixDiagram onSelect={handleSectionChange} animate={contentAnimate} />
          </div>
        </div>
      )}

      {/* ── WHERE IS REVENUE LEAKING ── */}
      {activeSection === 'leaks' && (
        <div
          className="space-y-4 transition-all duration-400"
          style={{ opacity: contentAnimate ? 1 : 0, transform: contentAnimate ? 'translateY(0)' : 'translateY(8px)' }}
        >
          <div
            className="rounded-2xl p-4 flex items-start gap-3 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.07), rgba(15,23,42,0.7))', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.4), transparent)' }}/>
            <AlertTriangle size={15} className="text-red-400 flex-shrink-0 mt-0.5"/>
            <p className="text-sm text-slate-300"><span className="text-white font-semibold">€486k total revenue at risk</span> across 54 accounts. Below are every leak ranked by impact — each with a specific fix, an owner, and an estimated recovery value.</p>
          </div>

          <div className="space-y-2.5">
            {D.leaks.map((leak, i) => {
              const FixIcon = FIX_ICON[leak.fix_type] || Zap
              const isExpanded = expandedLeak === leak.id
              return (
                <div
                  key={leak.id}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: 'rgba(15,23,42,0.5)',
                    border: '1px solid rgba(71,85,105,0.4)',
                    opacity: contentAnimate ? 1 : 0,
                    transform: contentAnimate ? 'translateY(0)' : 'translateY(10px)',
                    transition: `all 0.4s ease ${i * 70}ms`,
                  }}
                >
                  <button className="w-full p-4 text-left hover:bg-white/2 transition-colors" onClick={() => setExpandedLeak(isExpanded ? null : leak.id)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span className="w-6 h-6 bg-slate-700/80 rounded-full flex items-center justify-center text-xs font-bold text-slate-400 flex-shrink-0 mt-0.5">{i+1}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="text-sm font-bold text-white">{leak.title}</p>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${URGENCY_STYLE[leak.urgency]}`}>{leak.urgency}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${leak.type==='drain'?'bg-red-500/10 text-red-400':'bg-amber-500/10 text-amber-400'}`}>{leak.type==='drain'?'Drain':'Quick Win at risk'}</span>
                          </div>
                          <p className="text-xs text-slate-500">{leak.count} accounts · avg {leak.avg_tickets} tickets/mo · Owner: {leak.owner}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <p className="text-sm font-bold text-red-400">{leak.revenue_impact}</p>
                        <ChevronRight size={14} className={`text-slate-500 transition-transform duration-200 ${isExpanded?'rotate-90':''}`}/>
                      </div>
                    </div>
                  </button>

                  <div
                    style={{
                      maxHeight: isExpanded ? '200px' : '0',
                      overflow: 'hidden',
                      transition: 'max-height 0.3s ease',
                    }}
                  >
                    <div className="border-t border-slate-700/40 p-4">
                      <div
                        className="rounded-xl p-3 flex items-start gap-2"
                        style={{ background: 'rgba(20,184,166,0.05)', border: '1px solid rgba(20,184,166,0.2)' }}
                      >
                        <FixIcon size={13} className="text-teal-400 flex-shrink-0 mt-0.5"/>
                        <div>
                          <p className="text-xs text-teal-400 font-semibold mb-1">{leak.fix}</p>
                          <p className="text-xs text-slate-300">{leak.fix_detail}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── WHAT CAN WE FIX ── */}
      {activeSection === 'fixes' && (
        <div
          className="space-y-4 transition-all duration-400"
          style={{ opacity: contentAnimate ? 1 : 0, transform: contentAnimate ? 'translateY(0)' : 'translateY(8px)' }}
        >
          <div
            className="rounded-2xl p-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.06), rgba(15,23,42,0.7))', border: '1px solid rgba(20,184,166,0.2)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(20,184,166,0.4), transparent)' }}/>
            <p className="text-sm text-slate-300"><span className="text-teal-400 font-semibold">€457k in recoverable value</span> across 4 targeted interventions. Each fix has a clear owner, effort rating, and step-by-step action plan.</p>
          </div>

          <div className="space-y-2.5">
            {D.fixes.map((fix, i) => {
              const isExpanded = expandedFix === fix.id
              return (
                <div
                  key={fix.id}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: 'rgba(15,23,42,0.5)',
                    border: '1px solid rgba(71,85,105,0.4)',
                    opacity: contentAnimate ? 1 : 0,
                    transform: contentAnimate ? 'translateY(0)' : 'translateY(10px)',
                    transition: `all 0.4s ease ${i * 70}ms`,
                  }}
                >
                  <button className="w-full p-4 text-left hover:bg-white/2 transition-colors" onClick={() => setExpandedFix(isExpanded ? null : fix.id)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="text-sm font-bold text-white">{fix.title}</p>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${SEGMENT_STYLE[fix.segment]}`}>{fix.segment}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${EFFORT_STYLE[fix.effort]}`}>{fix.effort} effort</span>
                        </div>
                        <p className="text-xs text-slate-500">{fix.accounts} accounts · Tickets: {fix.current_cost} → {fix.after_cost}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <p className="text-sm font-bold text-teal-400">{fix.value}</p>
                        <ChevronRight size={14} className={`text-slate-500 transition-transform duration-200 ${isExpanded?'rotate-90':''}`}/>
                      </div>
                    </div>
                  </button>

                  <div
                    style={{
                      maxHeight: isExpanded ? '400px' : '0',
                      overflow: 'hidden',
                      transition: 'max-height 0.35s ease',
                    }}
                  >
                    <div className="border-t border-slate-700/40 p-4">
                      <p className="text-xs text-slate-500 font-semibold mb-3 uppercase tracking-wider">Step-by-step action plan</p>
                      <div className="space-y-2">
                        {fix.actions.map((action, j) => (
                          <div
                            key={j}
                            className="flex items-start gap-3 rounded-lg p-3"
                            style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(71,85,105,0.3)' }}
                          >
                            <span
                              className="w-5 h-5 rounded-full flex items-center justify-center text-teal-400 text-xs font-bold flex-shrink-0 mt-0.5"
                              style={{ background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)' }}
                            >{j+1}</span>
                            <div className="flex-1">
                              <p className="text-xs text-slate-300">{action.step}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-xs text-slate-500">{action.owner}</p>
                              <p className="text-xs text-teal-400">{action.timeframe}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── WHO TO PROTECT ── */}
      {activeSection === 'protect' && (
        <div
          className="space-y-4 transition-all duration-400"
          style={{ opacity: contentAnimate ? 1 : 0, transform: contentAnimate ? 'translateY(0)' : 'translateY(8px)' }}
        >
          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.08), rgba(15,23,42,0.7))', border: '1px solid rgba(20,184,166,0.25)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(20,184,166,0.5), transparent)' }}/>
            <p className="text-sm font-semibold text-teal-400 mb-1">14 accounts generate 71% of your revenue</p>
            <p className="text-sm text-slate-300 leading-relaxed">These are your Champions. Losing one is not a small churn event — it is a material revenue event. Understand what makes them exceptional, catch early warning signs, and ensure your CS motion is protecting them actively.</p>
          </div>

          {D.champions.at_risk > 0 && (
            <div
              className="rounded-2xl p-4 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.07), rgba(15,23,42,0.7))', border: '1px solid rgba(245,158,11,0.25)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)' }}/>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} className="text-amber-400"/>
                <p className="text-sm font-bold text-amber-400">{D.champions.at_risk} Champion accounts showing early warning signals</p>
              </div>
              <div className="space-y-2">
                {D.champions.health_signals.map(signal => (
                  <div key={signal} className="flex items-start gap-2 bg-slate-900/40 rounded-lg p-2.5">
                    <AlertTriangle size={11} className="text-amber-400 flex-shrink-0 mt-0.5"/>
                    <p className="text-xs text-slate-300">{signal}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={DollarSign} label="Avg Champion LTV" value="€74k" sub="vs €20k average" color="teal" animate={contentAnimate} index={0}/>
            <StatCard icon={MessageSquare} label="Avg tickets/mo" value="2.1" sub="low maintenance" color="teal" animate={contentAnimate} index={1}/>
            <StatCard icon={TrendingUp} label="Expansion rate" value="82%" sub="within 6 months" color="green" animate={contentAnimate} index={2}/>
            <StatCard icon={Users} label="Time to value" value="18 days" sub="fast onboarding" color="teal" animate={contentAnimate} index={3}/>
          </div>

          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(20,184,166,0.2)' }}
          >
            <p className="text-xs text-teal-400 font-semibold mb-3 uppercase tracking-wider">What Champions have in common</p>
            <div className="space-y-2">
              {D.champions.shared_traits.map((trait, i) => (
                <div
                  key={trait}
                  className="flex items-start gap-2"
                  style={{
                    opacity: contentAnimate ? 1 : 0,
                    transform: contentAnimate ? 'translateX(0)' : 'translateX(-6px)',
                    transition: `all 0.35s ease ${i * 60}ms`,
                  }}
                >
                  <CheckCircle size={12} className="text-teal-500 flex-shrink-0 mt-0.5"/>
                  <p className="text-xs text-slate-300">{trait}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl p-4"
            style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(71,85,105,0.4)' }}
          >
            <p className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wider">What this means for targeting</p>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">Every prospect SignalOps generates in the Generate tab is matched against these 14 accounts — not your average customer. This is why lookalike quality is fundamentally different from any enrichment tool.</p>
            <button className="text-xs text-teal-400 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View your Champion ICP profile <ArrowRight size={11}/>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
