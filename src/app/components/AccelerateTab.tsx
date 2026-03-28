'use client'
import { useState } from 'react'
import { TrendingUp, AlertTriangle, CheckCircle, Zap, BookOpen } from 'lucide-react'

const MOCK_DEALS = [
  { id:'d101', company:'Kairon Growth', contact:'Sophie Laurent', title:'RevOps Lead', stage:'Qualified', deal_value:12800, health_score:28, status:'Stalling', engagement_score:25, commitment_score:22, velocity_score:32, stakeholder_score:38, top_signal:'Rep has sent 11 emails, prospect replied to 2 — ratio has completely inverted', risk_flags:['Email ratio inverted — prospect ghosting','No next meeting in 16 days','No reciprocal commitments made'], next_action:'Stop emailing. Call the champion directly and ask: "Is this still a priority for you?" Get a yes or a no today.', days_in_stage:21, avg_days_won:7 },
  { id:'d102', company:'Flowcast', contact:'Ben Murphy', title:'Head of Sales', stage:'Proposal', deal_value:22100, health_score:32, status:'Stalling', engagement_score:30, commitment_score:28, velocity_score:35, stakeholder_score:44, top_signal:'Champion has not replied in 13 days — deal is orphaned', risk_flags:['Champion silent 13 days','No exec sponsor identified','Contract not opened'], next_action:'Find a second contact at Flowcast immediately — 13 days silence with a proposal out means the champion has lost internal support.', days_in_stage:16, avg_days_won:9 },
  { id:'d103', company:'Bridgeline Tech', contact:'Conor Walsh', title:'VP Sales', stage:'Negotiation', deal_value:18500, health_score:31, status:'Stalling', engagement_score:28, commitment_score:30, velocity_score:29, stakeholder_score:42, top_signal:'Negotiation dragging — 24 days vs 8-day average for won deals at this stage', risk_flags:['Stage velocity 3x over average','Last contact was rep-initiated','No timeline agreed'], next_action:'Send a "go/no-go" email today. Ask for a decision date. Open-ended negotiations at 3x average duration almost never close.', days_in_stage:24, avg_days_won:8 },
  { id:'d104', company:'NorthStar HQ', contact:'Priya Mehta', title:'CRO', stage:'Qualified', deal_value:31000, health_score:26, status:'Stalling', engagement_score:22, commitment_score:18, velocity_score:30, stakeholder_score:35, top_signal:'No next step ever booked — every meeting ends without a follow-up scheduled', risk_flags:['No next step pattern across 4 meetings','CRO disengaging','No data connected'], next_action:'Do not book another call without getting a defined outcome from this one. Ask the CRO directly what would make them confident to move forward.', days_in_stage:19, avg_days_won:7 },
  { id:'d105', company:'Clearpath SaaS', contact:'James O\'Brien', title:'Head of RevOps', stage:'Proposal', deal_value:14200, health_score:33, status:'Stalling', engagement_score:32, commitment_score:25, velocity_score:38, stakeholder_score:40, top_signal:'Proposal opened once, 9 days ago, not reopened', risk_flags:['Proposal not re-opened in 9 days','No questions asked about proposal','Single contact'], next_action:'Call to walk through the proposal live — static proposals stall. A live walkthrough gets questions answered and re-establishes momentum.', days_in_stage:14, avg_days_won:9 },
  { id:'d106', company:'Vantage Labs', contact:'Alex Kim', title:'VP Revenue', stage:'Qualified', deal_value:9800, health_score:29, status:'Stalling', engagement_score:24, commitment_score:20, velocity_score:33, stakeholder_score:42, top_signal:'Champion went on leave — no handover contact provided', risk_flags:['Champion unavailable','No backup contact','Deal paused informally'], next_action:'Contact the company via LinkedIn to identify who is covering. Do not wait for the champion to return — deals that pause at this stage rarely restart.', days_in_stage:17, avg_days_won:7 },
  { id:'d201', company:'Stackline', contact:'Olivia Chen', title:'VP Revenue', stage:'Proposal', deal_value:28400, health_score:52, status:'At Risk', engagement_score:50, commitment_score:48, velocity_score:55, stakeholder_score:60, top_signal:'Proposal sent 9 days ago with no substantive response', risk_flags:['9 days since last prospect reply','No next meeting scheduled','Single contact engaged'], next_action:'Call today — do not send another email. 9 days silence at proposal stage is a serious stall signal that email will not fix.', days_in_stage:12, avg_days_won:9 },
  { id:'d202', company:'Metric Labs', contact:'Tom Eriksson', title:'Head of Sales', stage:'Negotiation', deal_value:15600, health_score:48, status:'At Risk', engagement_score:44, commitment_score:55, velocity_score:40, stakeholder_score:52, top_signal:'Deal in negotiation for 19 days vs 8-day average for won deals', risk_flags:['Stage velocity 2.4x over average','Champion engagement declining','No trial data connected'], next_action:'Get a clear written decision timeline from the champion this week. Verbal commitments at this stage are not enough.', days_in_stage:19, avg_days_won:8 },
  { id:'d203', company:'Redshift Analytics', contact:'Diana Park', title:'Director of Sales Ops', stage:'Proposal', deal_value:19800, health_score:54, status:'At Risk', engagement_score:52, commitment_score:45, velocity_score:58, stakeholder_score:62, top_signal:'Decision maker not engaged — champion is below budget authority', risk_flags:['No exec sponsor','Champion cannot approve budget','Competitor mentioned in last call'], next_action:'Ask the champion to arrange an intro to the budget holder this week. Without exec visibility, this deal will stall at legal or procurement.', days_in_stage:8, avg_days_won:9 },
  { id:'d204', company:'Lumino SaaS', contact:'Ryan Clarke', title:'Head of Growth', stage:'Qualified', deal_value:11400, health_score:56, status:'At Risk', engagement_score:58, commitment_score:42, velocity_score:60, stakeholder_score:55, top_signal:'Strong verbal interest but zero reciprocal commitments — no trial, no data connected', risk_flags:['No reciprocal commitments in 3 meetings','Verbal interest not converting to action','Single stakeholder'], next_action:'Ask for a specific commitment in the next meeting — even something small like connecting one data source. Action separates real deals from endless conversations.', days_in_stage:11, avg_days_won:7 },
  { id:'d205', company:'Aperture Growth', contact:'Niamh Doyle', title:'VP Sales', stage:'Negotiation', deal_value:24600, health_score:51, status:'At Risk', engagement_score:48, commitment_score:60, velocity_score:44, stakeholder_score:54, top_signal:'Legal review requested 12 days ago — no update since', risk_flags:['Legal review stalled','No timeline for legal sign-off','Champion not escalating internally'], next_action:'Ask champion to set a specific legal review deadline and escalate internally if needed. Deals that enter legal without a timeline regularly die there.', days_in_stage:15, avg_days_won:8 },
  { id:'d206', company:'Tidewave HQ', contact:'Michael Torres', title:'CRO', stage:'Proposal', deal_value:33200, health_score:55, status:'At Risk', engagement_score:55, commitment_score:50, velocity_score:52, stakeholder_score:65, top_signal:'Multi-threaded but engagement dropping across all contacts simultaneously', risk_flags:['Engagement declining across all contacts','No meeting booked','Budget review mentioned'], next_action:'Request a group check-in call with all three contacts this week. Simultaneous disengagement across contacts usually signals an internal budget decision is underway.', days_in_stage:10, avg_days_won:9 },
  { id:'d207', company:'Foundry AI', contact:'Lisa Brennan', title:'Head of RevOps', stage:'Qualified', deal_value:16800, health_score:53, status:'At Risk', engagement_score:56, commitment_score:44, velocity_score:57, stakeholder_score:58, top_signal:'Champion requested a "pause" pending internal restructure announcement', risk_flags:['Deal formally paused','Internal restructure underway','Champion role may change'], next_action:'Send a brief note acknowledging the pause and ask for a specific date to reconnect. Keep the relationship warm without being pushy.', days_in_stage:13, avg_days_won:7 },
  { id:'d301', company:'Pipefy', contact:'Marcus Webb', title:'CRO', stage:'Proposal', deal_value:34200, health_score:76, status:'On Track', engagement_score:80, commitment_score:72, velocity_score:75, stakeholder_score:85, top_signal:'3 contacts from prospect side engaged — multi-threaded deals close at 2x rate', risk_flags:['No next meeting booked'], next_action:'Book a follow-up call before end of week — no next meeting is a yellow flag at proposal stage even with good engagement.', days_in_stage:6, avg_days_won:9 },
  { id:'d302', company:'Growthline', contact:'James Thornton', title:'VP Revenue', stage:'Qualified', deal_value:18900, health_score:72, status:'On Track', engagement_score:74, commitment_score:65, velocity_score:75, stakeholder_score:70, top_signal:'Champion actively driving internal process — sharing materials with exec team', risk_flags:[], next_action:'Request an exec sponsor introduction this week — deals with exec visibility close 40% faster.', days_in_stage:4, avg_days_won:7 },
  { id:'d303', company:'Quantum Scale', contact:'Fiona McCarthy', title:'VP Sales', stage:'Negotiation', deal_value:29700, health_score:74, status:'On Track', engagement_score:76, commitment_score:78, velocity_score:70, stakeholder_score:72, top_signal:'Trial completed successfully — champion presenting internal business case this week', risk_flags:[], next_action:'Offer to join the internal presentation as a subject matter expert. Vendors who participate in internal reviews close at significantly higher rates.', days_in_stage:7, avg_days_won:8 },
  { id:'d304', company:'Nexus Revenue', contact:'David Chang', title:'RevOps Director', stage:'Proposal', deal_value:22400, health_score:71, status:'On Track', engagement_score:72, commitment_score:68, velocity_score:74, stakeholder_score:70, top_signal:'Proposal reviewed within 2 hours of sending — strong interest signal', risk_flags:['One week without follow-up from prospect'], next_action:'Send a light follow-up today — proposal reviewed same day is a strong signal. Check if they have questions before momentum cools.', days_in_stage:5, avg_days_won:9 },
  { id:'d305', company:'Orbit SaaS', contact:'Emma Sullivan', title:'Head of Sales', stage:'Qualified', deal_value:13600, health_score:73, status:'On Track', engagement_score:75, commitment_score:62, velocity_score:78, stakeholder_score:78, top_signal:'Connected CRM data in first meeting — high commitment signal', risk_flags:[], next_action:'Move to proposal this week — data connection in the first meeting is your strongest commitment signal. Strike while intent is high.', days_in_stage:3, avg_days_won:7 },
  { id:'d401', company:'Revcast', contact:'Sarah Chen', title:'VP Sales', stage:'Negotiation', deal_value:21600, health_score:91, status:'Accelerating', engagement_score:94, commitment_score:90, velocity_score:88, stakeholder_score:85, top_signal:'Prospect replying faster than rep is sending — peak buying intent signal', risk_flags:[], next_action:'Send contract today — engagement is at absolute peak. Every day you wait, close probability drops. Do not overthink this.', days_in_stage:9, avg_days_won:12 },
  { id:'d402', company:'Salespath AI', contact:'Declan Murray', title:'VP Sales', stage:'Negotiation', deal_value:38400, health_score:88, status:'Accelerating', engagement_score:90, commitment_score:86, velocity_score:85, stakeholder_score:92, top_signal:'4 stakeholders from prospect side now engaged — exec sponsor introduced last week', risk_flags:[], next_action:'Accelerate contract process — multi-threaded at this level with exec visibility is your clearest close signal. Get legal involved now.', days_in_stage:8, avg_days_won:12 },
  { id:'d403', company:'Stageflow', contact:'Niamh Carroll', title:'VP Sales', stage:'Proposal', deal_value:26800, health_score:85, status:'Accelerating', engagement_score:88, commitment_score:82, velocity_score:84, stakeholder_score:86, top_signal:'Champion pushed for faster timeline — asking to move to contract before Q2', risk_flags:[], next_action:'Match their urgency — send contract draft today and offer expedited legal review. When a champion pulls the timeline forward, act immediately.', days_in_stage:5, avg_days_won:9 },
  { id:'d404', company:'Workstream', contact:'Patrick O\'Brien', title:'Head of RevOps', stage:'Negotiation', deal_value:31200, health_score:87, status:'Accelerating', engagement_score:89, commitment_score:88, velocity_score:83, stakeholder_score:88, top_signal:'Trial extended voluntarily — team actively using product daily', risk_flags:[], next_action:'Propose contract now while product value is being felt daily. Voluntary trial extension with daily usage is your strongest close signal.', days_in_stage:7, avg_days_won:12 },
  { id:'d405', company:'PipeIQ', contact:'Elena Vasquez', title:'CRO', stage:'Proposal', deal_value:42100, health_score:89, status:'Accelerating', engagement_score:92, commitment_score:85, velocity_score:88, stakeholder_score:90, top_signal:'CRO personally reviewing proposal — unusual level of exec engagement for this stage', risk_flags:[], next_action:'Arrange a direct call with the CRO this week — exec engagement at proposal stage is rare. Use it to personalise the ROI case directly to their priorities.', days_in_stage:4, avg_days_won:9 },
  { id:'d406', company:'Revelo', contact:'James Thornton', title:'VP Sales', stage:'Negotiation', deal_value:18900, health_score:84, status:'Accelerating', engagement_score:86, commitment_score:84, velocity_score:82, stakeholder_score:84, top_signal:'Legal review completed in 3 days — internal champion driving urgency', risk_flags:[], next_action:'Move to final pricing discussion immediately. Legal completing in 3 days with champion urgency means they are fully committed. Close this week.', days_in_stage:6, avg_days_won:12 },
  { id:'d407', company:'Quota Labs', contact:'Anna Fischer', title:'VP Sales', stage:'Proposal', deal_value:22300, health_score:83, status:'Accelerating', engagement_score:85, commitment_score:80, velocity_score:84, stakeholder_score:82, top_signal:'Champion sent unsolicited ROI calculation to internal team — self-selling', risk_flags:[], next_action:'Send supporting ROI data to strengthen the internal case — when a champion self-sells, arm them with everything they need to win internally.', days_in_stage:5, avg_days_won:9 },
]

