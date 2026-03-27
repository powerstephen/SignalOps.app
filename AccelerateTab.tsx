'use client'
import { useState } from 'react'
import { RefreshCw, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Copy, Mail } from 'lucide-react'

const MOCK_ACCOUNTS = [
  { id:'c001', company:'Salespath AI', contact:'Declan Murray', title:'VP Sales', industry:'Sales Tech', employees:62, country:'Ireland', icp_score:91, score_label:'Perfect fit', segment:'Late-stage ghosted', segment_reason:'Reached proposal stage 4 months ago, champion went quiet after pricing call', score_reasons:['Exact ICP match — Sales Tech, 62 employees, Series A','Previously engaged at proposal stage — high intent signal','VP Sales hired 6 weeks ago — new budget cycle likely'], why_now:'New VP Sales hired 6 weeks ago — new budget and mandate to build outbound stack', reengagement_angle:'Reference the new VP hire — fresh slate, new priorities, new budget', email1:{subject:"Your new VP Sales + the outbound problem", body:"Hi Declan,\n\nCongratulations on the new VP Sales hire at Salespath — that kind of move usually comes with a mandate to fix the outbound motion.\n\nWe spoke a few months back and the timing wasn't right. I'd love to show you what we've built since then — specifically how we're helping Sales Tech teams like yours identify which accounts are actually worth pursuing before a rep touches them.\n\n15 minutes this week?", send_timing:'Send now', goal:'Re-open conversation'}, email2:{subject:"How Momentum used SignalOps to 3x their qualified pipeline", body:"Hi Declan,\n\nQuick follow-up — wanted to share how Momentum (similar size, same stack) used SignalOps to surface 40 dormant accounts that matched their best customers and were showing buying signals.\n\n6 of those became customers within 90 days.\n\nHappy to walk you through the exact approach — takes 20 minutes.", send_timing:'Day 4 if no reply', goal:'Social proof nudge'}, email3:{subject:"Closing the loop", body:"Hi Declan,\n\nI'll keep this short — I don't want to keep nudging if the timing is wrong.\n\nIf outbound targeting isn't a priority right now, totally understand. Just reply 'not now' and I'll check back in Q3.\n\nIf it is — I'm one reply away.", send_timing:'Day 8 if no reply', goal:'Break-up email'} },
  { id:'c002', company:'Pipefy EMEA', contact:'Sarah Brennan', title:'Head of RevOps', industry:'RevOps', employees:78, country:'UK', icp_score:87, score_label:'Strong fit', segment:'Timing issue', segment_reason:'Lost deal 5 months ago due to budget freeze — signals suggest freeze has lifted', score_reasons:['RevOps company — core ICP vertical','Head of RevOps champion — exact buyer persona','Hiring 3 AEs this month — budget clearly available'], why_now:'Actively hiring AEs — budget freeze is clearly over', reengagement_angle:'Budget freeze is over — reference their hiring activity as the signal', email1:{subject:"Looks like the budget freeze is over", body:"Hi Sarah,\n\nI noticed Salespath is hiring 3 AEs this month — good sign that the freeze has lifted.\n\nWe spoke last year and timing wasn't right. Worth a quick catch-up to see if it makes sense now?\n\nI can show you what's changed in 15 minutes.", send_timing:'Send now', goal:'Re-open conversation'}, email2:{subject:"What RevOps teams are doing differently in 2024", body:"Hi Sarah,\n\nFollowing up — the RevOps teams we work with are shifting from volume outbound to precision targeting. The difference in qualified pipeline is significant.\n\nHappy to share the playbook. 20 minutes?", send_timing:'Day 4 if no reply', goal:'Social proof nudge'}, email3:{subject:"Last nudge from me", body:"Hi Sarah,\n\nLast one from me — if the timing still isn't right I completely understand.\n\nJust reply 'not yet' and I'll follow up in Q3. Otherwise — one reply and we'll find 15 minutes.", send_timing:'Day 8 if no reply', goal:'Break-up email'} },
  { id:'c003', company:'Growthline', contact:'Marcus Webb', title:'CRO', industry:'HR Tech', employees:44, country:'USA', icp_score:84, score_label:'Strong fit', segment:'Early-stage browser', segment_reason:'Downloaded pricing page twice last month — revisiting options', score_reasons:['HR Tech vertical — top ICP industry','CRO champion — senior enough to close','Website intent signals — actively evaluating solutions'], why_now:'Revisited pricing page twice in 30 days — actively evaluating solutions right now', reengagement_angle:'Lead with the intent signal — they are already looking', email1:{subject:"Saw you looking...", body:"Hi Marcus,\n\nWe noticed some activity on our pricing page from Growthline recently — no pressure, just a good signal to reach out.\n\nIf you're evaluating revenue intelligence options, I'd love to show you how we're different. 15 minutes this week?", send_timing:'Send now', goal:'Re-open conversation'}, email2:{subject:"How we're different from Clay and Apollo", body:"Hi Marcus,\n\nMost tools help you find pipeline. SignalOps helps you close what you have and find more of your best customers — not just more contacts.\n\nWorth 20 minutes to show you the difference?", send_timing:'Day 4 if no reply', goal:'Social proof nudge'}, email3:{subject:"Timing off?", body:"Hi Marcus,\n\nLast note — if you're not evaluating this right now, just say the word and I'll check back later.\n\nOtherwise, one reply to get 15 minutes on the calendar.", send_timing:'Day 8 if no reply', goal:'Break-up email'} },
  { id:'c004', company:'Stageflow', contact:'Niamh Carroll', title:'VP Sales', industry:'Sales Tech', employees:55, country:'Ireland', icp_score:82, score_label:'Strong fit', segment:'Late-stage ghosted', segment_reason:'Was in negotiation 3 months ago — champion stopped responding', score_reasons:['Sales Tech — perfect vertical','VP Sales buyer persona','Ireland HQ — same timezone, warm relationship possible'], why_now:'Q2 budget planning typically starts now for Irish SaaS companies', reengagement_angle:'Q2 budget angle — natural moment to re-engage without it feeling random', email1:{subject:"Q2 planning — worth a quick chat?", body:"Hi Niamh,\n\nQ2 planning is usually the moment revenue teams revisit tooling decisions. We spoke last year and I think the timing might be better now.\n\n15 minutes to show you what's new?", send_timing:'Send now', goal:'Re-open conversation'}, email2:{subject:"What Stageflow's competitors are doing", body:"Hi Niamh,\n\nA few Sales Tech companies similar to Stageflow have started using SignalOps to identify which dormant accounts are warm again — without reps doing manual research.\n\nHappy to walk through a quick demo.", send_timing:'Day 4 if no reply', goal:'Social proof nudge'}, email3:{subject:"Closing the loop on this one", body:"Hi Niamh,\n\nI'll take your silence as 'not now' — totally fine.\n\nI'll check back in Q3. If anything changes before then, you know where I am.", send_timing:'Day 8 if no reply', goal:'Break-up email'} },
  { id:'c005', company:'Metric Labs', contact:'Tom Eriksson', title:'Head of Sales', industry:'Analytics', employees:38, country:'Sweden', icp_score:76, score_label:'Good fit', segment:'Churned — recoverable', segment_reason:'Churned 8 months ago citing price — company has since grown 40%', score_reasons:['Analytics vertical — secondary ICP','Company grown 40% since churning — different budget reality','Head of Sales — right buyer level'], why_now:'40% company growth since churning — the price objection no longer applies', reengagement_angle:'Lead with the growth angle — acknowledge they left, show you noticed they scaled', email1:{subject:"Congrats on the growth — things look different now", body:"Hi Tom,\n\nI noticed Metric Labs has grown significantly since we last worked together. The pricing concern that came up last time probably looks different at your current scale.\n\nWorth a quick look at what makes sense now?", send_timing:'Send now', goal:'Re-open conversation'}, email2:{subject:"What we've built since you left", body:"Hi Tom,\n\nA few things have changed since we last spoke — our scoring model is significantly sharper and we've added pipeline deal intelligence that your team would find useful.\n\n20 minutes to show you?", send_timing:'Day 4 if no reply', goal:'Social proof nudge'}, email3:{subject:"Last one from me", body:"Hi Tom,\n\nIf the timing isn't right I completely understand. Just reply 'not now' and I'll follow up later.\n\nOtherwise — one reply to reconnect.", send_timing:'Day 8 if no reply', goal:'Break-up email'} },
]

