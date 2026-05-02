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

type Tab = 'data' | 'icp' | 'profit' | 'recover' | 'generate' | 'accelerate'

const tabs: { id: Tab; label: string; icon?: string; emoji?: string }[] = [
  { id: 'icp',        label: 'ICP',       icon: '/agent-icp.png' },
  { id: 'profit',     label: 'Profit',    icon: '/agent-profit.png' },
  { id: 'recover',    label: 'Recover',   icon: '/agent-recover.png' },
  { id: 'generate',   label: 'Generate',  icon: '/agent-generate.png' },
  { id: 'accelerate', label: 'Ignite',    icon: '/agent-ignite.png' },
  { id: 'data',       label: 'Deal',      icon: '/agent-deal.png' },
]

function ConnectionStatus({ onClick }: { onClick: () => void }) {
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
  const isPartial = connected > 0 && connected < total
  const isEmpty = connected === 0

  return (
    <button onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all hover:opacity-80 ${
        isComplete ? 'border-teal-500/40 bg-teal-500/10 text-teal-400' :
        isPartial  ? 'border-amber-500/40 bg-amber-500/10 text-amber-400' :
                     'border-amber-500/60 bg-amber-500/10 text-amber-400 animate-pulse'
      }`}>
      <div className={`w-2 h-2 rounded-full ${
        isComplete ? 'bg-teal-400' : 'bg-amber-400'
      }`} />
      {connected}/{total} connected
      {isEmpty && <span className="ml-1 opacity-70">— start here</span>}
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
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 border border-slate-700 px-2 py-0.5 rounded">Demo</span>
          <ConnectionStatus onClick={() => setShowDataCentre(!showDataCentre)} />
        </div>
      </nav>

      {/* Data Centre slide-in panel */}
      {showDataCentre && (
        <div className="border-b border-slate-800 bg-slate-900/60">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white">Data Centre — connect your sources</h2>
              <button onClick={() => setShowDataCentre(false)}
                className="text-xs text-slate-500 hover:text-white border border-slate-700 px-3 py-1.5 rounded-lg transition-colors">
                Close ✕
              </button>
            </div>
            <DataCentre />
          </div>
        </div>
      )}

      {/* Tab bar — 6 agents */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex border-b border-slate-800">
          {tabs.map(tab => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setShowDataCentre(false) }}
                style={{ flex: '1 1 0' }}
                className={`relative flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors -mb-px whitespace-nowrap ${
                  active ? 'text-white' : 'text-slate-500 hover:text-white'
                }`}>
                {tab.icon
                  ? <img src={tab.icon} alt={tab.label} className="w-5 h-5 object-contain" />
                  : <span className="text-base leading-none">{tab.emoji}</span>
                }
                {tab.label}
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                    style={{ height: '3px', width: '80%', background: '#14b8a6' }} />
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
        {activeTab === 'data'       && <AccelerateTab />}
      </div>
    </div>
  )
}

export default function Dashboard() {
  return <ImportProvider><DashboardInner /></ImportProvider>
}
