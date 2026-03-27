'use client'
import { useState } from 'react'
import { Zap, CheckCircle, Copy, ExternalLink, TrendingUp } from 'lucide-react'

const MOCK_PROSPECTS = [
  { company:'Revelo',       contact_name:'James Thornton', contact_title:'VP Sales',    industry:'HR Tech',    employees:'55-70', stage:'Series A', country:'USA',     icp_match_score:94, active_signals:['Hiring 4 SDRs this month','Raised $8M Series A 6 weeks ago','Visited pricing page twice'], why_now:'Just raised Series A — building outbound motion from scratch, need targeting infrastructure', lookalike_reason:'Mirrors your top customer Salespath — same size, stage, industry, and buyer persona' },
  { company:'PipeIQ',       contact_name:'Elena Vasquez',  contact_title:'CRO',         industry:'Sales Tech', employees:'40-60', stage:'Series A', country:'UK',      icp_match_score:91, active_signals:['New CRO hired 3 weeks ago','Expanding to EMEA market','HubSpot + Stripe stack confirmed'], why_now:'New CRO hired and building their tech stack — 90-day window to influence decisions', lookalike_reason:'Exact match to Primary ICP — Sales Tech, 40-60 employees, Series A, HubSpot user' },
  { company:'Workstream',   contact_name:'Patrick O\'Brien',contact_title:'Head of RevOps',industry:'RevOps',  employees:'45-65', stage:'Series B', country:'Ireland', icp_match_score:88, active_signals:['Hiring RevOps manager','Tech stack change — adding Outreach','Conference speaker at SaaStr'], why_now:'Adding Outreach to their stack — actively building outbound infrastructure now', lookalike_reason:'RevOps company building outbound stack — matches your secondary ICP profile precisely' },
  { company:'Quota Labs',   contact_name:'Anna Fischer',   contact_title:'VP Sales',    industry:'Sales Tech', employees:'30-50', stage:'Seed',     country:'Germany', icp_match_score:85, active_signals:['Funding announced last week','Hiring first AEs','VP Sales role filled 2 weeks ago'], why_now:'Just hired VP Sales and first AEs — they are buying now', lookalike_reason:'Early-stage Sales Tech with new VP Sales — mirrors how your best customer Stageflow looked 18 months ago' },
  { company:'Opsgenie AI',  contact_name:'Ryan Clarke',    contact_title:'CRO',         industry:'DevTools',   employees:'25-40', stage:'Seed',     country:'USA',     icp_match_score:82, active_signals:['Product Hunt launch last month','Hiring SDR and AE','Bootstrapped to $1.2M ARR'], why_now:'Bootstrapped to $1M+ ARR and now hiring sales — exactly when RevOps tooling becomes urgent', lookalike_reason:'Matches Secondary ICP — bootstrapped DevTools company transitioning to outbound' },
  { company:'Stackline',    contact_name:'Olivia Chen',    contact_title:'VP Revenue',  industry:'Analytics',  employees:'50-70', stage:'Series A', country:'USA',     icp_match_score:80, active_signals:['New VP Revenue hired','CRM migration to Salesforce','$6M funding round closed'], why_now:'CRM migration underway — peak moment for revenue intelligence adoption', lookalike_reason:'Analytics company in growth phase — matches Metric Labs profile before they became a customer' },
  { company:'Flowcast',     contact_name:'Ben Murphy',     contact_title:'Head of Sales',industry:'FinTech',   employees:'35-55', stage:'Series A', country:'UK',      icp_match_score:78, active_signals:['Hiring 3 AEs in London','Expansion to US market announced','Stripe billing confirmed'], why_now:'US expansion means new ICP definition needed — perfect moment to connect', lookalike_reason:'FinTech Series A with Stripe billing — matches Secondary ICP profile closely' },
  { company:'Kairon Growth',contact_name:'Sophie Laurent', contact_title:'RevOps Lead', industry:'RevOps',    employees:'20-35', stage:'Bootstrapped',country:'France',icp_match_score:74, active_signals:['Active on G2 reviewing tools','LinkedIn signal: RevOps hiring','HubSpot user confirmed'], why_now:'Actively reviewing RevOps tools on G2 right now — highest intent signal possible', lookalike_reason:'Bootstrapped RevOps company evaluating tools — exactly your early adopter customer profile' },
]

