'use client'
import { useState } from 'react'
import { TrendingUp, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Zap } from 'lucide-react'

const MOCK_DEALS = [
  { id:'d001', company:'Revcast', contact:'Sarah Chen', title:'VP Sales', stage:'Negotiation', deal_value:21600, health_score:87, status:'Accelerating', engagement_score:92, commitment_score:88, velocity_score:85, stakeholder_score:80, top_signal:'Prospect replying faster than rep is sending — peak buying intent signal', risk_flags:[], next_action:'Send contract today — engagement is at peak. Every day you wait, close probability drops.', days_in_stage:9, avg_days_won:12 },
  { id:'d002', company:'Pipefy', contact:'Marcus Webb', title:'CRO', stage:'Proposal', deal_value:34200, health_score:82, status:'On Track', engagement_score:85, commitment_score:78, velocity_score:80, stakeholder_score:90, top_signal:'3 contacts from prospect side engaged — multi-threaded deals close at 2x rate', risk_flags:['No next meeting booked'], next_action:'Book a follow-up call before end of week — no next meeting is a yellow flag at proposal stage.', days_in_stage:6, avg_days_won:9 },
  { id:'d003', company:'Growthline', contact:'James Thornton', title:'VP Revenue', stage:'Qualified', deal_value:18900, health_score:71, status:'On Track', engagement_score:74, commitment_score:65, velocity_score:75, stakeholder_score:70, top_signal:'Champion actively driving internal process — sharing materials with exec team', risk_flags:[], next_action:'Request an exec sponsor introduction — deals with exec visibility close 40% faster.', days_in_stage:4, avg_days_won:7 },
  { id:'d004', company:'Stackline', contact:'Olivia Chen', title:'VP Revenue', stage:'Proposal', deal_value:28400, health_score:58, status:'At Risk', engagement_score:55, commitment_score:52, velocity_score:60, stakeholder_score:65, top_signal:'Proposal sent 8 days ago with no response', risk_flags:['8 days since last prospect reply','No next meeting scheduled','Single contact engaged'], next_action:'Call today — do not send another email. 8 days silence at proposal stage is a serious stall signal.', days_in_stage:12, avg_days_won:9 },
  { id:'d005', company:'Metric Labs', contact:'Tom Eriksson', title:'Head of Sales', stage:'Negotiation', deal_value:15600, health_score:52, status:'At Risk', engagement_score:48, commitment_score:60, velocity_score:45, stakeholder_score:55, top_signal:'Deal has been in negotiation for 18 days vs 8-day average for won deals', risk_flags:['Stage velocity 2x over average','Champion engagement declining','No trial data connected'], next_action:'Get a clear decision timeline from champion — open-ended negotiations stall and die. Ask for a date.', days_in_stage:18, avg_days_won:8 },
  { id:'d006', company:'Kairon Growth', contact:'Sophie Laurent', title:'RevOps Lead', stage:'Qualified', deal_value:12800, health_score:35, status:'Stalling', engagement_score:30, commitment_score:28, velocity_score:38, stakeholder_score:45, top_signal:'Rep has sent 9 emails, prospect has replied to 2 — ratio has inverted', risk_flags:['Email ratio inverted — prospect ghosting','No next meeting in 14 days','No reciprocal commitments'], next_action:'Stop emailing. Call the champion directly and ask: "Is this still a priority for you?" Get a yes or a no.', days_in_stage:21, avg_days_won:7 },
  { id:'d007', company:'Flowcast', contact:'Ben Murphy', title:'Head of Sales', stage:'Proposal', deal_value:22100, health_score:44, status:'Stalling', engagement_score:40, commitment_score:35, velocity_score:42, stakeholder_score:60, top_signal:'Champion has not replied in 11 days — deal is orphaned', risk_flags:['Champion silent 11 days','No exec sponsor identified','Contract not opened'], next_action:'Find a second contact at Flowcast — champion dependency with 11 days silence means this deal is at serious risk.', days_in_stage:16, avg_days_won:9 },
]

