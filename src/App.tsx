import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { NetworkMapSection } from './components/NetworkMapSection';
import { VoiceSipSection } from './components/VoiceSipSection';
import { VoiceAiAgentsSection } from './components/VoiceAiAgentsSection';
import { MessagingVideoSection } from './components/MessagingVideoSection';
import { WirelessIotSection } from './components/WirelessIotSection';
import { GpuInferenceSection } from './components/GpuInferenceSection';
import { HipaaComplianceSection } from './components/HipaaComplianceSection';
import { ApiCodeModal } from './components/ApiCodeModal';
import { Footer } from './components/Footer';
import { PhoneCall, Bot, MessageSquare, Wifi, Cpu, ArrowRight, ShieldCheck, Zap, Cloud } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'voice-sip' | 'voice-ai' | 'messaging' | 'iot' | 'gpu' | 'hipaa'>('overview');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  const handleSelectTab = (tab: 'overview' | 'voice-sip' | 'voice-ai' | 'messaging' | 'iot' | 'gpu' | 'hipaa') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Universal Top Bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'overview' && (
          <>
            <HeroSection onSelectFeature={handleSelectTab} />

            {/* Google Cloud BAA Verified Banner for Healthcare & Medical Billing */}
            <div className="bg-emerald-950/40 border-y border-emerald-500/30 py-3">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">Google Cloud BAA Verified Active:</span>{' '}
                    <span className="text-emerald-200">
                      Cloud Run, Gemini AI & KMS operate under your Google Cloud Business Associate Agreement with Zero Customer Data Retention for training.
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleSelectTab('hipaa')}
                  className="self-start sm:self-auto px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/40 hover:bg-emerald-500/20 text-emerald-300 font-mono text-[11px] whitespace-nowrap transition-colors"
                >
                  View BAA & Safeguards →
                </button>
              </div>
            </div>

            <NetworkMapSection />

            {/* Feature Spotlight Bento: Highlighting each of the 5 pillars with generated assets */}
            <section className="py-16 border-b border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10">
                  <div className="text-xs font-mono text-cyan-400 mb-1">
                    Unified Autonomous Core · 5 Infrastructure Pillars
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Engineered for Sub-Millisecond Precision
                  </h2>
                  <p className="mt-1 text-sm text-slate-300 max-w-2xl">
                    Every service runs directly on our bare-metal edge network, bypassing transit intermediaries to minimize packet loss and conversational latency.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Card 1: Voice & SIP Trunking */}
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                        <PhoneCall className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-white">Voice & Elastic SIP Trunking</h3>
                      <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                        Carrier-grade voice APIs, Opus 48kHz HD audio, global number portability with LRN dipping, and STIR/SHAKEN Level-A call signing.
                      </p>
                      <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1">
                        <div>· TLS 1.3 & SRTP encryption</div>
                        <div>· Automated PSTN failover</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectTab('voice-sip')}
                      className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <span>Explore SIP Trunking</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card 2: Voice AI Agents with Waveform image */}
                  <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-colors">
                    <div className="h-32 relative bg-slate-950 overflow-hidden">
                      <img
                        src="/src/assets/images/voice_ai_acoustic_telemetry_1793683528378.jpg"
                        alt="Voice AI acoustic telemetry"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    </div>
                    <div className="p-6 pt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-4 h-4 text-cyan-400" />
                        <h3 className="text-base font-bold text-white">Autonomous Voice AI Agents</h3>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        No-code conversational builder with real-time bidirectional WebSocket streaming, barge-in detection, and natural backchanneling.
                      </p>
                      <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1">
                        <div>· Sub-120ms conversational loop</div>
                        <div>· Powered by Gemini 3.8 Flash</div>
                      </div>
                      <button
                        onClick={() => handleSelectTab('voice-ai')}
                        className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <span>Launch Voice Agent Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Card 3: Messaging & Video */}
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-white">SMS / MMS & WebRTC Video</h3>
                      <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                        High-throughput 10DLC messaging with automated carrier brand registration, and WebRTC SFU video rooms with AV1 simulcast.
                      </p>
                      <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1">
                        <div>· 10DLC Tier-1 direct delivery</div>
                        <div>· SFU 500+ participant rooms</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectTab('messaging')}
                      className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <span>Explore Messaging & Video</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card 4: Wireless IoT Connectivity with eSIM image */}
                  <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-colors">
                    <div className="h-32 relative bg-slate-950 overflow-hidden">
                      <img
                        src="/src/assets/images/iot_cellular_embedded_sim_1793683528738.jpg"
                        alt="Aetheris cellular IoT eSIM chip"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    </div>
                    <div className="p-6 pt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Wifi className="w-4 h-4 text-cyan-400" />
                        <h3 className="text-base font-bold text-white">Wireless IoT & Cellular eSIMs</h3>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Global cellular connectivity across 190+ countries with eUICC remote provisioning, multi-IMSI auto-roaming, and private APN VPC routing.
                      </p>
                      <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1">
                        <div>· Solderable MFF2 industrial chips</div>
                        <div>· Real-time data quota caps</div>
                      </div>
                      <button
                        onClick={() => handleSelectTab('iot')}
                        className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <span>Manage IoT Fleet</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Card 5: Edge GPU Inference with GPU photo */}
                  <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-colors lg:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-12 h-full">
                      <div className="sm:col-span-5 relative bg-slate-950 overflow-hidden min-h-[160px]">
                        <img
                          src="/src/assets/images/gpu_cluster_accelerator_1793683528979.jpg"
                          alt="Aetheris GPU accelerator"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900 hidden sm:block" />
                      </div>
                      <div className="sm:col-span-7 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Cpu className="w-4 h-4 text-cyan-400" />
                            <h3 className="text-base font-bold text-white">Serverless GPU & Edge AI Inference</h3>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Run open-weight models (Llama 3.3, DeepSeek V3 MoE, Whisper-v3) with usage-based billing. Tight audio integration enables sub-85ms voice-to-voice loops without GPU idle costs.
                          </p>
                          <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                            <div>· H100 SXM5 & H200 pools</div>
                            <div>· Sub-48ms TTFT inference</div>
                            <div>· Scale to zero pricing</div>
                            <div>· OpenAI SDK compatible API</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleSelectTab('gpu')}
                          className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          <span>Run GPU Benchmark & Profiler</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'voice-sip' && <VoiceSipSection />}
        {activeTab === 'voice-ai' && <VoiceAiAgentsSection />}
        {activeTab === 'messaging' && <MessagingVideoSection />}
        {activeTab === 'iot' && <WirelessIotSection />}
        {activeTab === 'gpu' && <GpuInferenceSection />}
        {activeTab === 'hipaa' && <HipaaComplianceSection />}
      </main>

      {/* Developer API Code Modal */}
      <ApiCodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

      {/* Universal Footer */}
      <Footer
        onSelectTab={handleSelectTab}
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
      />
    </div>
  );
}
