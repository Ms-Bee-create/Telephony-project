import React from 'react';
import { Radio, PhoneCall, Bot, MessageSquare, Cpu, Wifi, Code2, Globe, ShieldCheck } from 'lucide-react';

interface NavigationProps {
  activeTab: 'overview' | 'voice-sip' | 'voice-ai' | 'messaging' | 'iot' | 'gpu' | 'hipaa';
  setActiveTab: (tab: 'overview' | 'voice-sip' | 'voice-ai' | 'messaging' | 'iot' | 'gpu' | 'hipaa') => void;
  onOpenCodeModal: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  onOpenCodeModal,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Brand title, single element */}
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 text-left text-base font-bold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Radio className="w-4 h-4" />
            </div>
            <span>AETHERIS NETWORK</span>
          </button>

          {/* Zone 2: Single-line clean text links with subtle hover underlines */}
          <nav className="hidden xl:flex items-center gap-5 text-sm font-medium text-slate-300">
            <button
              onClick={() => setActiveTab('overview')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'overview'
                  ? 'border-cyan-400 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Network Overview
            </button>
            <button
              onClick={() => setActiveTab('voice-sip')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'voice-sip'
                  ? 'border-cyan-400 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Voice & SIP
            </button>
            <button
              onClick={() => setActiveTab('voice-ai')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'voice-ai'
                  ? 'border-cyan-400 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Voice AI Agents
            </button>
            <button
              onClick={() => setActiveTab('messaging')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'messaging'
                  ? 'border-cyan-400 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Messaging & Video
            </button>
            <button
              onClick={() => setActiveTab('iot')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'iot'
                  ? 'border-cyan-400 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Wireless IoT
            </button>
            <button
              onClick={() => setActiveTab('gpu')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'gpu'
                  ? 'border-cyan-400 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              GPU Compute
            </button>
            <button
              onClick={() => setActiveTab('hipaa')}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'hipaa'
                  ? 'border-emerald-400 text-emerald-300 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-emerald-300'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>HIPAA Compliance</span>
            </button>
          </nav>

          {/* Zone 3: Primary action + BAA quick badge */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('hipaa')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 rounded-md hover:border-emerald-400 transition-colors whitespace-nowrap"
              title="Click to view HIPAA Security Safeguards & Executed BAA"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>BAA Active · Zero Retention</span>
            </button>

            <button
              onClick={onOpenCodeModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 rounded-md hover:bg-cyan-900/40 hover:border-cyan-400 transition-colors whitespace-nowrap"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>API Explorer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Sub-navigation Bar */}
      <div className="xl:hidden border-t border-slate-900 bg-slate-950/95 overflow-x-auto px-4 py-2 flex items-center gap-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 ${
            activeTab === 'overview' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('voice-sip')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 ${
            activeTab === 'voice-sip' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Voice & SIP</span>
        </button>
        <button
          onClick={() => setActiveTab('voice-ai')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 ${
            activeTab === 'voice-ai' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Voice AI</span>
        </button>
        <button
          onClick={() => setActiveTab('messaging')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 ${
            activeTab === 'messaging' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Messaging</span>
        </button>
        <button
          onClick={() => setActiveTab('iot')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 ${
            activeTab === 'iot' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wifi className="w-3.5 h-3.5" />
          <span>IoT</span>
        </button>
        <button
          onClick={() => setActiveTab('gpu')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 ${
            activeTab === 'gpu' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>GPU Compute</span>
        </button>
        <button
          onClick={() => setActiveTab('hipaa')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 ${
            activeTab === 'hipaa' ? 'bg-emerald-500/20 text-emerald-300' : 'text-emerald-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>HIPAA Compliance</span>
        </button>
      </div>
    </header>
  );
};
