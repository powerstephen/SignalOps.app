'use client'
import { useState } from 'react'
import { Target, TrendingUp, AlertTriangle, CheckCircle, Star, Zap, Users, DollarSign, Award } from 'lucide-react'

const MOCK_RESULT = {
  summary: "SignalOps's best customers are mid-market B2B SaaS companies in HR Tech and Sales Tech, typically Series A to Series B, with 40–90 employees. They reach value fast, expand consistently, and generate 3.4x the LTV of your average customer with 45% fewer support tickets.",
  revenue_reality: { total_analysed:100, best_customers:24, avg_ltv_best:68400, avg_ltv_all:20200, ltv_multiplier:'3.4x', revenue_concentration:'71%' },
  primary_icp: {
    label:'Primary ICP', color:'teal', title:'Mid-Market HR & Sales Tech',
    size:'40–90 employees', stage:'Series A to Series B',
    industries:['HR Tech','Sales Tech','RevOps'], regions:['USA','UK','Ireland'],
    avg_ltv:'€68,400', avg_months:19, expansion_rate:'82%', time_to_value:'18 days', support_tickets:3.2,
    traits:['VP Sales or RevOps as champion','HubSpot or Salesforce already in place','Stripe or Chargebee for billing','Outbound-led growth motion','Active hiring of SDRs or AEs'],
  },
  secondary_icp: {
    label:'Secondary ICP', color:'indigo', title:'Bootstrapped DevTools & FinTech',
    size:'15–45 employees', stage:'Bootstrapped to Seed',
    industries:['DevTools','FinTech','Analytics'], regions:['Germany','Netherlands','USA'],
    avg_ltv:'€31,200', avg_months:14, expansion_rate:'58%', time_to_value:'24 days', support_tickets:2.1,
    traits:['Founder or CTO as champion','Product-led with outbound overlay','Fast time-to-value expectation','High NPS, low expansion tendency','Technical buyer, low handholding needed'],
  },
  industry_breakdown:[
    {label:'HR Tech',value:28,color:'#0D9488'},{label:'Sales Tech',value:22,color:'#14B8A6'},
    {label:'RevOps',value:18,color:'#2DD4BF'},{label:'DevTools',value:16,color:'#5EEAD4'},
    {label:'FinTech',value:10,color:'#99F6E4'},{label:'Other',value:6,color:'#CCFBF1'},
  ],
  size_breakdown:[
    {label:'1–20',value:8,color:'#6366F1'},{label:'21–50',value:26,color:'#818CF8'},
    {label:'51–100',value:38,color:'#A5B4FC'},{label:'101–200',value:20,color:'#C7D2FE'},
    {label:'200+',value:8,color:'#E0E7FF'},
  ],
  profitability_matrix:[
    {label:'Champions',desc:'High LTV · Low tickets',count:14,ltv:'€74k avg',tickets:'2.1 avg',color:'teal' as const,action:'Clone these — they are your ICP'},
    {label:'Diamonds',desc:'High LTV · High tickets',count:10,ltv:'€61k avg',tickets:'11.4 avg',color:'amber' as const,action:'Worth it, but set expectations early'},
    {label:'Quick Wins',desc:'Lower LTV · Low tickets',count:31,ltv:'€18k avg',tickets:'2.8 avg',color:'blue' as const,action:'Good volume play — easy to serve'},
    {label:'Drains',desc:'Low LTV · High tickets',count:45,ltv:'€9k avg',tickets:'14.2 avg',color:'red' as const,action:'Stop targeting these profiles'},
  ],
  red_flags:[
    'Solo founders with no sales motion — high churn within 90 days',
    'Companies under 15 employees — low expansion, high support burden',
    'No CRM in place — 3x longer time to value, 2x higher churn',
    'E-commerce or D2C companies — poor product fit, high ticket volume',
    'Single contact engaged — champion dependency, high churn risk',
  ],
  scorecard:{ size:'40–90 employees', stage:'Series A to Series B', industries:'HR Tech or Sales Tech', regions:'USA or UK', time_to_value:'18 days', expansion_window:'6 months', ltv_multiplier:'3.4x', ticket_reduction:'45%' },
}

