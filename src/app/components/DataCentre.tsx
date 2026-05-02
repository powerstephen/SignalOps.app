'use client'
import { useState, useEffect, useRef } from 'react'
import { CheckCircle, Plus, Upload, RefreshCw, Unlink } from 'lucide-react'
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
]

const integrations: Integration[] = [
  { id:'hubspot',    name:'HubSpot',    fallback:'HS', logo:'https://cdn.worldvectorlogo.com/logos/hubspot-1.svg', category:'crm',     description:'Sync contacts, deals, and pipeline data automatically.', datasets:[{label:'CRM Contacts',records:200,fields:['company','contact','deal_stage','deal_value','last_activity','status']}] },
  { id:'salesforce', name:'Salesforce', fallback:'SF', logo:'https://cdn.worldvectorlogo.com/logos/salesforce-2.svg', category:'crm',  description:'Connect your Salesforce org to sync leads, opportunities, and custom objects.', comingSoon:true },
  { id:'attio',      name:'Attio',      fallback:'AT', logo:'/attio.png',     category:'crm',     description:'Powerful CRM integration to manage relationships and track deal flow.', comingSoon:true },
  { id:'pipedrive',  name:'Pipedrive',  fallback:'PD', logo:'/pipedrive.png', category:'crm',     description:'Pull deal stages, contact activity, and pipeline data from Pipedrive.', comingSoon:true },
  { id:'stripe',     name:'Stripe',     fallback:'ST', logo:'/stripe.png',    category:'billing', description:'Connect Stripe to analyse real LTV, MRR, churn, and expansion revenue.', datasets:[{label:'Billing Data',records:20,fields:['customer','mrr','ltv','plan','churn_date','expansion_revenue']}] },
  { id:'chargebee',  name:'Chargebee',  fallback:'CB', logo:'/chargebee.png', category:'billing', description:'Import subscription billing data to power your best-customer ICP profile.', datasets:[{label:'Subscription Data',records:20,fields:['company','mrr','arr','plan','seats','renewal_date']}] },
  { id:'paddle',     name:'Paddle',     fallback:'PA', logo:'/paddle.png',    category:'billing', description:'Sync Paddle billing events and revenue data for LTV analysis.', comingSoon:true },
  { id:'intercom',   name:'Intercom',   fallback:'IC', logo:'/intercom.png',  category:'cs',      description:'Pull support ticket volume, type, and sentiment to identify high-maintenance accounts.', datasets:[{label:'CS Tickets',records:20,fields:['company','tickets','ticket_type','sentiment','response_time','health_trend']}] },
  { id:'zendesk',    name:'Zendesk',    fallback:'ZD', logo:'/zendesk.png',   category:'cs',      description:'Import CS ticket history to surface which customers are truly profitable.', datasets:[{label:'Support History',records:20,fields:['company','open_tickets','sentiment','risk_flags','csm']}] },
  { id:'freshdesk',  name:'Freshdesk',  fallback:'FD', logo:'/freshdesk.png', category:'cs',      description:'Connect Freshdesk to analyse support cost per customer.', comingSoon:true },
]

function IntegrationLogo({ logo, fallback, name }: { logo: string; fallback: string; name: string }) {
  const [error, setError] = useState(false)
  if (!logo || error) return <span className="text-xs font-bold text-slate-500 tracking-wide">{fallback}</span>
  return <img src={logo} alt={name} className="w-8 h-8 object-contain" onError={() => setError(true)} />
}

function ConnectedSummary({ 
  name, logo, fallback, counts, syncing, onSync, onDisconnect 
}: { 
  name: string; logo: string; fallback: string; 
  counts: { contacts: number; companies: number; deals: number }
  syncing: boolean; onSync: () => void; onDisconnect: () => void 
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm ring-2 ring-teal-500">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 flex-shrink-0">
          <IntegrationLogo logo={logo} fallback={fallback} name={name} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-bold text-gray-900 text-sm">{name}</p>
            <span className="flex items-center gap-1 text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100 font-medium">
              <CheckCircle size={10} /> Connected
            </span>
          </div>
          <p className="text-xs text-gray-500">
            {counts.contacts} contacts · {counts.companies} companies · {counts.deals} deals
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onSync}
            disabled={syncing}
            className="flex items-center gap-1.5 text-xs font-medium text-teal-600 border border-teal-300 bg-teal-50 rounded-lg px-3 py-1.5 hover:bg-teal-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={11} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Re-sync'}
          </button>
          <button
            onClick={onDisconnect}
            className="flex items-center gap-1.5 text-xs font-medium text-red-400 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors"
          >
            <Unlink size={11} />
            Disconnect
          </button>
        </div>
      </div>
    </div>
  )
}

