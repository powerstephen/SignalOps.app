'use client'
import { useState } from 'react'
import { Lock, TrendingUp, AlertTriangle, CheckCircle, Star, Zap, ArrowRight, DollarSign, Users, MessageSquare, BookOpen, Video, FileText, ChevronRight } from 'lucide-react'

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

function StatCard({ icon:Icon, label, value, sub, color='teal' }: any) {
  const c: Record<string,string> = { teal:'text-teal-400', amber:'text-amber-400', red:'text-red-400', indigo:'text-indigo-400', green:'text-green-400', blue:'text-blue-400', slate:'text-slate-400' }
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2"><Icon size={14} className={c[color]}/><span className="text-xs text-slate-500">{label}</span></div>
      <p className={`text-2xl font-bold ${c[color]} mb-0.5`}>{value}</p>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  )
}

export default function ProfitMatrix() {
  const [unlocked, setUnlocked] = useState(false)
  const [activeSection, setActiveSection] = useState('snapshot')
  const [expandedFix, setExpandedFix] = useState<string|null>(null)
  const [expandedLeak, setExpandedLeak] = useState<string|null>(null)
  const D = DATA

  // ── LOCKED ───────────────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-white mb-1">Profit Matrix</h2>
          <p className="text-slate-400 text-sm">Understand where your revenue is leaking — and exactly what to do about it.</p>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label:'Champion customers', value:'14', sub:'generate 71% of revenue', color:'border-teal-500/20 bg-teal-500/5', text:'text-teal-400' },
            { label:'Revenue concentration', value:'71%', sub:'from top 14 accounts', color:'border-teal-500/20 bg-teal-500/5', text:'text-teal-400' },
            { label:'Net-negative accounts', value:'45', sub:'costing more than they generate', color:'border-red-500/20 bg-red-500/5', text:'text-red-400' },
            { label:'Revenue at risk', value:'€405k', sub:'from drain accounts', color:'border-red-500/20 bg-red-500/5', text:'text-red-400' },
          ].map(s => (
            <div key={s.label} className={`border ${s.color} rounded-xl p-4`}>
              <p className="text-xs text-slate-500 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
              <p className="text-xs text-slate-500">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="relative rounded-2xl overflow-hidden mb-6">
          {/* Blurred preview */}
          <div className="blur-sm pointer-events-none select-none opacity-35 p-5 bg-slate-800/40 border border-slate-700 rounded-2xl space-y-3">
            {['Fix onboarding for 19 drain accounts — €171k at risk','Reduce integration friction for 10 Diamonds — €134k in recoverable margin','Upgrade campaign for 18 Quick Win accounts — €162k additional ARR'].map((a,i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-900/60 rounded-xl p-3">
                <span className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{i+1}</span>
                <p className="text-sm text-slate-300">{a}</p>
              </div>
            ))}
          </div>
          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm rounded-2xl">
            <div className="text-center px-8 py-8 max-w-md">
              <div className="w-14 h-14 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock size={26} className="text-teal-400"/>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Unlock Profit Matrix</h3>
              <p className="text-slate-400 text-sm mb-2">See exactly where your revenue is leaking, which customers are worth fixing, and the specific actions that will have the biggest impact on your margin.</p>
              <p className="text-teal-400 text-sm font-semibold mb-5">Available on Growth plan · €99/month</p>
              <button onClick={() => setUnlocked(true)} className="bg-teal-500 hover:bg-teal-400 text-white font-bold px-8 py-3 rounded-xl transition-colors w-full mb-2">
                Unlock Profit Matrix →
              </button>
              <p className="text-xs text-slate-500">Demo mode — click to preview</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {[
            ['Revenue Snapshot', 'Your full profitability picture — where revenue is concentrated, what\'s at risk, and the three actions with the biggest impact.'],
            ['Where is revenue leaking?', 'Every account that\'s costing more than it generates, ranked by impact, with specific fixes attached.'],
            ['What can we fix?', 'The highest-value interventions across Diamonds and Quick Wins — with effort ratings, owners, and step-by-step action plans.'],
            ['Who to protect', 'Your 14 Champion accounts — what makes them tick, early warning signals, and what to do if any show signs of risk.'],
          ].map(([title, desc]) => (
            <div key={title} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 flex items-start gap-3">
              <Lock size={13} className="text-slate-600 flex-shrink-0 mt-0.5"/>
              <div>
                <p className="text-sm font-semibold text-slate-300 mb-0.5">{title}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── UNLOCKED ─────────────────────────────────────────────────────────────
  const sections = [
    { id:'snapshot', label:'Revenue Snapshot' },
    { id:'leaks',    label:'Where is revenue leaking?' },
    { id:'fixes',    label:'What can we fix?' },
    { id:'protect',  label:'Who to protect' },
  ]

  return (
    <div>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-white">Profit Matrix</h2>
            <span className="text-xs bg-teal-500 text-white px-2 py-0.5 rounded-full font-semibold">Growth</span>
          </div>
          <p className="text-slate-400 text-sm">Full profitability breakdown — with AI-identified actions ranked by revenue impact.</p>
        </div>
      </div>

      {/* Section nav */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${activeSection===s.id ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ── REVENUE SNAPSHOT ── */}
      {activeSection === 'snapshot' && (
        <div className="space-y-5">
          {/* Top 3 actions */}
          <div className="bg-slate-800/40 border border-teal-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={15} className="text-teal-400"/>
              <p className="text-sm font-bold text-white">Your top 3 actions right now</p>
              <span className="text-xs text-slate-500 ml-auto">Ranked by revenue impact</span>
            </div>
            <div className="space-y-3">
              {D.top_actions.map(a => (
                <div key={a.rank} className="flex items-center gap-3 bg-slate-900/60 rounded-xl p-3">
                  <span className="w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{a.rank}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{a.action}</p>
                    <p className="text-xs text-slate-500">{a.detail}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.urgency==='high'?'bg-red-500/15 text-red-400':'bg-amber-500/15 text-amber-400'}`}>{a.value}</span>
                    <span className="text-xs text-slate-500 hidden md:block">{a.owner}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={Star} label="Champion accounts" value="14" sub="generate 71% of revenue" color="teal"/>
            <StatCard icon={DollarSign} label="Revenue at risk" value="€405k" sub="from 45 drain accounts" color="red"/>
            <StatCard icon={TrendingUp} label="Recoverable margin" value="€134k" sub="if Diamonds fixed" color="amber"/>
            <StatCard icon={Zap} label="Expansion potential" value="€315k" sub="from Quick Wins" color="blue"/>
          </div>

          {/* Matrix overview */}
          <div>
            <p className="text-xs text-slate-500 mb-3">Full profitability breakdown — click a section to go deeper</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label:'Champions', desc:'High LTV · Low support cost', count:14, ltv:'€74k avg', tickets:'2.1/mo', color:'teal', badge:'bg-teal-500 text-white', border:'border-teal-500/30', bg:'bg-teal-500/5', text:'text-teal-400', insight:'Your best customers. Clone them via Generate.', section:'protect' },
                { label:'Diamonds', desc:'High LTV · High support cost', count:10, ltv:'€61k avg', tickets:'11.4/mo', color:'amber', badge:'bg-amber-500 text-white', border:'border-amber-500/30', bg:'bg-amber-500/5', text:'text-amber-400', insight:'One intervention away from Champion status.', section:'fixes' },
                { label:'Quick Wins', desc:'Lower LTV · Low support cost', count:31, ltv:'€18k avg', tickets:'2.8/mo', color:'blue', badge:'bg-blue-500 text-white', border:'border-blue-500/30', bg:'bg-blue-500/5', text:'text-blue-400', insight:'Easy to serve — remove the expansion blockers.', section:'fixes' },
                { label:'Drains', desc:'Low LTV · High support cost', count:45, ltv:'€9k avg', tickets:'14.2/mo', color:'red', badge:'bg-red-500 text-white', border:'border-red-500/30', bg:'bg-red-500/5', text:'text-red-400', insight:'€405k at risk. Fix the pattern or stop targeting this profile.', section:'leaks' },
              ].map(q => (
                <button key={q.label} onClick={() => setActiveSection(q.section)}
                  className={`border ${q.border} ${q.bg} rounded-xl p-4 text-left hover:ring-1 hover:ring-current transition-all`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${q.badge}`}>{q.label}</span>
                    <span className={`text-2xl font-bold ${q.text}`}>{q.count}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{q.desc}</p>
                  <div className="flex gap-4 mb-2">
                    <div><p className="text-xs text-slate-500">Avg LTV</p><p className="text-xs font-semibold text-white">{q.ltv}</p></div>
                    <div><p className="text-xs text-slate-500">Tickets/mo</p><p className="text-xs font-semibold text-white">{q.tickets}</p></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className={`text-xs font-medium ${q.text}`}>→ {q.insight}</p>
                    <ChevronRight size={11} className={q.text}/>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── WHERE IS REVENUE LEAKING ── */}
      {activeSection === 'leaks' && (
        <div className="space-y-4">
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle size={15} className="text-red-400 flex-shrink-0 mt-0.5"/>
            <p className="text-sm text-slate-300"><span className="text-white font-semibold">€486k total revenue at risk</span> across 54 accounts. Below are every leak ranked by impact — each with a specific fix, an owner, and an estimated recovery value.</p>
          </div>

          <div className="space-y-3">
            {D.leaks.map((leak, i) => {
              const FixIcon = FIX_ICON[leak.fix_type] || Zap
              const isExpanded = expandedLeak === leak.id
              return (
                <div key={leak.id} className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden">
                  <button className="w-full p-4 text-left" onClick={() => setExpandedLeak(isExpanded ? null : leak.id)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-slate-400 flex-shrink-0 mt-0.5">{i+1}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="text-sm font-bold text-white">{leak.title}</p>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${URGENCY_STYLE[leak.urgency]}`}>{leak.urgency}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${leak.type==='drain'?'bg-red-500/10 text-red-400':'bg-amber-500/10 text-amber-400'}`}>{leak.type==='drain'?'Drain':'Quick Win at risk'}</span>
                          </div>
                          <p className="text-xs text-slate-400">{leak.count} accounts · avg {leak.avg_tickets} tickets/mo · Owner: {leak.owner}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <p className="text-sm font-bold text-red-400">{leak.revenue_impact}</p>
                        <ChevronRight size={14} className={`text-slate-500 transition-transform ${isExpanded?'rotate-90':''}`}/>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-700/50 p-4">
                      <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-3 flex items-start gap-2">
                        <FixIcon size={13} className="text-teal-400 flex-shrink-0 mt-0.5"/>
                        <div>
                          <p className="text-xs text-teal-400 font-semibold mb-1">{leak.fix}</p>
                          <p className="text-xs text-slate-300">{leak.fix_detail}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── WHAT CAN WE FIX ── */}
      {activeSection === 'fixes' && (
        <div className="space-y-4">
          <div className="bg-teal-500/5 border border-teal-500/20 rounded-2xl p-4">
            <p className="text-sm text-slate-300"><span className="text-teal-400 font-semibold">€457k in recoverable value</span> across 4 targeted interventions. Each fix has a clear owner, effort rating, and step-by-step action plan.</p>
          </div>

          <div className="space-y-3">
            {D.fixes.map(fix => {
              const isExpanded = expandedFix === fix.id
              return (
                <div key={fix.id} className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden">
                  <button className="w-full p-4 text-left" onClick={() => setExpandedFix(isExpanded ? null : fix.id)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="text-sm font-bold text-white">{fix.title}</p>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${SEGMENT_STYLE[fix.segment]}`}>{fix.segment}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${EFFORT_STYLE[fix.effort]}`}>{fix.effort} effort</span>
                        </div>
                        <p className="text-xs text-slate-400">{fix.accounts} accounts · Tickets: {fix.current_cost} → {fix.after_cost}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <p className="text-sm font-bold text-teal-400">{fix.value}</p>
                        <ChevronRight size={14} className={`text-slate-500 transition-transform ${isExpanded?'rotate-90':''}`}/>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-700/50 p-4">
                      <p className="text-xs text-slate-500 font-semibold mb-3">Step-by-step action plan</p>
                      <div className="space-y-2">
                        {fix.actions.map((action, i) => (
                          <div key={i} className="flex items-start gap-3 bg-slate-900/50 rounded-lg p-3">
                            <span className="w-5 h-5 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 text-xs font-bold flex-shrink-0 mt-0.5">{i+1}</span>
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
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── WHO TO PROTECT ── */}
      {activeSection === 'protect' && (
        <div className="space-y-5">
          <div className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-5">
            <p className="text-sm font-semibold text-teal-400 mb-1">14 accounts generate 71% of your revenue</p>
            <p className="text-sm text-slate-300 leading-relaxed">These are your Champions. Losing one is not a small churn event — it is a material revenue event. The goal here is to understand what makes them exceptional, catch any early warning signs, and ensure your CS motion is protecting them actively.</p>
          </div>

          {D.champions.at_risk > 0 && (
            <div className="bg-amber-500/5 border border-amber-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} className="text-amber-400"/>
                <p className="text-sm font-bold text-amber-400">{D.champions.at_risk} Champion accounts showing early warning signals</p>
              </div>
              <div className="space-y-2">
                {D.champions.health_signals.map(signal => (
                  <div key={signal} className="flex items-start gap-2">
                    <AlertTriangle size={11} className="text-amber-400 flex-shrink-0 mt-0.5"/>
                    <p className="text-xs text-slate-300">{signal}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={DollarSign} label="Avg Champion LTV" value="€74k" sub="vs €20k average" color="teal"/>
            <StatCard icon={MessageSquare} label="Avg tickets/mo" value="2.1" sub="low maintenance" color="teal"/>
            <StatCard icon={TrendingUp} label="Expansion rate" value="82%" sub="within 6 months" color="green"/>
            <StatCard icon={Users} label="Time to value" value="18 days" sub="fast onboarding" color="teal"/>
          </div>

          <div className="bg-slate-800/40 border border-teal-500/20 rounded-2xl p-5">
            <p className="text-xs text-teal-400 font-semibold mb-3">What Champions have in common</p>
            <div className="space-y-2">
              {D.champions.shared_traits.map(trait => (
                <div key={trait} className="flex items-start gap-2">
                  <CheckCircle size={12} className="text-teal-500 flex-shrink-0 mt-0.5"/>
                  <p className="text-xs text-slate-300">{trait}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-4">
            <p className="text-xs text-slate-500 font-semibold mb-2">What this means for targeting</p>
            <p className="text-xs text-slate-300 mb-3">Every prospect SignalOps generates in the Generate tab is matched against these 14 accounts — not your average customer. This is why lookalike quality is fundamentally different from any enrichment tool.</p>
            <button className="text-xs text-teal-400 font-semibold flex items-center gap-1 hover:underline">
              View your Champion ICP profile <ArrowRight size={11}/>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
