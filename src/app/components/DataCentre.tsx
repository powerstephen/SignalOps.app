'use client'
import { useState, useEffect, useRef } from 'react'
import { CheckCircle, Plus, Upload, RefreshCw, Unlink, ChevronDown, ChevronUp } from 'lucide-react'
import { useImport } from '../context/ImportContext'
import ImportModal from './ImportModal'

interface Dataset { label: string; records: number; fields: string[] }
interface Integration {
  id: string; name: string; logo: string; fallback: string; category: string
  description: string; comingSoon?: boolean; datasets?: Dataset[]
}

const categories = [
  { id:'crm',      label:'CRM',      description:'Connect your CRM to import contacts, deals, and pipeline history.', csvLabel:'CRM Contacts', csvRecords:200, csvFields:['company','contact','title','industry','stage','deal_value','close_date','status','last_contact'] },
  { id:'billing',  label:'Billing',  description:'Connect your billing system to analyse LTV, MRR, churn, and expansion.', csvLabel:'Billing Data', csvRecords:20, csvFields:['company','mrr','ltv','plan','seats','arr','churn_date','expansion_revenue','renewal_date'] },
  { id:'cs',       label:'CS',       description:'Connect your CS platform to surface which customers are truly profitable.', csvLabel:'CS History', csvRecords:20, csvFields:['company','total_tickets','ticket_type','sentiment','time_to_value_days','health_trend','risk_flags','csm'] },
  { id:'outreach', label:'Outreach', description:'Push scored accounts and generated emails to your outreach tools.', csvLabel:'', csvRecords:0, csvFields:[] },
  { id:'signals',  label:'Signals',  description:'Layer in live buying signals to identify in-market accounts.', csvLabel:'', csvRecords:0, csvFields:[] },
]

const integrations: Integration[] = [
  { id:'hubspot',    name:'HubSpot',    fallback:'HS', logo:'https://cdn.worldvectorlogo.com/logos/hubspot-1.svg', category:'crm',      description:'Sync contacts, deals, and pipeline data automatically.', datasets:[{label:'CRM Contacts',records:200,fields:['company','contact','deal_stage','deal_value','last_activity','status']}] },
  { id:'salesforce', name:'Salesforce', fallback:'SF', logo:'https://cdn.worldvectorlogo.com/logos/salesforce-2.svg', category:'crm',   description:'Connect your Salesforce org to sync leads, opportunities, and custom objects.', comingSoon:true },
  { id:'attio',      name:'Attio',      fallback:'AT', logo:'/attio.png',      category:'crm',      description:'Powerful CRM integration to manage relationships and track deal flow.', comingSoon:true },
  { id:'pipedrive',  name:'Pipedrive',  fallback:'PD', logo:'/pipedrive.png',  category:'crm',      description:'Pull deal stages, contact activity, and pipeline data from Pipedrive.', comingSoon:true },
  { id:'stripe',     name:'Stripe',     fallback:'ST', logo:'/stripe.png',     category:'billing',  description:'Connect Stripe to analyse real LTV, MRR, churn, and expansion revenue.', datasets:[{label:'Billing Data',records:20,fields:['customer','mrr','ltv','plan','churn_date','expansion_revenue']}] },
  { id:'chargebee',  name:'Chargebee',  fallback:'CB', logo:'/chargebee.png',  category:'billing',  description:'Import subscription billing data to power your best-customer ICP profile.', datasets:[{label:'Subscription Data',records:20,fields:['company','mrr','arr','plan','seats','renewal_date']}] },
  { id:'paddle',     name:'Paddle',     fallback:'PA', logo:'/paddle.png',     category:'billing',  description:'Sync Paddle billing events and revenue data for LTV analysis.', comingSoon:true },
  { id:'intercom',   name:'Intercom',   fallback:'IC', logo:'/intercom.png',   category:'cs',       description:'Pull support ticket volume, type, and sentiment to identify high-maintenance accounts.', datasets:[{label:'CS Tickets',records:20,fields:['company','tickets','ticket_type','sentiment','response_time','health_trend']}] },
  { id:'zendesk',    name:'Zendesk',    fallback:'ZD', logo:'/zendesk.png',    category:'cs',       description:'Import CS ticket history to surface which customers are truly profitable.', datasets:[{label:'Support History',records:20,fields:['company','open_tickets','sentiment','risk_flags','csm']}] },
  { id:'freshdesk',  name:'Freshdesk',  fallback:'FD', logo:'/freshdesk.png',  category:'cs',       description:'Connect Freshdesk to analyse support cost per customer.', comingSoon:true },
  { id:'gmail',      name:'Gmail',      fallback:'GM', logo:'https://cdn.worldvectorlogo.com/logos/gmail-icon-2.svg', category:'outreach', description:'Connect Gmail to send generated emails directly from SignalOps.', datasets:[{label:'Gmail Connected',records:0,fields:['from','to','subject','body']}] },
  { id:'salesloft',  name:'Salesloft',  fallback:'SL', logo:'https://cdn.worldvectorlogo.com/logos/salesloft.svg',   category:'outreach', description:'Send high-scoring accounts straight to Salesloft for sequencing.', comingSoon:true },
  { id:'apollo',     name:'Apollo',     fallback:'AP', logo:'/apollo.png',     category:'outreach', description:'Export lookalike prospects to Apollo outreach campaigns.', comingSoon:true },
  { id:'linkedin',   name:'LinkedIn',   fallback:'LI', logo:'https://cdn.worldvectorlogo.com/logos/linkedin-icon-2.svg', category:'signals', description:'Monitor job changes, hiring signals, and company updates.', comingSoon:true },
  { id:'harmonic',   name:'Harmonic',   fallback:'HM', logo:'/harmonic.png',   category:'signals',  description:'Pull funding, headcount, and hiring signal data via Harmonic API.', comingSoon:true },
  { id:'bombora',    name:'Bombora',    fallback:'BO', logo:'/bombora.png',    category:'signals',  description:'Layer intent signal data to identify in-market accounts.', comingSoon:true },
]