export default function GenerateTab() {
  const [loading,setLoading]=useState(false)
  const [prospects,setProspects]=useState<typeof MOCK_PROSPECTS|null>(null)
  const [copied,setCopied]=useState<string|null>(null)
  const [emailOpen,setEmailOpen]=useState<string|null>(null)

  function handleGenerate() {
    setLoading(true)
    setTimeout(()=>{setProspects(MOCK_PROSPECTS);setLoading(false)},3000)
  }

  function copy(text:string,id:string) {
    navigator.clipboard.writeText(text)
    setCopied(id); setTimeout(()=>setCopied(null),2000)
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-white mb-1">Generate net-new pipeline</h2>
        <p className="text-slate-400 text-sm">Based on your best-customer profile, SignalOps identifies net-new companies that match your highest-LTV, lowest-support-cost customers — and are showing live buying signals right now.</p>
      </div>

      {!prospects ? (
        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-10 text-center">
          <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap size={28} className="text-teal-500"/>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Find your next best customers</h3>
          <p className="text-slate-400 text-sm max-w-lg mx-auto mb-1">SignalOps uses your ICP profile to generate a shortlist of net-new companies that look like your best customers and are showing active buying signals today.</p>
          <p className="text-slate-500 text-xs max-w-md mx-auto mb-6 italic">Not lookalikes of your average customer. Lookalikes of your best ones.</p>
          <button onClick={handleGenerate} disabled={loading}
            className="bg-teal-500 hover:bg-teal-400 disabled:opacity-70 text-white font-semibold px-8 py-3 rounded-xl transition-colors inline-flex items-center gap-2">
            {loading
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Finding lookalikes...</>
              : <><Zap size={16}/>Generate prospect list →</>}
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-400"><span className="text-teal-400 font-semibold">{prospects.length} high-match accounts</span> identified from your ICP profile</p>
          </div>

          <div className="space-y-3">
            {prospects.map((p,i)=>(
              <div key={p.company} className="bg-slate-800/40 border border-slate-700 rounded-2xl p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-indigo-500/20">
                    <span className="text-sm font-bold text-indigo-400">{i+1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <h3 className="font-bold text-white">{p.company}</h3>
                          <span className="text-xs bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-medium">{p.industry}</span>
                        </div>
                        <p className="text-xs text-slate-400">{p.contact_name} · {p.contact_title} · {p.employees} employees · {p.stage} · {p.country}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xl font-bold text-indigo-400">{p.icp_match_score}</p>
                        <p className="text-xs text-slate-500">match score</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {p.active_signals.map(sig=>(
                        <span key={sig} className="text-xs bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <TrendingUp size={10}/>{sig}
                        </span>
                      ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-2 mb-3">
                      <div className="bg-slate-900/50 rounded-lg p-2.5">
                        <p className="text-xs text-slate-500 mb-0.5">Why now</p>
                        <p className="text-xs text-slate-300">{p.why_now}</p>
                      </div>
                      <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-2.5">
                        <p className="text-xs text-indigo-400 mb-0.5">Lookalike reason</p>
                        <p className="text-xs text-slate-300">{p.lookalike_reason}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={()=>setEmailOpen(emailOpen===p.company?null:p.company)}
                        className="text-xs font-semibold text-teal-400 border border-teal-500/30 px-3 py-1.5 rounded-lg hover:bg-teal-500/10 transition-colors">
                        {emailOpen===p.company?'Hide email':'Generate outreach →'}
                      </button>
                      <button className="text-xs text-slate-400 hover:text-white border border-slate-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
                        <ExternalLink size={11}/>View on LinkedIn
                      </button>
                    </div>

                    {emailOpen===p.company && (
                      <div className="mt-3 bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-semibold text-slate-400">Cold outreach email</p>
                          <button onClick={()=>copy(`Hi ${p.contact_name.split(' ')[0]},\n\nI came across ${p.company} and noticed ${p.active_signals[0].toLowerCase()}.\n\nWe work with companies like yours — ${p.industry}, ${p.stage} — to identify exactly which accounts to target based on your actual revenue data, not just enrichment lists.\n\nThe result: our customers typically see 3x more qualified pipeline from the same outbound effort.\n\nWorth 15 minutes to show you how?\n\nBest,\n[Your name]`,p.company)}
                            className="text-xs text-slate-400 hover:text-teal-400 flex items-center gap-1 transition-colors">
                            {copied===p.company?<><CheckCircle size={12}/>Copied</>:<><Copy size={12}/>Copy</>}
                          </button>
                        </div>
                        <p className="text-xs font-semibold text-white mb-2">Subject: Quick question for {p.contact_name.split(' ')[0]}</p>
                        <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
{`Hi ${p.contact_name.split(' ')[0]},

I came across ${p.company} and noticed ${p.active_signals[0].toLowerCase()}.

We work with companies like yours — ${p.industry}, ${p.stage} — to identify exactly which accounts to target based on your actual revenue data, not just enrichment lists.

The result: our customers typically see 3x more qualified pipeline from the same outbound effort.

Worth 15 minutes to show you how?`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
