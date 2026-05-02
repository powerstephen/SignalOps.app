'use client'
import { useState, useEffect } from 'react'
import ICPProfile from '../components/ICPProfile'
import RecoverTab from '../components/RecoverTab'
import GenerateTab from '../components/GenerateTab'
import DataCentre from '../components/DataCentre'
import AccelerateTab from '../components/AccelerateTab'
import ProfitMatrix from '../components/ProfitMatrix'
import SourcesBar from '../components/SourcesBar'
import { ImportProvider, useImport } from '../context/ImportContext'
import { Database } from 'lucide-react'

type Tab = 'icp' | 'profit' | 'recover' | 'generate' | 'accelerate' | 'deal'

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'icp',        label: 'ICP',      icon: '/agent-icp.png' },
  { id: 'profit',     label: 'Profit',   icon: '/agent-profit.png' },
  { id: 'recover',    label: 'Recover',  icon: '/agent-recover.png' },
  { id: 'generate',   label: 'Generate', icon: '/agent-generate.png' },
  { id: 'accelerate', label: 'Ignite',   icon: '/agent-ignite.png' },
  { id: 'deal',       label: 'Deal',     icon: '/agent-deal.png' },
]

function DataCentreButton({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) {
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
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold tracking-wide transition-all hover:opacity-90 ${
        isOpen
          ? 'border-teal-500/60 bg-teal-500/20 text-teal-300'
          : isComplete
            ? 'border-teal-500/40 bg-teal-500/10 text-teal-400'
            : connected > 0
              ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
              : 'border-amber-500/60 bg-amber-500/10 text-amber-400 animate-pulse'
      }`}
    >
      <Database size={13} />
      <span>Data Centre</span>
      <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-bold ${
        isComplete ? 'bg-teal-500/20 text-teal-300' : 'bg-amber-500/20 text-amber-300'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${isComplete ? 'bg-teal-400' : 'bg-amber-400'} ${!isComplete ? 'animate-pulse' : ''}`} />
        {connected}/{total}
      </span>
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
        <div className="flex items-center gap-4 flex-shrink-0">
          <img src="/logo.png" alt="SignalOps" className="h-12" />
          <DataCentreButton onClick={() => setShowDataCentre(!showDataCentre)} isOpen={showDataCentre} />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          <span className="text-base font-bold text-slate-200 tracking-widest uppercase">Revenue Intelligence Platform</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-teal-500" />
          <span className="text-xs text-slate-500">Live</span>
        </div>
      </nav>

      {/* Data Centre slide-down panel */}
      {showDataCentre && (
        <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-bold text-white">Data Centre</h2>
                <p className="text-xs text-slate-500 mt-0.5">Connect your data sources to unlock all six agents</p>
              </div>
              <button
                onClick={() => setShowDataCentre(false)}
                className="text-xs text-slate-500 hover:text-white border border-slate-700 px-3 py-1.5 rounded-lg transition-colors">
                Close ✕
              </button>
            </div>
            <DataCentre />
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex border-b border-slate-800">
          {tabs.map(tab => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setShowDataCentre(false) }}
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
        {!showDataCentre && <SourcesBar />}
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
