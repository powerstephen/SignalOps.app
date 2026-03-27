'use client'
import { useState } from 'react'
import { Lock, TrendingUp, AlertTriangle, CheckCircle, Star, Zap, ArrowRight, DollarSign, Users, MessageSquare, BookOpen, Video, FileText } from 'lucide-react'

const DATA = {
  summary: { champions:14, diamonds:10, quickwins:31, drains:45, total:100, champion_revenue_pct:71, drain_cost_pct:48 },
  champions: {
    avg_ltv: 74000, avg_tickets: 2.1, avg_time_to_value: 18, expansion_rate: 82,
    shared_traits: ['VP Sales or RevOps champion from day one','Connected CRM + billing within first week','Attended onboarding call with 3+ team members','Used product daily within first 14 days','Proactively introduced exec sponsor'],
    insight: '14 customers generate 71% of total revenue. They share a consistent pattern: fast time to value, multi-threaded adoption, and a VP-level champion who drove internal buy-in from the start.',
  },
  diamonds: {
    avg_ltv: 61000, avg_tickets: 11.4, avg_time_to_value: 34, expansion_rate: 58,
    ticket_topics: [
      { topic:'Integration setup', pct:42, fix:'Step-by-step integration guides with video walkthroughs' },
      { topic:'Data mapping confusion', pct:31, fix:'Interactive field mapping wizard in onboarding flow' },
      { topic:'Report interpretation', pct:27, fix:'Glossary and tooltip layer on all dashboard metrics' },
    ],
    pathway_insight: 'Diamonds have the revenue profile of Champions but 5x the support cost. The gap is almost entirely driven by onboarding friction — they never got a proper setup. Fix the first 30 days and most Diamonds become Champions.',
    potential_value: '€134k in additional margin if 10 Diamonds move to Champion-level support cost',
  },
  drains: {
    avg_ltv: 9000, avg_tickets: 14.2,
    clusters: [
      { topic:'Onboarding never completed', count:19, pct:42, avg_tickets:18, revenue_impact:'€171k at risk', fix:'Automated onboarding checklist with milestone triggers', fix_type:'checklist', urgency:'High' },
      { topic:'Single contact, no team adoption', count:14, pct:31, avg_tickets:12, revenue_impact:'€126k at risk', fix:'Champion expansion playbook — identify and engage a second stakeholder', fix_type:'playbook', urgency:'High' },
      { topic:'Technical integration issues', count:8, pct:18, avg_tickets:16, revenue_impact:'€72k at risk', fix:'Video explainer series for top 5 integration scenarios', fix_type:'video', urgency:'Medium' },
      { topic:'Feature confusion — reporting', count:4, pct:9, avg_tickets:9, revenue_impact:'€36k at risk', fix:'In-app tooltips and FAQ for reporting module', fix_type:'faq', urgency:'Low' },
    ],
    total_at_risk: '€405k',
    recoverable: 12,
    recovery_value: '€108k',
  },
  quickwins: {
    avg_ltv: 18000, avg_tickets: 2.8, expansion_rate: 22,
    blockers: [
      { blocker:'On Starter plan — missing key features driving expansion', count:18, fix:'Targeted upgrade campaign highlighting Growth features they\'re missing', potential:'€162k ARR if 18 move to Growth plan' },
      { blocker:'Low product usage after month 3', count:9, fix:'Re-engagement sequence triggered at 60-day low usage mark', potential:'€81k ARR at risk of churn' },
      { blocker:'No exec sponsor — champion is junior', count:4, fix:'Executive briefing template for champion to share upward', potential:'€72k ARR if 4 unlock budget approval' },
    ],
    expansion_potential: '€315k additional ARR if top blockers resolved',
  },
}

const FIX_ICON: Record<string, any> = { checklist: CheckCircle, playbook: BookOpen, video: Video, faq: FileText }
const URGENCY_STYLE: Record<string, string> = { High:'bg-red-500/15 text-red-400 border-red-500/30', Medium:'bg-amber-500/15 text-amber-400 border-amber-500/30', Low:'bg-slate-500/15 text-slate-400 border-slate-500/30' }

