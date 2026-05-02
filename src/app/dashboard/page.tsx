'use client'
import { useState, useEffect } from 'react'
import ICPProfile from '../components/ICPProfile'
import RecoverTab from '../components/RecoverTab'
import GenerateTab from '../components/GenerateTab'
import DataCentre from '../components/DataCentre'
import AccelerateTab from '../components/AccelerateTab'
import ProfitMatrix from '../components/ProfitMatrix'
import { ImportProvider, useImport } from '../context/ImportContext'
import { ChevronDown, ChevronUp } from 'lucide-react'

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

  function StatusPill({ label, connected }: { label: string; connected: boolean }) {
    return (
      <span className={`flex items-center gap-1.5 text-xs font-medium ${connected ? 'text-teal-400' : 'text-slate-500'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-teal-400' : 'bg-slate-600'}`} />
        {label}
        {connected ? <span className="text-teal-500">✓</span> : <span className="text-slate-600">—</span>}
      </span>
    )
  }

  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between px-6 py-2.5 border-b transition-colors ${
        isOpen
          ? 'bg-slate-800/60 border-slate-700'
          : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/30'
      }`}
    >
      <div className="flex items-center gap-6">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Data Centre</span>
        <div className="flex items-center gap-5">
          <StatusPill label="CRM" connected={crmConnected} />
          <StatusPill label="Billing" connected={billingConnected} />
          <StatusPill label="CS" connected={csConnected} />
        </div>
        {!crmConnected && (
          <span className="text-xs text-amber-400 animate-pulse">— connect your data to unlock all agents</span>
        )}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <span>{isOpen ? 'Close' : 'Manage'}</span>
        {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </div>
    </button>
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

      {/* Data Centre bar */}
      <div className="max-w-6xl mx-auto px-0">
        <DataCentreBar isOpen={showDataCentre} onToggle={() => setShowDataCentre(!showDataCentre)} />
      </div>

      {/* Data Centre expanded */}
      {showDataCentre && (
        <div className="border-b border-slate-800 bg-slate-900/60">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <DataCentre />
          </div>
        </div>
      )}

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
