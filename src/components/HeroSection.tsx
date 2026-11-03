import React from 'react';
import { ArrowRight, PhoneCall, Bot, MessageSquare, Wifi, Cpu, ShieldCheck, Zap } from 'lucide-react';

interface HeroSectionProps {
  onSelectFeature: (tab: 'voice-sip' | 'voice-ai' | 'messaging' | 'iot' | 'gpu') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectFeature }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split grid: Content left, Fiber Datacenter Media right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between py-2">
            <div>
              {/* Clean unboxed metadata kicker */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-cyan-400 mb-4">
                <span>Autonomous System AS64512</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>Tier-1 Carrier Telephony</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>Private IP Fiber Mesh</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>Sub-20ms Edge AI</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-2xl">
                Global Communications, Edge Compute & Real-Time Voice AI
              </h1>

              <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                Aetheris operates an international private IP network and carrier-grade telephony core. Route HD voice, deploy autonomous Voice AI agents, manage global cellular IoT SIMs, and execute serverless GPU inference with deterministic low latency.
              </p>

              {/* Action buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onSelectFeature('voice-ai')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-sm whitespace-nowrap"
                >
                  <Bot className="w-4 h-4" />
                  <span>Launch Voice AI Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onSelectFeature('voice-sip')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors whitespace-nowrap"
                >
                  <PhoneCall className="w-4 h-4 text-cyan-400" />
                  <span>Test SIP Trunking</span>
                </button>
              </div>
            </div>

            {/* Quick architectural pillar pills (interactive) */}
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">
                Integrated Carrier Services
              </span>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => onSelectFeature('voice-sip')}
                  className="flex items-center gap-2 p-2 rounded bg-slate-900/60 border border-slate-800/80 text-left hover:border-cyan-500/40 text-slate-300 hover:text-white transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">Programmable Voice & SIP</span>
                </button>
                <button
                  onClick={() => onSelectFeature('voice-ai')}
                  className="flex items-center gap-2 p-2 rounded bg-slate-900/60 border border-slate-800/80 text-left hover:border-cyan-500/40 text-slate-300 hover:text-white transition-colors"
                >
                  <Bot className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">Voice AI Streaming</span>
                </button>
                <button
                  onClick={() => onSelectFeature('messaging')}
                  className="flex items-center gap-2 p-2 rounded bg-slate-900/60 border border-slate-800/80 text-left hover:border-cyan-500/40 text-slate-300 hover:text-white transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">SMS / MMS & WebRTC</span>
                </button>
                <button
                  onClick={() => onSelectFeature('iot')}
                  className="flex items-center gap-2 p-2 rounded bg-slate-900/60 border border-slate-800/80 text-left hover:border-cyan-500/40 text-slate-300 hover:text-white transition-colors"
                >
                  <Wifi className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">Global Wireless IoT</span>
                </button>
                <button
                  onClick={() => onSelectFeature('gpu')}
                  className="flex items-center gap-2 p-2 rounded bg-slate-900/60 border border-slate-800/80 text-left hover:border-cyan-500/40 text-slate-300 hover:text-white transition-colors sm:col-span-2"
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">Serverless GPU & Audio Inference</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: High-fidelity Tier-4 datacenter fiber visual with subtle overlay */}
          <div className="lg:col-span-5 relative flex flex-col justify-end min-h-[360px] lg:min-h-full rounded-xl overflow-hidden border border-slate-800 group">
            <img
              src="/src/assets/images/network_datacenter_fiber_1793683527990.jpg"
              alt="Aetheris Tier-4 telecommunication edge datacenter server room and fiber optic infrastructure"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* In-photo telemetry overlay banner */}
            <div className="relative p-5 z-10">
              <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white">Equinix DC2 · Ashburn Backbone</span>
                </div>
                <span className="font-mono tabular-nums text-cyan-400">0.00% Packet Loss</span>
              </div>
              <p className="mt-2 text-xs text-slate-300 line-clamp-2">
                Carrier private interconnect with direct fiber rings to London, Frankfurt, Tokyo, and Singapore.
              </p>
            </div>
          </div>
        </div>

        {/* 4-column KPI strip below the hero split */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Edge Footprint</div>
            <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-white">68 PoPs</div>
            <div className="mt-0.5 text-xs text-slate-400">Direct carrier cross-connects</div>
          </div>
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Backbone Capacity</div>
            <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-white">120+ Tbps</div>
            <div className="mt-0.5 text-xs text-slate-400">Private multi-terabit IP mesh</div>
          </div>
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Audio AI Loop</div>
            <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-cyan-400">&lt; 85 ms</div>
            <div className="mt-0.5 text-xs text-slate-400">Speech-to-Speech latency</div>
          </div>
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Telephony SLA</div>
            <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-emerald-400">99.999%</div>
            <div className="mt-0.5 text-xs text-slate-400">Carrier five-nines contract</div>
          </div>
        </div>
      </div>
    </section>
  );
};
