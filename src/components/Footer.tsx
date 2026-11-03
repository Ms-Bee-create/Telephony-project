import React from 'react';
import { Radio } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: 'overview' | 'voice-sip' | 'voice-ai' | 'messaging' | 'iot' | 'gpu' | 'hipaa') => void;
  onOpenCodeModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenCodeModal }) => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold tracking-tight">
              <div className="w-6 h-6 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Radio className="w-3.5 h-3.5" />
              </div>
              <span>AETHERIS TELECOM & AI INFRASTRUCTURE</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Global private IP network and carrier-grade telephony core delivering programmable voice, conversational Voice AI streaming, cellular IoT, and low-latency GPU edge inference.
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-1">
              Autonomous System AS64512 · Tier-1 BGP Peering
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] font-mono mb-3">
              Carrier Telephony
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onSelectTab('voice-sip')} className="hover:text-white transition-colors">
                  Programmable Voice & SIP
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('voice-sip')} className="hover:text-white transition-colors">
                  Global Number Portability
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('voice-sip')} className="hover:text-white transition-colors">
                  HD Voice Opus Codec
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('voice-sip')} className="hover:text-white transition-colors">
                  STIR/SHAKEN Attestation
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] font-mono mb-3">
              Edge & AI Infrastructure
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onSelectTab('voice-ai')} className="hover:text-white transition-colors">
                  Voice AI Agent Studio
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('gpu')} className="hover:text-white transition-colors">
                  Serverless H100/H200 GPU
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('iot')} className="hover:text-white transition-colors">
                  Wireless IoT & eUICC SIMs
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('messaging')} className="hover:text-white transition-colors">
                  WebRTC SFU Video Rooms
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] font-mono mb-3">
              Developer Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenCodeModal} className="hover:text-white transition-colors">
                  REST & SDK Explorer
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('hipaa')} className="hover:text-emerald-300 text-emerald-400 font-semibold transition-colors">
                  HIPAA & Google Cloud BAA
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('overview')} className="hover:text-white transition-colors">
                  Global PoP Network Map
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('gpu')} className="hover:text-white transition-colors">
                  Usage Pricing Calculator
                </button>
              </li>
              <li>
                <span className="text-emerald-400">All 68 PoPs Operational</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            © 2026 Aetheris Infrastructure Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>SLA 99.999%</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onSelectTab('hipaa')}
              className="text-emerald-400 hover:underline"
            >
              Google Cloud BAA · HIPAA Compliant
            </button>
            <span aria-hidden="true">·</span>
            <span>TLS 1.3 / SRTP Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