function StatCard({ icon:Icon, label, value, sub, color='teal' }: any) {
  const c: Record<string,string> = { teal:'text-teal-400', amber:'text-amber-400', red:'text-red-400', indigo:'text-indigo-400', green:'text-green-400', blue:'text-blue-400' }
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2"><Icon size={14} className={c[color]}/><span className="text-xs text-slate-500">{label}</span></div>
      <p className={`text-2xl font-bold ${c[color]} mb-0.5`}>{value}</p>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  )
}

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="flex-1">
        <h3 className="text-base font-bold text-white mb-0.5">{title}</h3>
        <p className="text-xs text-slate-400">{sub}</p>
      </div>
    </div>
  )
}

export default function ProfitMatrix() {
  const [unlocked, setUnlocked] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('overview')
  const D = DATA

  // ── LOCKED STATE ──────────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-white mb-1">Profit Matrix</h2>
          <p className="text-slate-400 text-sm">Understand the true profitability of every customer — and exactly what to do about it.</p>
        </div>

        {/* Teaser stats — partially visible */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Champion customers</p>
            <p className="text-2xl font-bold text-teal-400">14</p>
            <p className="text-xs text-slate-500">of 100 total</p>
          </div>
          <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Revenue from Champions</p>
            <p className="text-2xl font-bold text-teal-400">71%</p>
            <p className="text-xs text-slate-500">of total LTV</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Drain customers</p>
            <p className="text-2xl font-bold text-red-400">45</p>
            <p className="text-xs text-slate-500">net-negative accounts</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Revenue at risk</p>
            <p className="text-2xl font-bold text-red-400">€405k</p>
            <p className="text-xs text-slate-500">from drain accounts</p>
          </div>
        </div>

        {/* Blurred preview */}
        <div className="relative rounded-2xl overflow-hidden mb-6">
          <div className="blur-sm pointer-events-none select-none opacity-40">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[['Champions','High LTV · Low tickets','14','teal'],['Diamonds','High LTV · High tickets','10','amber'],['Quick Wins','Lower LTV · Low tickets','31','blue'],['Drains','Low LTV · High tickets','45','red']].map(([label,desc,count,color])=>(
                <div key={label} className={`border border-${color}-500/40 bg-${color}-500/5 rounded-xl p-4`}>
                  <div className="flex justify-between mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-${color}-500 text-white`}>{label}</span>
                    <span className={`text-lg font-bold text-${color}-400`}>{count}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{desc}</p>
                  <div className="h-2 bg-slate-700 rounded-full"><div className={`h-full bg-${color}-500 rounded-full w-3/4`}/></div>
                </div>
              ))}
            </div>
          </div>

          {/* Unlock overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm rounded-2xl">
            <div className="text-center px-8 py-10 max-w-md">
              <div className="w-16 h-16 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock size={28} className="text-teal-400"/>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Unlock Profit Matrix</h3>
              <p className="text-slate-400 text-sm mb-2">
                45 of your customers are net-negative when support cost is factored in. Profit Matrix shows you exactly who they are, why they're draining your margin, and what to fix first.
              </p>
              <p className="text-teal-400 text-sm font-semibold mb-6">Available on Growth plan · €99/month</p>
              <button onClick={() => setUnlocked(true)}
                className="bg-teal-500 hover:bg-teal-400 text-white font-bold px-8 py-3 rounded-xl transition-colors w-full mb-3">
                Unlock Profit Matrix →
              </button>
              <p className="text-xs text-slate-500">Demo mode — click to preview full analysis</p>
            </div>
          </div>
        </div>

        {/* Feature list */}
        <div className="grid md:grid-cols-2 gap-3">
          {[
            ['Champions deep-dive', 'Understand exactly what makes your 14 best customers tick — and how to find more of them.'],
            ['Diamonds to Champions pathway', 'Identify which high-value customers are one intervention away from becoming your most profitable accounts.'],
            ['Drain diagnosis', 'AI clusters your drain customers by ticket topic and surfaces the 3 fixable problems costing you the most.'],
            ['Quick Wins acceleration', 'Identify the expansion blockers stopping 31 easy-to-serve customers from growing with you.'],
          ].map(([title, desc]) => (
            <div key={title} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 flex items-start gap-3">
              <Lock size={14} className="text-slate-600 flex-shrink-0 mt-0.5"/>
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

  // ── UNLOCKED STATE ────────────────────────────────────────────────────────
  const sections = [
    { id:'overview', label:'Overview' },
    { id:'champions', label:'Champions' },
    { id:'diamonds', label:'Diamonds → Champions' },
    { id:'drains', label:'Drain Diagnosis' },
    { id:'quickwins', label:'Quick Wins' },
  ]

  return (
    <div>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-white">Profit Matrix</h2>
            <span className="text-xs bg-teal-500 text-white px-2 py-0.5 rounded-full font-semibold">Growth</span>
          </div>
          <p className="text-slate-400 text-sm">Full profitability breakdown across all {D.summary.total} customers — with AI-identified fixes.</p>
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

      {/* ── OVERVIEW ── */}
      {activeSection === 'overview' && (
        <div className="space-y-5">
          <div className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-5">
            <p className="text-sm font-semibold text-teal-400 mb-1">The Revenue Reality</p>
            <p className="text-sm text-slate-300 leading-relaxed">
              <span className="text-white font-semibold">14 customers generate 71% of your total revenue</span> — and share a consistent profile. Meanwhile, <span className="text-red-400 font-semibold">45 customers are net-negative</span> when support cost is factored against LTV. This is not unusual for B2B SaaS at this stage — but knowing it is the first step to fixing it.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label:'Champions', desc:'High LTV · Low tickets', count:D.summary.champions, ltv:'€74k avg', tickets:'2.1 avg', color:'teal', action:'Clone these — they are your ICP' },
              { label:'Diamonds', desc:'High LTV · High tickets', count:D.summary.diamonds, ltv:'€61k avg', tickets:'11.4 avg', color:'amber', action:'Fix the friction — they can become Champions' },
              { label:'Quick Wins', desc:'Lower LTV · Low tickets', count:D.summary.quickwins, ltv:'€18k avg', tickets:'2.8 avg', color:'blue', action:'Remove expansion blockers — grow them up' },
              { label:'Drains', desc:'Low LTV · High tickets', count:D.summary.drains, ltv:'€9k avg', tickets:'14.2 avg', color:'red', action:'Diagnose and fix — or stop targeting this profile' },
            ].map(q => {
              const styles: Record<string,{border:string;bg:string;badge:string;text:string}> = {
                teal:  {border:'border-teal-500/40',  bg:'bg-teal-500/5',  badge:'bg-teal-500 text-white',  text:'text-teal-400'},
                amber: {border:'border-amber-500/40', bg:'bg-amber-500/5', badge:'bg-amber-500 text-white', text:'text-amber-400'},
                blue:  {border:'border-blue-500/40',  bg:'bg-blue-500/5',  badge:'bg-blue-500 text-white',  text:'text-blue-400'},
                red:   {border:'border-red-500/40',   bg:'bg-red-500/5',   badge:'bg-red-500 text-white',   text:'text-red-400'},
              }
              const st = styles[q.color]
              return (
                <div key={q.label} className={`border ${st.border} ${st.bg} rounded-xl p-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${st.badge}`}>{q.label}</span>
                    <span className={`text-2xl font-bold ${st.text}`}>{q.count}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{q.desc}</p>
                  <div className="flex gap-3 mb-2">
                    <div><p className="text-xs text-slate-500">Avg LTV</p><p className="text-xs font-semibold text-white">{q.ltv}</p></div>
                    <div><p className="text-xs text-slate-500">Tickets/mo</p><p className="text-xs font-semibold text-white">{q.tickets}</p></div>
                  </div>
                  <p className={`text-xs font-medium ${st.text}`}>→ {q.action}</p>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatCard icon={DollarSign} label="Revenue at risk" value="€405k" sub="from 45 drain accounts" color="red"/>
            <StatCard icon={TrendingUp} label="Recoverable LTV" value="€108k" sub="if top drains fixed" color="amber"/>
            <StatCard icon={Star} label="Diamond opportunity" value="€134k" sub="margin if Diamonds → Champions" color="teal"/>
          </div>
        </div>
      )}

      {/* ── CHAMPIONS ── */}
      {activeSection === 'champions' && (
        <div className="space-y-5">
          <SectionHeader title="Champions — your 14 best customers" sub="High LTV, low support cost, high expansion rate. These are the accounts to clone." />

          <div className="grid grid-cols-4 gap-3">
            <StatCard icon={DollarSign} label="Average LTV" value="€74k" sub="vs €20k average" color="teal"/>
            <StatCard icon={MessageSquare} label="Avg tickets/mo" value="2.1" sub="vs 14.2 for drains" color="teal"/>
            <StatCard icon={TrendingUp} label="Expansion rate" value="82%" sub="expand within 6 months" color="green"/>
            <StatCard icon={Users} label="Time to value" value="18 days" sub="vs 34 days for diamonds" color="teal"/>
          </div>

          <div className="bg-slate-800/40 border border-teal-500/20 rounded-2xl p-5">
            <p className="text-xs text-teal-400 font-semibold mb-3">What Champions have in common</p>
            <div className="space-y-2">
              {D.champions.shared_traits.map(trait => (
                <div key={trait} className="flex items-start gap-2">
                  <CheckCircle size={13} className="text-teal-500 flex-shrink-0 mt-0.5"/>
                  <p className="text-xs text-slate-300">{trait}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-teal-500/5 border border-teal-500/30 rounded-2xl p-5">
            <p className="text-sm text-slate-300 leading-relaxed">{D.champions.insight}</p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-4">
            <p className="text-xs text-slate-400 font-semibold mb-3">What this means for targeting</p>
            <p className="text-xs text-slate-300 mb-3">Your Champion profile is the input for Generate. Every net-new prospect SignalOps surfaces is matched against these 14 accounts — not your average customer. This is why the lookalike quality is fundamentally different from any enrichment tool.</p>
            <button onClick={() => setActiveSection('drains')} className="text-xs text-teal-400 font-semibold hover:underline flex items-center gap-1">
              See what's holding back your other customers <ArrowRight size={12}/>
            </button>
          </div>
        </div>
      )}

      {/* ── DIAMONDS → CHAMPIONS ── */}
      {activeSection === 'diamonds' && (
        <div className="space-y-5">
          <SectionHeader title="Diamonds → Champions pathway" sub="10 customers with Champion-level revenue but 5x the support cost. Fix the friction, unlock the margin." />

          <div className="grid grid-cols-3 gap-3">
            <StatCard icon={DollarSign} label="Diamond avg LTV" value="€61k" sub="nearly Champion level" color="amber"/>
            <StatCard icon={MessageSquare} label="Avg tickets/mo" value="11.4" sub="vs 2.1 for Champions" color="red"/>
            <StatCard icon={Star} label="Margin opportunity" value="€134k" sub="if tickets match Champions" color="teal"/>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/30 rounded-2xl p-4">
            <p className="text-xs text-amber-400 font-semibold mb-2">AI insight</p>
            <p className="text-xs text-slate-300 leading-relaxed">{D.diamonds.pathway_insight}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500 font-semibold mb-3">Top ticket topics across Diamond accounts — and how to fix them</p>
            <div className="space-y-3">
              {D.diamonds.ticket_topics.map((t, i) => (
                <div key={t.topic} className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400 w-4">{i+1}</span>
                      <p className="text-sm font-semibold text-white">{t.topic}</p>
                    </div>
                    <span className="text-xs font-bold text-amber-400 flex-shrink-0">{t.pct}% of tickets</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full mb-3">
                    <div className="h-full bg-amber-500 rounded-full" style={{width:`${t.pct}%`}}/>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap size={12} className="text-teal-400 flex-shrink-0 mt-0.5"/>
                    <p className="text-xs text-teal-400 font-medium">Fix: {t.fix}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/40 border border-teal-500/30 rounded-2xl p-4">
            <p className="text-xs text-slate-500 mb-1">Potential value of fixing Diamond friction</p>
            <p className="text-lg font-bold text-teal-400">{D.diamonds.potential_value}</p>
          </div>
        </div>
      )}

      {/* ── DRAIN DIAGNOSIS ── */}
      {activeSection === 'drains' && (
        <div className="space-y-5">
          <SectionHeader title="Drain diagnosis — 45 net-negative accounts" sub="AI has clustered your drain customers by ticket topic and identified the fixable problems costing you the most." />

          <div className="grid grid-cols-3 gap-3">
            <StatCard icon={AlertTriangle} label="Total at risk" value={D.drains.total_at_risk} sub="from 45 drain accounts" color="red"/>
            <StatCard icon={CheckCircle} label="Recoverable accounts" value={D.drains.recoverable} sub="with targeted intervention" color="amber"/>
            <StatCard icon={DollarSign} label="Recovery value" value={D.drains.recovery_value} sub="if top issue fixed" color="teal"/>
          </div>

          <div className="space-y-3">
            {D.drains.clusters.map((cluster, i) => {
              const FixIcon = FIX_ICON[cluster.fix_type] || Zap
              return (
                <div key={cluster.topic} className="bg-slate-800/40 border border-slate-700 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-red-400">#{i+1}</span>
                        <p className="text-sm font-bold text-white">{cluster.topic}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${URGENCY_STYLE[cluster.urgency]}`}>{cluster.urgency}</span>
                      </div>
                      <p className="text-xs text-slate-400">{cluster.count} accounts · {cluster.pct}% of drains · avg {cluster.avg_tickets} tickets/mo</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-red-400">{cluster.revenue_impact}</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full mb-3">
                    <div className="h-full bg-red-500/60 rounded-full" style={{width:`${cluster.pct}%`}}/>
                  </div>
                  <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-3 flex items-start gap-2">
                    <FixIcon size={13} className="text-teal-400 flex-shrink-0 mt-0.5"/>
                    <div>
                      <p className="text-xs text-teal-400 font-semibold mb-0.5">Recommended fix</p>
                      <p className="text-xs text-slate-300">{cluster.fix}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
            <p className="text-xs text-red-400 font-semibold mb-2">Important</p>
            <p className="text-xs text-slate-300">Fixing these issues does not just recover at-risk revenue — it frees CS capacity currently consumed by drain accounts, allowing your team to focus on Champions and Diamonds. Every hour saved from a drain customer is an hour reinvested in your most profitable accounts.</p>
          </div>
        </div>
      )}

      {/* ── QUICK WINS ── */}
      {activeSection === 'quickwins' && (
        <div className="space-y-5">
          <SectionHeader title="Quick Wins acceleration — 31 accounts" sub="Low LTV but low support cost. Easy to serve, undermonetised. Remove the expansion blockers." />

          <div className="grid grid-cols-3 gap-3">
            <StatCard icon={Users} label="Quick Win accounts" value="31" sub="low ticket, low LTV" color="blue"/>
            <StatCard icon={TrendingUp} label="Expansion rate" value="22%" sub="vs 82% for Champions" color="amber"/>
            <StatCard icon={DollarSign} label="Expansion potential" value="€315k" sub="additional ARR if blockers fixed" color="teal"/>
          </div>

          <div className="space-y-3">
            {D.quickwins.blockers.map((b, i) => (
              <div key={b.blocker} className="bg-slate-800/40 border border-slate-700 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-blue-400">#{i+1}</span>
                      <p className="text-sm font-bold text-white">{b.blocker}</p>
                    </div>
                    <p className="text-xs text-slate-400">{b.count} accounts affected</p>
                  </div>
                  <p className="text-xs font-bold text-teal-400 flex-shrink-0 text-right">{b.potential}</p>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 flex items-start gap-2">
                  <Zap size={13} className="text-blue-400 flex-shrink-0 mt-0.5"/>
                  <div>
                    <p className="text-xs text-blue-400 font-semibold mb-0.5">Recommended action</p>
                    <p className="text-xs text-slate-300">{b.fix}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-teal-500/5 border border-teal-500/30 rounded-2xl p-4">
            <p className="text-xs text-teal-400 font-semibold mb-2">The opportunity</p>
            <p className="text-xs text-slate-300">Quick Win customers are your most efficient growth lever. They already trust you, they already use the product, and their support cost is low. The only thing standing between them and Champion status is a plan, a budget approval, or a feature they don't know exists yet. That's a solvable problem.</p>
          </div>
        </div>
      )}
    </div>
  )
}