const SEGMENTS = ['All','Late-stage ghosted','Timing issue','Early-stage browser','Churned — recoverable']
const SEG_COLORS: Record<string,string> = {
  'Late-stage ghosted':'bg-purple-500/15 text-purple-400 border-purple-500/30',
  'Timing issue':'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Early-stage browser':'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'Churned — recoverable':'bg-red-500/15 text-red-400 border-red-500/30',
}

export default function RecoverTab() {
  const [loading,setLoading]=useState(false)
  const [accounts,setAccounts]=useState<typeof MOCK_ACCOUNTS|null>(null)
  const [segment,setSegment]=useState('All')
  const [expanded,setExpanded]=useState<string|null>(null)
  const [emailOpen,setEmailOpen]=useState<string|null>(null)
  const [copied,setCopied]=useState<string|null>(null)

  function handleScore() {
    setLoading(true)
    setTimeout(()=>{setAccounts(MOCK_ACCOUNTS);setLoading(false)},2400)
  }

  function copy(text:string,id:string) {
    navigator.clipboard.writeText(text)
    setCopied(id); setTimeout(()=>setCopied(null),2000)
  }

  const filtered = accounts ? (segment==='All' ? accounts : accounts.filter(a=>a.segment===segment)) : []

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-white mb-1">Recover dormant pipeline</h2>
        <p className="text-slate-400 text-sm">Surface accounts that match your best customers and are showing signals right now — segmented by why they went cold.</p>
      </div>

      {!accounts ? (
        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-10 text-center">
          <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <RefreshCw size={28} className="text-teal-500"/>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Score your dormant accounts</h3>
          <p className="text-slate-400 text-sm max-w-lg mx-auto mb-6">SignalOps scores every dormant account against your ICP profile, segments them by why they went cold, and generates personalised reengagement sequences.</p>
          <button onClick={handleScore} disabled={loading}
            className="bg-teal-500 hover:bg-teal-400 disabled:opacity-70 text-white font-semibold px-8 py-3 rounded-xl transition-colors inline-flex items-center gap-2">
            {loading
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Scoring accounts...</>
              : <><RefreshCw size={16}/>Score dormant accounts →</>}
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-400"><span className="text-teal-400 font-semibold">{accounts.length} accounts</span> scored and segmented</p>
            <div className="flex gap-2 flex-wrap">
              {SEGMENTS.map(s=>(
                <button key={s} onClick={()=>setSegment(s)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${segment===s?'bg-teal-500 text-white':'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map(acc=>(
              <div key={acc.id} className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-white">{acc.company}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${SEG_COLORS[acc.segment]}`}>{acc.segment}</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{acc.contact} · {acc.title} · {acc.industry} · {acc.employees} employees · {acc.country}</p>
                      <p className="text-xs text-slate-500 italic">{acc.segment_reason}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-xl font-bold text-teal-400">{acc.icp_score}</p>
                        <p className="text-xs text-slate-500">ICP score</p>
                      </div>
                      <button onClick={()=>setExpanded(expanded===acc.id?null:acc.id)}
                        className="text-slate-400 hover:text-white p-1.5 rounded-lg border border-slate-700 transition-colors">
                        {expanded===acc.id?<ChevronUp size={14}/>:<ChevronDown size={14}/>}
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-teal-500/5 border border-teal-500/20 rounded-xl">
                    <p className="text-xs text-teal-400 font-semibold mb-0.5">Why now</p>
                    <p className="text-xs text-slate-300">{acc.why_now}</p>
                  </div>
                </div>

                {expanded===acc.id && (
                  <div className="border-t border-slate-700 p-4">
                    <div className="mb-4">
                      <p className="text-xs text-slate-500 font-semibold mb-2">Score reasons</p>
                      <div className="space-y-1.5">
                        {acc.score_reasons.map(r=>(
                          <div key={r} className="flex items-start gap-2">
                            <CheckCircle size={12} className="text-teal-500 flex-shrink-0 mt-0.5"/>
                            <p className="text-xs text-slate-300">{r}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-slate-500 font-semibold">3-email reengagement sequence</p>
                      <button onClick={()=>setEmailOpen(emailOpen===acc.id?null:acc.id)}
                        className="text-xs text-teal-400 border border-teal-500/30 px-3 py-1.5 rounded-lg hover:bg-teal-500/10 transition-colors flex items-center gap-1.5">
                        <Mail size={12}/>{emailOpen===acc.id?'Hide emails':'View sequence'}
                      </button>
                    </div>

                    {emailOpen===acc.id && (
                      <div className="space-y-3">
                        {[
                          {key:'email1',data:acc.email1},
                          {key:'email2',data:acc.email2},
                          {key:'email3',data:acc.email3},
                        ].map(({key,data},i)=>(
                          <div key={key} className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400">Email {i+1}</span>
                                <span className="text-xs text-slate-500">· {data.send_timing}</span>
                                <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">{data.goal}</span>
                              </div>
                              <button onClick={()=>copy(`Subject: ${data.subject}\n\n${data.body}`,`${acc.id}-${key}`)}
                                className="text-xs text-slate-400 hover:text-teal-400 flex items-center gap-1 transition-colors">
                                {copied===`${acc.id}-${key}`?<><CheckCircle size={12}/>Copied</>:<><Copy size={12}/>Copy</>}
                              </button>
                            </div>
                            <p className="text-xs font-semibold text-white mb-2">Subject: {data.subject}</p>
                            <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">{data.body}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