const MATRIX_STYLES = {
  teal:  {border:'border-teal-500/40',  bg:'bg-teal-500/5',  badge:'bg-teal-500 text-white',  text:'text-teal-400'},
  amber: {border:'border-amber-500/40', bg:'bg-amber-500/5', badge:'bg-amber-500 text-white', text:'text-amber-400'},
  blue:  {border:'border-blue-500/40',  bg:'bg-blue-500/5',  badge:'bg-blue-500 text-white',  text:'text-blue-400'},
  red:   {border:'border-red-500/40',   bg:'bg-red-500/5',   badge:'bg-red-500 text-white',   text:'text-red-400'},
}

function DonutChart({ data, size=140 }: { data:{label:string;value:number;color:string}[]; size?:number }) {
  const total = data.reduce((s,d)=>s+d.value,0)
  let cum = 0
  const cx=size/2, cy=size/2, r=size*0.38, inner=size*0.24
  const segs = data.map(d => {
    const pct=d.value/total
    const sa=(cum/total)*2*Math.PI-Math.PI/2; cum+=d.value; const ea=(cum/total)*2*Math.PI-Math.PI/2
    const x1=cx+r*Math.cos(sa),y1=cy+r*Math.sin(sa),x2=cx+r*Math.cos(ea),y2=cy+r*Math.sin(ea)
    const xi1=cx+inner*Math.cos(sa),yi1=cy+inner*Math.sin(sa),xi2=cx+inner*Math.cos(ea),yi2=cy+inner*Math.sin(ea)
    return {...d,path:`M ${x1} ${y1} A ${r} ${r} 0 ${pct>0.5?1:0} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${inner} ${inner} 0 ${pct>0.5?1:0} 0 ${xi1} ${yi1} Z`}
  })
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segs.map((s,i)=><path key={i} d={s.path} fill={s.color}/>)}
      <circle cx={cx} cy={cy} r={inner*0.85} fill="#1E293B"/>
    </svg>
  )
}

function StatCard({icon:Icon,label,value,sub,color='teal'}:any) {
  const c:Record<string,string>={teal:'text-teal-400',indigo:'text-indigo-400',amber:'text-amber-400',green:'text-green-400',red:'text-red-400'}
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2"><Icon size={14} className={c[color]}/><span className="text-xs text-slate-500">{label}</span></div>
      <p className={`text-2xl font-bold ${c[color]} mb-0.5`}>{value}</p>
      {sub&&<p className="text-xs text-slate-500">{sub}</p>}
    </div>
  )
}