function IntegrationLogo({ logo, fallback, name }: { logo: string; fallback: string; name: string }) {
  const [error, setError] = useState(false)
  if (!logo || error) return <span className="text-xs font-bold text-slate-500 tracking-wide">{fallback}</span>
  return <img src={logo} alt={name} className="w-8 h-8 object-contain" onError={() => setError(true)} />
}

export default function DataCentre() {
  const { sources, removeSource, addSource } = useImport()
  const [hubspotConnected, setHubspotConnected] = useState(false)
  const [hubspotCounts, setHubspotCounts] = useState({ contacts: 0, companies: 0, deals: 0 })
  const [syncing, setSyncing] = useState(false)
  const [openCat, setOpenCat] = useState<string | null>(null)
  const [importing, setImporting] = useState<Integration | null>(null)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    fetch('/api/hubspot/status?account_id=demo-account')
      .then(r => r.json())
      .then(d => {
        if (d.connected) {
          setHubspotConnected(true)
          setHubspotCounts({ contacts: d.counts?.contacts || 0, companies: d.counts?.companies || 0, deals: d.counts?.deals || 0 })
        }
      })
      .catch(() => {})
  }, [])

  async function handleSync() {
    setSyncing(true)
    try {
      const res = await fetch('/api/hubspot/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: 'demo-account' }),
      })
      const data = await res.json()
      if (data.synced) setHubspotCounts({ contacts: data.synced.contacts, companies: data.synced.companies, deals: data.synced.deals })
    } catch {}
    setSyncing(false)
  }

  function isCatConnected(catId: string) {
    if (catId === 'crm') return hubspotConnected || sources.some(s => s.id === 'csv-crm')
    return integrations.filter(i => i.category === catId).some(ig =>
      ig.datasets?.some(ds => sources.some(s => s.id === `${ig.id}-${ds.label.toLowerCase().replace(/\s/g, '-')}`))
    ) || sources.some(s => s.id === `csv-${catId}`)
  }

  function handleConnect(ig: Integration) {
    if (!ig.datasets) return
    if (ig.id === 'hubspot') {
      window.location.href = '/api/auth/hubspot?account_id=demo-account'
      return
    }
    setImporting(ig)
  }

  function handleCsvUpload(file: File, catId: string, cat: any) {
    if (!file || !cat.csvFields.length) return
    setTimeout(() => {
      addSource({ id:`csv-${catId}`, name:`CSV — ${cat.csvLabel}`, type:catId as any, records:cat.csvRecords, label:cat.csvLabel, connectedAt:new Date().toISOString() })
    }, 1800)
  }

  return (
    <div className="space-y-2">
      {importing && importing.datasets && (
        <ImportModal source={{ id:importing.id, name:importing.name, icon:importing.fallback, datasets:importing.datasets }} onClose={() => setImporting(null)} onComplete={() => setImporting(null)} />
      )}

      {categories.map(cat => {
        const connected = isCatConnected(cat.id)
        const isOpen = openCat === cat.id
        const catIntegrations = integrations.filter(i => i.category === cat.id)
        const csvConnected = sources.some(s => s.id === `csv-${cat.id}`)
        const connectedIntegration = catIntegrations.find(ig =>
          ig.id !== 'hubspot' && ig.datasets?.some(ds =>
            sources.some(s => s.id === `${ig.id}-${ds.label.toLowerCase().replace(/\s/g, '-')}`)
          )
        )

        return (
          <div key={cat.id} className="border border-slate-700/50 rounded-xl overflow-hidden">
            {/* Row header — always visible */}
            <button
              onClick={() => setOpenCat(isOpen ? null : cat.id)}
              className={`w-full flex items-center justify-between px-5 py-3.5 transition-colors text-left ${
                isOpen ? 'bg-slate-800/60' : 'bg-slate-800/30 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                {connected
                  ? <CheckCircle size={15} className="text-teal-500 flex-shrink-0" />
                  : <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-600 flex-shrink-0" />
                }
                <span className="text-sm font-bold text-white">{cat.label}</span>
                {connected && cat.id === 'crm' && hubspotConnected && (
                  <span className="text-xs text-slate-400">HubSpot · {hubspotCounts.contacts} contacts · {hubspotCounts.companies} companies · {hubspotCounts.deals} deals</span>
                )}
                {connected && cat.id === 'crm' && !hubspotConnected && (
                  <span className="text-xs text-slate-400">CSV imported</span>
                )}
                {connected && cat.id !== 'crm' && connectedIntegration && (
                  <span className="text-xs text-slate-400">{connectedIntegration.name} connected</span>
                )}
                {connected && csvConnected && cat.id !== 'crm' && (
                  <span className="text-xs text-slate-400">CSV imported</span>
                )}
                {!connected && (
                  <span className="text-xs text-slate-500">{cat.description}</span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {connected && !isOpen && (
                  <span className="text-xs text-teal-400 font-medium">Connected</span>
                )}
                {!connected && !isOpen && (
                  <span className="text-xs text-amber-400 font-medium">Not connected</span>
                )}
                {isOpen ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
              </div>
            </button>

            {/* Expanded content */}
            {isOpen && (
              <div className="border-t border-slate-700/50 p-5 bg-slate-900/30">

                {/* CRM — HubSpot connected summary */}
                {cat.id === 'crm' && hubspotConnected && (
                  <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm ring-2 ring-teal-500 mb-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 flex-shrink-0">
                      <IntegrationLogo logo="https://cdn.worldvectorlogo.com/logos/hubspot-1.svg" fallback="HS" name="HubSpot" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-gray-900 text-sm">HubSpot</p>
                        <span className="flex items-center gap-1 text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100 font-medium">
                          <CheckCircle size={10} /> Connected
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{hubspotCounts.contacts} contacts · {hubspotCounts.companies} companies · {hubspotCounts.deals} deals</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={handleSync} disabled={syncing}
                        className="flex items-center gap-1.5 text-xs font-medium text-teal-600 border border-teal-300 bg-teal-50 rounded-lg px-3 py-1.5 hover:bg-teal-100 transition-colors disabled:opacity-50">
                        <RefreshCw size={11} className={syncing ? 'animate-spin' : ''} />
                        {syncing ? 'Syncing...' : 'Re-sync'}
                      </button>
                      <button onClick={() => setHubspotConnected(false)}
                        className="flex items-center gap-1.5 text-xs font-medium text-red-400 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors">
                        <Unlink size={11} /> Disconnect
                      </button>
                    </div>
                  </div>
                )}

                {/* CSV connected summary */}
                {csvConnected && (
                  <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm ring-2 ring-teal-500 mb-4">
                    <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-lg border border-teal-100 flex-shrink-0">📄</div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">CSV — {cat.csvLabel}</p>
                      <p className="text-xs text-gray-500">{cat.csvRecords} records imported</p>
                    </div>
                    <button onClick={() => removeSource(`csv-${cat.id}`)}
                      className="flex items-center gap-1.5 text-xs font-medium text-red-400 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors">
                      <Unlink size={11} /> Disconnect
                    </button>
                  </div>
                )}

                {/* Show integration cards only if not connected */}
                {!connected && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {catIntegrations.map(ig => (
                        <div key={ig.id} className="bg-white rounded-2xl p-4 flex flex-col shadow-sm hover:shadow-md transition-all">
                          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 mb-3">
                            <IntegrationLogo logo={ig.logo} fallback={ig.fallback} name={ig.name} />
                          </div>
                          <h3 className="font-bold text-gray-900 text-sm mb-1">{ig.name}</h3>
                          <p className="text-gray-500 text-xs leading-relaxed flex-1 mb-3">{ig.description}</p>
                          {ig.comingSoon ? (
                            <div className="text-xs text-gray-400 border border-gray-200 rounded-xl px-3 py-2 text-center">Coming soon</div>
                          ) : (
                            <button onClick={() => handleConnect(ig)} className="flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl px-3 py-2 transition-colors w-full">
                              <Plus size={13} /> Connect
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {cat.csvFields.length > 0 && (
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-1 h-px bg-slate-700" />
                          <span className="text-xs text-slate-500 font-medium">or upload a file instead</span>
                          <div className="flex-1 h-px bg-slate-700" />
                        </div>
                        <div className="bg-white rounded-2xl p-4 border-2 border-dashed border-gray-200 hover:border-teal-400 cursor-pointer transition-all"
                          onClick={() => fileRefs.current[cat.id]?.click()}>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-lg border border-gray-100">📄</div>
                            <div className="flex-1">
                              <p className="font-bold text-gray-900 text-sm mb-0.5">Upload CSV or Google Sheet export</p>
                              <p className="text-xs text-gray-500">Expected: {cat.csvFields.slice(0,5).join(', ')}{cat.csvFields.length > 5 ? '...' : ''}</p>
                            </div>
                            <button className="flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-700 hover:bg-slate-600 rounded-lg px-3 py-2"
                              onClick={e => { e.stopPropagation(); fileRefs.current[cat.id]?.click() }}>
                              <Upload size={12} /> Upload
                            </button>
                          </div>
                          <input
                            ref={el => { fileRefs.current[cat.id] = el }}
                            type="file" accept=".csv,.xlsx" className="hidden"
                            onChange={e => { if (e.target.files?.[0]) handleCsvUpload(e.target.files[0], cat.id, cat) }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Coming soon categories */}
                {(cat.id === 'outreach' || cat.id === 'signals') && (
                  <div className="text-center py-4">
                    <p className="text-xs text-slate-500">Integrations coming soon — stay tuned.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