function CategorySection({ 
  cat, hubspotConnected, hubspotCounts, syncing, onHubspotSync, onHubspotDisconnect, sources, removeSource, addSource
}: any) {
  const [importing, setImporting] = useState<Integration | null>(null)
  const [uploadingCsv, setUploadingCsv] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const catIntegrations = integrations.filter(i => i.category === cat.id)
  const csvConnected = sources.some((s: any) => s.id === `csv-${cat.id}`)

  const isHubspotCat = cat.id === 'crm'
  const hubspotConn = isHubspotCat && hubspotConnected

  const connectedIntegration = catIntegrations.find(ig => 
    ig.id !== 'hubspot' && ig.datasets?.some((ds: any) =>
      sources.some((s: any) => s.id === `${ig.id}-${ds.label.toLowerCase().replace(/\s/g, '-')}`)
    )
  )

  const isCatConnected = hubspotConn || !!connectedIntegration || csvConnected

  function handleConnect(ig: Integration) {
    if (!ig.datasets) return
    if (ig.id === 'hubspot') {
      window.location.href = '/api/auth/hubspot?account_id=demo-account'
      return
    }
    setImporting(ig)
  }

  function handleCsvUpload(file: File) {
    if (!file || !cat.csvFields.length) return
    setUploadingCsv(true)
    setTimeout(() => {
      addSource({ id:`csv-${cat.id}`, name:`CSV — ${cat.csvLabel}`, type:cat.id as any, records:cat.csvRecords, label:cat.csvLabel, connectedAt:new Date().toISOString() })
      setUploadingCsv(false)
    }, 1800)
  }

  return (
    <div className="border border-slate-700/50 rounded-2xl overflow-hidden">
      {importing && importing.datasets && (
        <ImportModal source={{ id:importing.id, name:importing.name, icon:importing.fallback, datasets:importing.datasets }} onClose={() => setImporting(null)} onComplete={() => setImporting(null)} />
      )}

      {/* Category header */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-800/40 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          {isCatConnected && <CheckCircle size={14} className="text-teal-500" />}
          <span className="text-sm font-bold text-white">{cat.label}</span>
          {!isCatConnected && <span className="text-xs text-slate-500">— {cat.description}</span>}
        </div>
        {isCatConnected && (
          <span className="text-xs text-teal-400 font-medium">Connected</span>
        )}
      </div>

      <div className="p-5">
        {/* If HubSpot connected and this is CRM — show summary only */}
        {hubspotConn && (
          <ConnectedSummary
            name="HubSpot"
            logo="https://cdn.worldvectorlogo.com/logos/hubspot-1.svg"
            fallback="HS"
            counts={hubspotCounts}
            syncing={syncing}
            onSync={onHubspotSync}
            onDisconnect={onHubspotDisconnect}
          />
        )}

        {/* If other integration connected — show summary */}
        {connectedIntegration && (
          <div className="bg-white rounded-2xl p-5 shadow-sm ring-2 ring-teal-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                <IntegrationLogo logo={connectedIntegration.logo} fallback={connectedIntegration.fallback} name={connectedIntegration.name} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-gray-900 text-sm">{connectedIntegration.name}</p>
                  <span className="flex items-center gap-1 text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100 font-medium">
                    <CheckCircle size={10} /> Connected
                  </span>
                </div>
              </div>
              <button
                onClick={() => connectedIntegration.datasets?.forEach((ds: any) => removeSource(`${connectedIntegration.id}-${ds.label.toLowerCase().replace(/\s/g, '-')}`))}
                className="flex items-center gap-1.5 text-xs font-medium text-red-400 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors"
              >
                <Unlink size={11} /> Disconnect
              </button>
            </div>
          </div>
        )}

        {/* CSV connected — show summary */}
        {csvConnected && (
          <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm ring-2 ring-teal-500">
            <div className="w-11 h-11 bg-teal-50 rounded-xl flex items-center justify-center text-xl border border-teal-100">📄</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-bold text-gray-900 text-sm">CSV — {cat.csvLabel}</p>
                <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-medium border border-teal-100">✓ Connected</span>
              </div>
              <p className="text-xs text-gray-500">{cat.csvRecords} records</p>
            </div>
            <button onClick={() => removeSource(`csv-${cat.id}`)} className="flex items-center gap-1.5 text-xs font-medium text-red-400 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors">
              <Unlink size={11} /> Disconnect
            </button>
          </div>
        )}

        {/* If nothing connected — show options */}
        {!isCatConnected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {catIntegrations.map(ig => (
                <div key={ig.id} className="bg-white rounded-2xl p-4 flex flex-col shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                      <IntegrationLogo logo={ig.logo} fallback={ig.fallback} name={ig.name} />
                    </div>
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
                <div className="bg-white rounded-2xl p-4 border-2 border-dashed border-gray-200 shadow-sm hover:border-teal-400 cursor-pointer transition-all" onClick={() => fileRef.current?.click()}>
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center text-xl border border-gray-100">📄</div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm mb-0.5">Upload CSV or Google Sheet export</p>
                      <p className="text-xs text-gray-500">Expected: {cat.csvFields.slice(0,5).join(', ')}{cat.csvFields.length > 5 ? '...' : ''}</p>
                    </div>
                    {uploadingCsv ? (
                      <div className="flex items-center gap-2 text-xs text-teal-600 flex-shrink-0">
                        <div className="w-3 h-3 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" /> Importing...
                      </div>
                    ) : (
                      <button className="flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-700 hover:bg-slate-600 rounded-lg px-3 py-2 flex-shrink-0" onClick={e => { e.stopPropagation(); fileRef.current?.click() }}>
                        <Upload size={12} /> Upload
                      </button>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={e => { if (e.target.files?.[0]) handleCsvUpload(e.target.files[0]) }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function DataCentre() {
  const { sources, removeSource, addSource } = useImport()
  const [hubspotConnected, setHubspotConnected] = useState(false)
  const [hubspotCounts, setHubspotCounts] = useState({ contacts: 0, companies: 0, deals: 0 })
  const [syncing, setSyncing] = useState(false)

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

  return (
    <div className="space-y-4">
      {categories.map(cat => (
        <CategorySection
          key={cat.id}
          cat={cat}
          hubspotConnected={hubspotConnected}
          hubspotCounts={hubspotCounts}
          syncing={syncing}
          onHubspotSync={handleSync}
          onHubspotDisconnect={() => setHubspotConnected(false)}
          sources={sources}
          removeSource={removeSource}
          addSource={addSource}
        />
      ))}
    </div>
  )
}
