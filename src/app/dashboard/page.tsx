'use client'
import { useState } from 'react'
import ICPProfile from '../components/ICPProfile'
import RecoverTab from '../components/RecoverTab'
import GenerateTab from '../components/GenerateTab'
import DataCentre from '../components/DataCentre'
import AccelerateTab from '../components/AccelerateTab'
import ProfitMatrix from '../components/ProfitMatrix'
import SourcesBar from '../components/SourcesBar'
import { ImportProvider } from '../context/ImportContext'

type Tab = 'data' | 'icp' | 'profit' | 'recover' | 'generate' | 'accelerate'

const tabs: { id: Tab; label: string; emoji: string }[] = [
  { id: 'data',       label: 'Data Centre',   emoji: '🗄️' },
  { id: 'icp',        label: 'ICP Profile',   emoji: '🎯' },
  { id: 'profit',     label: 'Profit Matrix', emoji: '📊' },
  { id: 'recover',    label: 'Recover',       emoji: '🔄' },
  { id: 'generate',   label: 'Generate',      emoji: '⚡' },
  { id: 'accelerate', label: 'Ignite',        emoji: '🔥' },
]

function DashboardInner() {
  const [activeTab, setActiveTab] = useState<Tab>('data')

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
          <span className="text-xs text-slate-500">Koreva · B2B SaaS</span>
          <div className="w-2 h-2 rounded-full bg-teal-500" />
        </div>
      </nav>

      {/* Tab bar */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex border-b border-slate-800">
          {tabs.map(tab => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ flex: '1 1 0' }}
                className={`flex items-center justify-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${
                  active
                    ? 'border-teal-500 text-white'
                    : 'border-transparent text-slate-500 hover:text-white'
                }`}
              >
                <span className="text-base leading-none">{tab.emoji}</span>
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-7">
        {activeTab !== 'data' && <SourcesBar />}
        {activeTab === 'data'       && <DataCentre />}
        {activeTab === 'icp'        && <ICPProfile />}
        {activeTab === 'profit'     && <ProfitMatrix />}
        {activeTab === 'recover'    && <RecoverTab />}
        {activeTab === 'generate'   && <GenerateTab />}
        {activeTab === 'accelerate' && <AccelerateTab />}
      </div>
    </div>
  )
}

export default function Dashboard() {
  return <ImportProvider><DashboardInner /></ImportProvider>
}