function ICPCard({icp}:{icp:typeof MOCK_RESULT.primary_icp}) {
  const isPrimary=icp.color==='teal'
  return (
    <div className={`border rounded-2xl p-5 ${isPrimary?'border-teal-500/40 bg-teal-500/5':'border-indigo-500/40 bg-indigo-500/5'}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isPrimary?'bg-teal-500 text-white':'bg-indigo-500 text-white'}`}>{icp.label}</span>
        <h3 className="font-bold text-white text-sm">{icp.title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {[{label:'Size',value:icp.size},{label:'Stage',value:icp.stage},{label:'Avg LTV',value:icp.avg_ltv},{label:'Expansion rate',value:icp.expansion_rate},{label:'Time to value',value:icp.time_to_value},{label:'Tickets/mo avg',value:String(icp.support_tickets)}].map(item=>(
          <div key={item.label} className="bg-slate-800/60 rounded-lg p-2.5">
            <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
            <p className="text-sm font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mb-3">
        <p className="text-xs text-slate-500 mb-2">Industries</p>
        <div className="flex flex-wrap gap-1.5">
          {icp.industries.map(ind=><span key={ind} className={`text-xs px-2 py-0.5 rounded-full font-medium ${isPrimary?'bg-teal-500/15 text-teal-400':'bg-indigo-500/15 text-indigo-400'}`}>{ind}</span>)}
        </div>
      </div>
      <div>
        <p className="text-xs text-slate-500 mb-2">Key traits</p>
        <div className="space-y-1.5">
          {icp.traits.map(trait=>(
            <div key={trait} className="flex items-start gap-2">
              <CheckCircle size={12} className={`flex-shrink-0 mt-0.5 ${isPrimary?'text-teal-500':'text-indigo-400'}`}/>
              <p className="text-xs text-slate-300">{trait}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ICPProfile() {
  const [loading,setLoading]=useState(false)
  const [result,setResult]=useState<typeof MOCK_RESULT|null>(null)
  const [counts,setCounts]=useState({contacts:0,companies:0})
  const R=result||MOCK_RESULT

  useState(()=>{
    fetch('/api/hubspot/counts?account_id=demo-account')
      .then(r=>r.json())
      .then(d=>{ if(d.contacts!==undefined) setCounts(d) })
      .catch(()=>{})
  })

  async function handleAnalyse() {
    setLoading(true)
    try {
      const res = await fetch('/api/analyze-icp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: 'demo-account' }),
      })
      const data = await res.json()
      setResult(data.result || MOCK_RESULT)
    } catch {
      setResult(MOCK_RESULT)
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-6">
        <StatCard icon={Users} label="Total accounts" value={counts.companies||R.revenue_reality.total_analysed} sub="in your CRM"/>
        <StatCard icon={Star} label="Active customers" value="72" sub="currently paying" color="green"/>
        <StatCard icon={AlertTriangle} label="Churned" value="9" sub="lost accounts" color="amber"/>
        <StatCard icon={Zap} label="At risk" value="5" sub="flagged accounts" color="red"/>
      </div>

      {!result ? (
        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-10 text-center">
          <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target size={28} className="text-teal-500"/>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Build your ICP Profile</h3>
          <p className="text-slate-400 text-sm max-w-lg mx-auto mb-2">SignalOps analyses your {counts.companies||R.revenue_reality.total_analysed} customer records — CRM data, billing outcomes, CS history — to identify the characteristics of your truly best customers.</p>
          <p className="text-slate-500 text-xs max-w-md mx-auto mb-6 italic">Not your average customers. Your best ones — the ones that stay, expand, and never drain your team.</p>
          <button onClick={handleAnalyse} disabled={loading}
            className="bg-teal-500 hover:bg-teal-400 disabled:opacity-70 text-white font-semibold px-8 py-3 rounded-xl transition-colors inline-flex items-center gap-2">
            {loading
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Analysing your revenue data...</>
              : <><Target size={16}/>Analyse my ICP →</>}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"><Target size={16} className="text-white"/></div>
              <div>
                <p className="text-sm font-semibold text-teal-400 mb-1">ICP Analysis Complete — {R.revenue_reality.best_customers} best customers identified from {R.revenue_reality.total_analysed}</p>
                <p className="text-sm text-slate-300 leading-relaxed">{R.summary}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><DollarSign size={15} className="text-teal-400"/>Revenue Reality</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard icon={Award} label="Best customers" value={R.revenue_reality.best_customers} sub={`of ${R.revenue_reality.total_analysed} total`} color="teal"/>
              <StatCard icon={TrendingUp} label="LTV multiplier" value={R.revenue_reality.ltv_multiplier} sub="best vs average customer" color="green"/>
              <StatCard icon={DollarSign} label="Avg LTV — best" value={`€${(R.revenue_reality.avg_ltv_best/1000).toFixed(0)}k`} sub={`vs €${(R.revenue_reality.avg_ltv_all/1000).toFixed(0)}k average`} color="teal"/>
              <StatCard icon={Star} label="Revenue concentration" value={R.revenue_reality.revenue_concentration} sub="from top 24% of customers" color="amber"/>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[{title:'Industry breakdown — best customers',data:R.industry_breakdown,suffix:''},{title:'Company size — best customers',data:R.size_breakdown,suffix:' employees'}].map(chart=>(
              <div key={chart.title} className="bg-slate-800/40 border border-slate-700 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-white mb-4">{chart.title}</h4>
                <div className="flex items-center gap-6">
                  <DonutChart data={chart.data} size={130}/>
                  <div className="space-y-2 flex-1">
                    {chart.data.map(d=>(
                      <div key={d.label} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:d.color}}/>
                        <span className="text-xs text-slate-300 flex-1">{d.label}{chart.suffix}</span>
                        <span className="text-xs font-semibold text-white">{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Target size={15} className="text-teal-400"/>ICP Profiles</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <ICPCard icp={R.primary_icp}/>
              <ICPCard icp={R.secondary_icp}/>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2"><TrendingUp size={15} className="text-teal-400"/>Profitability Matrix</h3>
            <p className="text-xs text-slate-500 mb-3">LTV vs support cost — which customers are actually worth having</p>
            <div className="grid grid-cols-2 gap-3">
              {R.profitability_matrix.map(q=>{
                const st = MATRIX_STYLES[q.color]
                return (
                  <div key={q.label} className={`border ${st.border} ${st.bg} rounded-xl p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${st.badge}`}>{q.label}</span>
                      <span className={`text-lg font-bold ${st.text}`}>{q.count}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{q.desc}</p>
                    <div className="flex gap-3 mb-2">
                      <div><p className="text-xs text-slate-500">LTV</p><p className="text-xs font-semibold text-white">{q.ltv}</p></div>
                      <div><p className="text-xs text-slate-500">Tickets/mo</p><p className="text-xs font-semibold text-white">{q.tickets}</p></div>
                    </div>
                    <p className={`text-xs font-medium ${st.text}`}>→ {q.action}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><AlertTriangle size={15} className="text-red-400"/>Red Flags — Who NOT to Target</h3>
            <div className="space-y-2">
              {R.red_flags.map(flag=>(
                <div key={flag} className="flex items-start gap-2">
                  <AlertTriangle size={12} className="text-red-400 flex-shrink-0 mt-0.5"/>
                  <p className="text-xs text-slate-300">{flag}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/40 border border-teal-500/30 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2"><Star size={15} className="text-teal-400"/>Your ICP Scorecard</h3>
            <p className="text-xs text-slate-500 mb-4">Your ideal customer in plain English</p>
            <div className="bg-slate-900/60 rounded-xl p-4 mb-4">
              <p className="text-sm text-slate-200 leading-relaxed">
                Your ideal customer is a <span className="text-teal-400 font-semibold">{R.scorecard.size}</span>, <span className="text-teal-400 font-semibold">{R.scorecard.stage}</span> company in <span className="text-teal-400 font-semibold">{R.scorecard.industries}</span>, typically based in <span className="text-teal-400 font-semibold">{R.scorecard.regions}</span>. They reach value within <span className="text-teal-400 font-semibold">{R.scorecard.time_to_value}</span>, expand within <span className="text-teal-400 font-semibold">{R.scorecard.expansion_window}</span>, and generate <span className="text-teal-400 font-semibold">{R.scorecard.ltv_multiplier}</span> the LTV of your average customer with <span className="text-teal-400 font-semibold">{R.scorecard.ticket_reduction}</span> fewer support tickets.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">This profile updates automatically as you win and lose deals.</p>
              <button className="text-xs font-semibold text-teal-400 border border-teal-500/30 px-3 py-1.5 rounded-lg hover:bg-teal-500/10 transition-colors">Export ICP →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
