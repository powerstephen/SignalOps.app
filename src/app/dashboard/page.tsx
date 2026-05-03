'use client'
import { useState, useEffect } from 'react'
import ICPProfile from '../components/ICPProfile'
import RecoverTab from '../components/RecoverTab'
import GenerateTab from '../components/GenerateTab'
import DataCentre from '../components/DataCentre'
import AccelerateTab from '../components/AccelerateTab'
import ProfitMatrix from '../components/ProfitMatrix'
import { ImportProvider, useImport } from '../context/ImportContext'
import { ChevronDown, ChevronUp, Database } from 'lucide-react'

type Tab = 'icp' | 'profit' | 'recover' | 'generate' | 'accelerate' | 'deal'

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'icp',        label: 'ICP',      icon: '/agent-icp.png' },
  { id: 'profit',     label: 'Profit',   icon: '/agent-profit.png' },
  { id: 'recover',    label: 'Recover',  icon: '/agent-recover.png' },
  { id: 'generate',   label: 'Generate', icon: '/agent-generate.png' },
  { id: 'accelerate', label: 'Ignite',   icon: '/agent-ignite.png' },
  { id: 'deal',       label: 'Deal',     icon: '/agent-deal.png' },
]

function DataCentreBar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const { sources } = useImport()
  const [hubspotConnected, setHubspotConnected] = useState(false)

  useEffect(() => {
    fetch('/api/hubspot/status?account_id=demo-account')
      .then(r => r.json())
      .then(d => { if (d.connected) setHubspotConnected(true) })
      .catch(() => {})
  }, [])

  const crmConnected = hubspotConnected || sources.some(s => s.id === 'csv-crm')
  const billingConnected = sources.some(s => s.id === 'csv-billing' || s.type === 'billing')
  const csConnected = sources.some(s => s.id === 'csv-cs' || s.type === 'cs')
  const connected = [crmConnected, billingConnected, csConnected].filter(Boolean).length
  const total = 3
  const isComplete = connected === total

  return (
    <div className="border-b border-slate-700/60 bg-slate-900/60">
      <div className="max-w-6xl mx-auto px-6">
        <button onClick={onToggle} className="w-full flex items-center gap-4 py-3">

          {/* Left pill — Data Centre + progress bars + count */}
          <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border flex-shrink-0 ${
            isComplete
              ? 'border-teal-500/30 bg-teal-500/10'
              : 'border-amber-500/30 bg-amber-500/10'
          }`}>
            <Database size={13} className={isComplete ? 'text-teal-400' : 'text-amber-400'} />
            <span className={`text-xs font-bold ${isComplete ? 'text-teal-400' : 'text-amber-400'}`}>
              Data Centre
            </span>
            <div className="flex items-center gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className={`h-1.5 w-6 rounded-full ${
                  i < connected
                    ? isComplete ? 'bg-teal-400' : 'bg-amber-400'
                    : 'bg-slate-600'
                }`} />
              ))}
            </div>
            <span className={`text-xs font-bold ${isComplete ? 'text-teal-400' : 'text-amber-400'}`}>
              {connected}/{total}
            </span>
          </div>

          {/* Three source pills spread across */}
          <div className="flex-1 grid grid-cols-3 gap-3">
            {[
              { label: 'CRM', connected: crmConnected },
              { label: 'Billing', connected: billingConnected },
              { label: 'CS', connected: csConnected },
            ].map(item => (
              <div key={item.label} className={`flex items-center justify-between px-4 py-1.5 rounded-lg border ${
                item.connected
                  ? 'border-teal-500/30 bg-slate-800/60'
                  : 'border-slate-700 bg-slate-800/40'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${item.connected ? 'bg-teal-400' : 'bg-slate-600'}`} />
                  <span className="text-xs font-semibold text-white">{item.label}</span>
                </div>
                {item.connected
                  ? <span className="text-xs text-teal-400 font-medium flex items-center gap-1">✓ Connected</span>
                  : <span className="text-xs text-amber-400 font-medium">Connect →</span>
                }
              </div>
            ))}
          </div>

          {/* Toggle */}
          <div className="flex items-center gap-1 text-xs text-slate-500 flex-shrink-0">
            {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </div>

        </button>
      </div>
    </div>
  )
}

function DashboardInner() {
  const [activeTab, setActiveTab] = useState<Tab>('icp')
  const [showDataCentre, setShowDataCentre] = useState(false)

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Nav */}
      <nav className="border-b border-slate-800 px-6 py-0 flex items-center justify-between h-16 relative">
        <div className="flex-shrink-0">
          <img src="/logo.png" alt="SignalOps" className="h-12" />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          <span className="text-base font-bold text-slate-200 tracking-widest uppercase">Revenue Intelligence Platform</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-teal-500" />
          <span className="text-xs text-slate-500">Live</span>
        </div>
      </nav>

      {/* Data Centre bar */}
      <DataCentreBar isOpen={showDataCentre} onToggle={() => setShowDataCentre(!showDataCentre)} />

      {/* Data Centre expanded */}
      {showDataCentre && (
        <div className="border-b border-slate-700/50 bg-slate-900/60">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <DataCentre />
          </div>
        </div>
      )}

      {/* Agent tab bar */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex border-b border-slate-800">
          {tabs.map(tab => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ flex: '1 1 0' }}
                className={`relative flex items-center justify-center gap-2 py-4 text-xs font-bold tracking-widest uppercase transition-colors -mb-px whitespace-nowrap ${
                  active ? 'text-teal-400' : 'text-slate-500 hover:text-teal-300'
                }`}
              >
                <img src={tab.icon} alt={tab.label} className="w-7 h-7 object-contain" />
                {tab.label}
                {active && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                    style={{ height: '3px', width: '80%', background: '#14b8a6' }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-7">
        {activeTab === 'icp'        && <ICPProfile />}
        {activeTab === 'profit'     && <ProfitMatrix />}
        {activeTab === 'recover'    && <RecoverTab />}
        {activeTab === 'generate'   && <GenerateTab />}
        {activeTab === 'accelerate' && <AccelerateTab />}
        {activeTab === 'deal'       && <AccelerateTab />}
      </div>
    </div>
  )
}

export default function Dashboard() {
  return <ImportProvider><DashboardInner /></ImportProvider>
}