const STATUS_STYLES: Record<string,{border:string;bg:string;badge:string;text:string;icon:any}> = {
  'Stalling':     {border:'border-red-500/40',   bg:'bg-red-500/5',   badge:'bg-red-500 text-white',   text:'text-red-400',   icon:AlertTriangle},
  'At Risk':      {border:'border-amber-500/40', bg:'bg-amber-500/5', badge:'bg-amber-500 text-white', text:'text-amber-400', icon:AlertTriangle},
  'On Track':     {border:'border-blue-500/40',  bg:'bg-blue-500/5',  badge:'bg-blue-500 text-white',  text:'text-blue-400',  icon:CheckCircle},
  'Accelerating': {border:'border-teal-500/40',  bg:'bg-teal-500/5',  badge:'bg-teal-500 text-white',  text:'text-teal-400',  icon:TrendingUp},
}

function ScoreBar({label,score}:{label:string;score:number}) {
  const color = score>=80?'bg-teal-500':score>=60?'bg-blue-500':score>=40?'bg-amber-500':'bg-red-500'
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-500">{label}</span>
        <span className="text-xs font-semibold text-white">{score}</span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{width:`${score}%`}}/>
      </div>
    </div>
  )
}

export default function AccelerateTab() {
  const [loading, setLoading] = useState(false)
  const [deals, setDeals] = useState<typeof MOCK_DEALS|null>(null)
  const [openPlaybook, setOpenPlaybook] = useState<string|null>(null)
  const [activeFilter, setActiveFilter] = useState<string|null>(null)

  function handleScore() {
    setLoading(true)
    setTimeout(() => { setDeals(MOCK_DEALS); setLoading(false) }, 2200)
  }

  const statusOrder: Record<string,number> = {'Stalling':0,'At Risk':1,'On Track':2,'Accelerating':3}
  const sorted = deals ? [...deals].sort((a,b) => statusOrder[a.status]-statusOrder[b.status]) : []
  const filtered = activeFilter ? sorted.filter(d => d.status===activeFilter) : sorted

  const totalValue = deals ? deals.reduce((s,d) => s+d.deal_value, 0) : 0
  const atRiskValue = deals ? deals.filter(d => d.status==='Stalling'||d.status==='At Risk').reduce((s,d) => s+d.deal_value, 0) : 0

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-white mb-1">Ignite — live pipeline intelligence</h2>
        <p className="text-slate-400 text-sm">Score every active deal across six health dimensions — then surface exactly what to do next.</p>
      </div>

      {!deals ? (
        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-10 text-center">
          <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={28} className="text-teal-500"/>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Score your live pipeline</h3>
          <p className="text-slate-400 text-sm max-w-lg mx-auto mb-2">SignalOps analyses every active deal across six health dimensions — engagement, stakeholder breadth, commitment depth, stage velocity, meeting momentum, and champion signal.</p>
          <p className="text-slate-500 text-xs max-w-md mx-auto mb-6 italic">Every deal follows a pattern. When it deviates, that&apos;s your signal.</p>
          <button onClick={handleScore} disabled={loading}
            className="bg-teal-500 hover:bg-teal-400 disabled:opacity-70 text-white font-semibold px-8 py-3 rounded-xl transition-colors inline-flex items-center gap-2">
            {loading
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Scoring pipeline...</>
              : <><TrendingUp size={16}/>Score live pipeline →</>}
          </button>
        </div>
      ) : (
        <div>
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Total pipeline value</p>
              <p className="text-2xl font-bold text-white">€{(totalValue/1000).toFixed(0)}k</p>
              <p className="text-xs text-slate-500">{deals.length} active deals</p>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">At risk or stalling</p>
              <p className="text-2xl font-bold text-red-400">€{(atRiskValue/1000).toFixed(0)}k</p>
              <p className="text-xs text-slate-500">{deals.filter(d=>d.status==='Stalling'||d.status==='At Risk').length} deals need action now</p>
            </div>
            <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Accelerating</p>
              <p className="text-2xl font-bold text-teal-400">{deals.filter(d=>d.status==='Accelerating').length} deals</p>
              <p className="text-xs text-slate-500">€{(deals.filter(d=>d.status==='Accelerating').reduce((s,d)=>s+d.deal_value,0)/1000).toFixed(0)}k in strong position</p>
            </div>
          </div>

          {/* Filter cards */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {(['Stalling','At Risk','On Track','Accelerating'] as const).map(s => {
              const count = deals.filter(d => d.status===s).length
              const st = STATUS_STYLES[s]
              const Icon = st.icon
              const isActive = activeFilter===s
              return (
                <button key={s} onClick={() => setActiveFilter(activeFilter===s ? null : s)}
                  className={`border ${st.border} ${st.bg} rounded-xl p-3 text-left transition-all ${isActive?'ring-2 ring-offset-1 ring-offset-[#0F172A] scale-105 shadow-lg':'hover:shadow-md'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5"><Icon size={13} className={st.text}/><span className="text-xs text-slate-400">{s}</span></div>
                    {isActive && <span className="text-xs text-slate-500">✕</span>}
                  </div>
                  <p className={`text-2xl font-bold ${st.text}`}>{count}</p>
                  <p className="text-xs text-slate-500">{isActive?'click to clear':'click to filter'}</p>
                </button>
              )
            })}
          </div>

          {activeFilter && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-slate-400">Showing</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[activeFilter].badge}`}>{activeFilter}</span>
              <span className="text-xs text-slate-400">deals only</span>
              <button onClick={() => setActiveFilter(null)} className="text-xs text-slate-500 hover:text-white underline ml-1">Clear filter</button>
            </div>
          )}

          {/* Deal list */}
          <div className="space-y-3">
            {filtered.map(deal => {
              const st = STATUS_STYLES[deal.status]
              const Icon = st.icon
              const isOpen = openPlaybook === deal.id
              const isPositive = deal.status==='Accelerating'||deal.status==='On Track'

              return (
                <div key={deal.id} className={`border ${st.border} ${st.bg} rounded-2xl overflow-hidden`}>
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-white">{deal.company}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${st.badge}`}>{deal.status}</span>
                          <span className="text-xs text-slate-500">{deal.stage}</span>
                        </div>
                        <p className="text-xs text-slate-400 mb-2">{deal.contact} · {deal.title} · Day {deal.days_in_stage} of ~{deal.avg_days_won} avg · €{deal.deal_value.toLocaleString()}</p>
                        <p className="text-xs text-slate-400 italic">{deal.top_signal}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-2xl font-bold ${st.text}`}>{deal.health_score}</p>
                        <p className="text-xs text-slate-500">health</p>
                      </div>
                    </div>

                    {deal.risk_flags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {deal.risk_flags.map(f => (
                          <span key={f} className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertTriangle size={10}/>{f}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Next action + Open Playbook button — matches Recover pattern */}
                    <div className={`mt-3 p-3 rounded-xl border flex items-center justify-between gap-3 ${isPositive ? 'bg-teal-500/5 border-teal-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <Zap size={13} className={`${st.text} flex-shrink-0 mt-0.5`}/>
                          <div>
                            <p className={`text-xs font-semibold ${st.text} mb-0.5`}>Next action</p>
                            <p className="text-xs text-slate-300">{deal.next_action}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setOpenPlaybook(isOpen ? null : deal.id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex-shrink-0 ${
                          isOpen
                            ? 'bg-teal-500 text-white'
                            : 'bg-teal-500/10 text-teal-400 border border-teal-500/30 hover:bg-teal-500/20'
                        }`}
                      >
                        <BookOpen size={12}/>
                        {isOpen ? 'Close' : 'Open playbook'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded playbook — health breakdown */}
                  {isOpen && (
                    <div className="border-t border-slate-700/50 p-4">
                      <p className="text-xs text-slate-500 font-semibold mb-3">Health breakdown</p>
                      <div className="grid grid-cols-2 gap-3">
                        <ScoreBar label="Engagement velocity" score={deal.engagement_score}/>
                        <ScoreBar label="Stakeholder breadth" score={deal.stakeholder_score}/>
                        <ScoreBar label="Commitment depth" score={deal.commitment_score}/>
                        <ScoreBar label="Stage velocity" score={deal.velocity_score}/>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
