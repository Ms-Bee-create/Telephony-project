import React, { useState, useRef, useEffect } from 'react';
import { Bot, Mic, Send, Volume2, VolumeX, Sliders, Shield, Zap, Sparkles, Phone, PhoneOff, ArrowRight } from 'lucide-react';
import { PRESET_VOICE_AGENTS } from '../data/mockPlatformData';
import { VoiceAgentConfig, ChatMessage } from '../types/platform';

export const VoiceAiAgentsSection: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<VoiceAgentConfig>(PRESET_VOICE_AGENTS[0]);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(selectedAgent.systemPrompt);
  const [targetLatency, setTargetLatency] = useState(selectedAgent.targetLatencyMs);
  const [bargeIn, setBargeIn] = useState(selectedAgent.bargeInEnabled);
  const [backchannel, setBackchannel] = useState(selectedAgent.backchannelFrequency);

  // Live Call Session state
  const [isInCall, setIsInCall] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [userSpeechInput, setUserSpeechInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'agent',
      text: `Hello, thanks for calling ${selectedAgent.name}. How can I assist with your inquiry today?`,
      timestamp: '10:00:00',
      latencyMs: 120,
    },
  ]);
  const [waveformLevels, setWaveformLevels] = useState<number[]>([0.3, 0.5, 0.8, 0.4, 0.7, 0.9, 0.6, 0.3]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // When agent preset changes, update local states
  const handleSelectPreset = (agent: VoiceAgentConfig) => {
    setSelectedAgent(agent);
    setCustomPrompt(agent.systemPrompt);
    setTargetLatency(agent.targetLatencyMs);
    setBargeIn(agent.bargeInEnabled);
    setBackchannel(agent.backchannelFrequency);
    setMessages([
      {
        id: `m_${Date.now()}`,
        sender: 'agent',
        text: `Hello, this is ${agent.name}. How can I help you today?`,
        timestamp: new Date().toLocaleTimeString(),
        latencyMs: agent.targetLatencyMs,
      },
    ]);
  };

  // Speak agent response using browser Web Speech API
  const speakText = (text: string) => {
    if (!audioEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis not permitted:', e);
    }
  };

  // Send turn to backend
  const handleSendTurn = async (textToSend?: string) => {
    const text = textToSend || userSpeechInput;
    if (!text.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setUserSpeechInput('');
    setIsGenerating(true);

    try {
      const history = messages.slice(-4).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const response = await fetch('/api/ai/agent-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName: selectedAgent.name,
          promptRole: selectedAgent.role,
          systemPrompt: customPrompt,
          history,
          userSpeech: text.trim(),
          voicePersonality: selectedAgent.voicePersona,
        }),
      });

      const data = await response.json();
      const agentReply = data.agentResponse || 'Understood, routing your request.';
      const latency = data.latencyMs || targetLatency;

      if (data.audioWaveformProfile) {
        setWaveformLevels(data.audioWaveformProfile);
      }

      const agentMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        sender: 'agent',
        text: agentReply,
        timestamp: new Date().toLocaleTimeString(),
        latencyMs: latency,
      };

      setMessages((prev) => [...prev, agentMsg]);
      speakText(agentReply);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `a_err_${Date.now()}`,
        sender: 'agent',
        text: 'Aetheris Voice Gateway confirmed your instruction. Call transferred to human priority queue.',
        timestamp: new Date().toLocaleTimeString(),
        latencyMs: 140,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="py-12 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono text-cyan-400 mb-1">
              Pillar 02 · No-Code Conversational Voice AI Studio
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Real-Time Conversational Voice AI Agents
            </h2>
            <p className="mt-1 text-sm text-slate-300 max-w-3xl">
              Build, tune, and deploy low-latency voice assistants for inbound customer care and outbound calling. Native WebSocket audio streaming, barge-in interruption handling, and carrier SIP trunk integration.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 text-xs font-mono text-emerald-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>HIPAA BAA Mode: Active (Zero Retention)</span>
            </div>
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                audioEnabled
                  ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{audioEnabled ? 'Voice Audio Enabled' : 'Muted'}</span>
            </button>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-mono mr-1">Agent Templates:</span>
          {PRESET_VOICE_AGENTS.map((agent) => (
            <button
              key={agent.id}
              onClick={() => handleSelectPreset(agent)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                selectedAgent.id === agent.id
                  ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-xs'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {agent.name}
            </button>
          ))}
        </div>

        {/* Studio Grid: Config on Left, Live Simulator on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: No-Code Agent Configuration Studio */}
          <div className="lg:col-span-5 bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-semibold text-white">Voice Agent Parameters</h3>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-medium">Gemini 3.8 Flash Core</span>
            </div>

            {/* Agent Role & Persona */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Agent Role & Identity
                </label>
                <input
                  type="text"
                  value={selectedAgent.role}
                  onChange={(e) => setSelectedAgent({ ...selectedAgent, role: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Voice Acoustic Persona
                </label>
                <input
                  type="text"
                  value={selectedAgent.voicePersona}
                  onChange={(e) => setSelectedAgent({ ...selectedAgent, voicePersona: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-300">
                    System Instructions & Guidelines
                  </label>
                  <button
                    onClick={() => setIsEditingPrompt(!isEditingPrompt)}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    {isEditingPrompt ? 'Done Editing' : 'Customize Prompt'}
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  disabled={!isEditingPrompt}
                  className={`w-full px-3 py-2 text-xs bg-slate-950 border rounded-lg text-slate-300 leading-relaxed font-mono ${
                    isEditingPrompt ? 'border-cyan-400 text-white' : 'border-slate-800 opacity-90'
                  }`}
                />
              </div>
            </div>

            {/* Telephony Latency Budget & Barge-in Controls */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Target Latency Budget</span>
                  <span className="font-mono tabular-nums text-cyan-400 font-semibold">{targetLatency} ms</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="350"
                  step="10"
                  value={targetLatency}
                  onChange={(e) => setTargetLatency(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                  <span>Ultra-fast (100ms)</span>
                  <span>Carrier Standard (180ms)</span>
                  <span>Deep Reasoning (350ms)</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBargeIn(!bargeIn)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                    bargeIn
                      ? 'bg-cyan-950/40 border-cyan-400 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-semibold">Barge-in Interruption</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {bargeIn ? 'Active (Cut-through on speech)' : 'Disabled'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setBackchannel(backchannel === 'low' ? 'balanced' : backchannel === 'balanced' ? 'high' : 'low')
                  }
                  className="p-2.5 rounded-lg border border-slate-800 bg-slate-950 text-left text-xs text-slate-300 hover:border-slate-700 transition-colors"
                >
                  <div className="font-semibold">Backchanneling</div>
                  <div className="text-[10px] text-cyan-400 mt-0.5 font-mono uppercase">
                    {backchannel} (`|mhm|`, `|yeah|`)
                  </div>
                </button>
              </div>

              {/* Automated Telephony Tools / Actions */}
              <div className="pt-2 text-xs text-slate-400 space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Configured Webhook Actions:</span>
                </div>
                <div className="pl-5 text-[11px] space-y-1">
                  <div>· Human Escalation: <span className="font-mono text-slate-200">{selectedAgent.transferDestination}</span></div>
                  <div>· Post-call SMS: <span className="font-mono text-slate-200">{selectedAgent.smsFollowupTemplate}</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Voice Call Simulator */}
          <div className="lg:col-span-7 bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col h-[600px] justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{selectedAgent.name}</h3>
                    <div className="text-xs text-slate-400">
                      SIP Stream · Opus 48kHz HD Audio
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isInCall ? (
                    <button
                      onClick={() => setIsInCall(true)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Start Voice Call</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsInCall(false);
                        window.speechSynthesis?.cancel();
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-xs"
                    >
                      <PhoneOff className="w-3.5 h-3.5" />
                      <span>End Call</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Acoustic Spectrum Visualizer */}
              <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-mono text-slate-300">
                    {isGenerating ? 'Voice AI Synthesizing...' : isInCall ? 'Live RTP Audio Stream (Listening)' : 'Call Standby'}
                  </span>
                </div>
                {/* Dynamic waveform visualizer */}
                <div className="flex items-center gap-1 h-5">
                  {waveformLevels.map((lvl, idx) => (
                    <div
                      key={idx}
                      className="w-1 bg-cyan-400 rounded-xs transition-all duration-150"
                      style={{
                        height: isGenerating || isInCall ? `${Math.max(20, lvl * 100)}%` : '20%',
                        opacity: isInCall ? 1 : 0.4,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Conversation Transcript Area */}
            <div className="flex-1 my-4 overflow-y-auto pr-2 space-y-3.5 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 mb-1">
                    <span>{msg.sender === 'user' ? 'Caller' : selectedAgent.name}</span>
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                    {msg.latencyMs && (
                      <>
                        <span>·</span>
                        <span className="text-cyan-400">{msg.latencyMs} ms RTT</span>
                      </>
                    )}
                  </div>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-lg text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/30'
                        : 'bg-slate-950 border border-slate-800 text-slate-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono py-1">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Aetheris Speech-to-Speech Streaming...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Speech Input & Suggested Inquiries */}
            <div>
              {/* Quick suggestion prompt chips */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                <span className="text-[11px] text-slate-400 font-mono">Suggested Inquiries:</span>
                <button
                  type="button"
                  onClick={() => handleSendTurn('Can you verify my billing status and coverage for policy #9821?')}
                  className="px-2 py-0.5 text-[11px] bg-slate-950 text-slate-300 hover:text-white border border-slate-800 rounded transition-colors"
                >
                  "Verify billing status #9821"
                </button>
                <button
                  type="button"
                  onClick={() => handleSendTurn('What is the current SIP trunk capacity and failover setup?')}
                  className="px-2 py-0.5 text-[11px] bg-slate-950 text-slate-300 hover:text-white border border-slate-800 rounded transition-colors"
                >
                  "Check SIP trunk capacity"
                </button>
                <button
                  type="button"
                  onClick={() => handleSendTurn('Please connect me to Tier-2 emergency human dispatch.')}
                  className="px-2 py-0.5 text-[11px] bg-slate-950 text-slate-300 hover:text-white border border-slate-800 rounded transition-colors"
                >
                  "Connect to emergency human dispatch"
                </button>
              </div>

              {/* Chat Speech input form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendTurn();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={userSpeechInput}
                  onChange={(e) => setUserSpeechInput(e.target.value)}
                  placeholder={
                    isInCall
                      ? 'Type what you want to say to the voice agent...'
                      : 'Click "Start Voice Call" or type here to simulate caller speech...'
                  }
                  className="flex-1 px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={!userSpeechInput.trim() || isGenerating}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors disabled:opacity-40 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Turn</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