const STATUS_STYLES: Record<string,{border:string;bg:string;badge:string;text:string;icon:any}> = {
  'Accelerating': {border:'border-teal-500/40', bg:'bg-teal-500/5',  badge:'bg-teal-500 text-white',    text:'text-teal-400',  icon:TrendingUp},
  'On Track':     {border:'border-blue-500/40',  bg:'bg-blue-500/5',  badge:'bg-blue-500 text-white',    text:'text-blue-400',  icon:CheckCircle},
  'At Risk':      {border:'border-amber-500/40', bg:'bg-amber-500/5', badge:'bg-amber-500 text-white',   text:'text-amber-400', icon:AlertTriangle},
  'Stalling':     {border:'border-red-500/40',   bg:'bg-red-500/5',   badge:'bg-red-500 text-white',     text:'text-red-400',   icon:AlertTriangle},
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
  const [loading,setLoading]=useState(false)
  const [deals,setDeals]=useState<typeof MOCK_DEALS|null>(null)
  const [expanded,setExpanded]=useState<string|null>(null)
  const [activeFilter,setActiveFilter]=useState<string|null>(null)

  function handleScore() {
    setLoading(true)
    setTimeout(()=>{setDeals(MOCK_DEALS);setLoading(false)},2200)
  }

  const statusOrder: Record<string,number> = {'Stalling':0,'At Risk':1,'On Track':2,'Accelerating':3}
  const sorted = deals ? [...deals].sort((a,b)=>statusOrder[a.status]-statusOrder[b.status]) : []
  const filtered = activeFilter ? sorted.filter(d=>d.status===activeFilter) : sorted

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-white mb-1">Accelerate live pipeline</h2>
        <p className="text-slate-400 text-sm">Score every active deal on engagement velocity, stakeholder breadth, commitment depth, and stage trajectory — then surface exactly what to do next.</p>
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
          <div className="grid grid-cols-4 gap-3 mb-5">
            {(['Accelerating','On Track','At Risk','Stalling'] as const).map(s=>{
              const count=deals.filter(d=>d.status===s).length
              const st=STATUS_STYLES[s]
              const Icon=st.icon
              const isActive=activeFilter===s
              return (
                <button key={s} onClick={()=>setActiveFilter(activeFilter===s?null:s)}
                  className={`border ${st.border} ${st.bg} rounded-xl p-3 text-left transition-all ${isActive?'ring-2 ring-offset-1 ring-offset-slate-900 ring-current scale-105 shadow-lg':'hover:scale-102 hover:shadow-md'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2"><Icon size={13} className={st.text}/><span className="text-xs text-slate-400">{s}</span></div>
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
              <button onClick={()=>setActiveFilter(null)} className="text-xs text-slate-500 hover:text-white underline ml-1">Clear filter</button>
            </div>
          )}

          <div className="space-y-3">
            {filtered.map(deal=>{
              const st=STATUS_STYLES[deal.status]
              const Icon=st.icon
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
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${st.text}`}>{deal.health_score}</p>
                          <p className="text-xs text-slate-500">health</p>
                        </div>
                        <button onClick={()=>setExpanded(expanded===deal.id?null:deal.id)}
                          className="text-slate-400 hover:text-white p-1.5 rounded-lg border border-slate-700 transition-colors">
                          {expanded===deal.id?<ChevronUp size={14}/>:<ChevronDown size={14}/>}
                        </button>
                      </div>
                    </div>

                    {deal.risk_flags.length>0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {deal.risk_flags.map(f=>(
                          <span key={f} className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertTriangle size={10}/>{f}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className={`mt-3 p-3 rounded-xl border ${deal.status==='Accelerating'?'bg-teal-500/5 border-teal-500/20':deal.status==='Stalling'||deal.status==='At Risk'?'bg-red-500/5 border-red-500/20':'bg-blue-500/5 border-blue-500/20'}`}>
                      <div className="flex items-start gap-2">
                        <Zap size={13} className={st.text+" flex-shrink-0 mt-0.5"}/>
                        <div>
                          <p className={`text-xs font-semibold ${st.text} mb-0.5`}>Next action</p>
                          <p className="text-xs text-slate-300">{deal.next_action}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {expanded===deal.id && (
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
