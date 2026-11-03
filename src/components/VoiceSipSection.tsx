import React, { useState, useEffect } from 'react';
import { Phone, PhoneForwarded, PhoneOff, Search, ShieldCheck, ArrowRight, Activity, Radio, Volume2 } from 'lucide-react';
import { SipCallState } from '../types/platform';

export const VoiceSipSection: React.FC = () => {
  const [testNumber, setTestNumber] = useState('+1 (800) 555-0199');
  const [selectedRegion, setSelectedRegion] = useState('US-East');
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  // SIP Call Simulator state
  const [selectedCodec, setSelectedCodec] = useState<'Opus-HD' | 'G.722' | 'G.711u'>('Opus-HD');
  const [callState, setCallState] = useState<SipCallState>({
    status: 'idle',
    callId: '',
    fromNumber: '+1 (415) 790-0144',
    toNumber: '+1 (800) 555-0199',
    codec: 'Opus-HD (48 kHz / 64 kbps)',
    latencyMs: 14,
    jitterMs: 0.7,
    packetLoss: 0.0,
    durationSeconds: 0,
  });

  // Number lookup handler
  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLookingUp(true);
    try {
      const res = await fetch('/api/telephony/lookup-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ e164Number: testNumber, region: selectedRegion }),
      });
      const data = await res.json();
      setLookupResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLookingUp(false);
    }
  };

  // Initial lookup on mount
  useEffect(() => {
    handleLookup();
  }, []);

  // Call timer simulation
  useEffect(() => {
    let timer: any;
    if (callState.status === 'connected') {
      timer = setInterval(() => {
        setCallState((prev) => ({
          ...prev,
          durationSeconds: prev.durationSeconds + 1,
          latencyMs: Math.max(10, Math.min(22, prev.latencyMs + (Math.random() > 0.5 ? 1 : -1))),
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState.status]);

  const handleStartCall = () => {
    const id = `sip_${Math.random().toString(36).substring(2, 9)}`;
    setCallState((prev) => ({
      ...prev,
      callId: id,
      status: 'initiating',
      durationSeconds: 0,
      codec: selectedCodec === 'Opus-HD' ? 'Opus-HD (48 kHz / 64 kbps)' : selectedCodec === 'G.722' ? 'G.722 Wideband' : 'G.711u PSTN Standard',
    }));

    setTimeout(() => {
      setCallState((prev) => ({ ...prev, status: 'ringing' }));
    }, 700);

    setTimeout(() => {
      setCallState((prev) => ({ ...prev, status: 'connected' }));
    }, 1800);
  };

  const handleEndCall = () => {
    setCallState((prev) => ({ ...prev, status: 'terminated' }));
    setTimeout(() => {
      setCallState((prev) => ({ ...prev, status: 'idle', durationSeconds: 0 }));
    }, 1200);
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <section className="py-12 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <div className="text-xs font-mono text-cyan-400 mb-1">
            Pillar 01 · Programmable Telephony & SIP Core
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Voice & Elastic SIP Trunking
          </h2>
          <p className="mt-1 text-sm text-slate-300 max-w-3xl">
            Programmable voice APIs, carrier-grade HD voice via Opus 48kHz, global number portability with automated LRN dipping, and STIR/SHAKEN Level-A identity attestation.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Number Portability & Carrier Route Inspector */}
          <div className="lg:col-span-6 bg-slate-900 rounded-xl border border-slate-800 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-semibold text-white">Global Number Portability & LRN Lookup</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">REST API Ready</span>
            </div>

            <form onSubmit={handleLookup} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Phone Number (+E.164 format)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testNumber}
                    onChange={(e) => setTestNumber(e.target.value)}
                    placeholder="+1 (800) 555-0199"
                    className="flex-1 px-3 py-2 text-sm font-mono bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    disabled={isLookingUp}
                    className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors disabled:opacity-60 whitespace-nowrap"
                  >
                    {isLookingUp ? 'Routing...' : 'Verify Route'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Originating Edge Region
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['US-East', 'US-West', 'EU-Central', 'APAC-Tokyo', 'APAC-Singapore', 'LATAM-SaoPaulo'].map((reg) => (
                    <button
                      key={reg}
                      type="button"
                      onClick={() => setSelectedRegion(reg)}
                      className={`px-2.5 py-1.5 text-xs font-mono rounded border transition-colors ${
                        selectedRegion === reg
                          ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {reg}
                    </button>
                  ))}
                </div>
              </div>
            </form>

            {/* Lookup result display */}
            {lookupResult && (
              <div className="mt-5 pt-4 border-t border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Carrier Registry Status</span>
                  <span className="text-emerald-400 font-medium">{lookupResult.portabilityStatus}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Local Routing Number (LRN)</span>
                  <span className="font-mono text-white">{lookupResult.localRoutingNumber}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Direct Carrier PoP</span>
                  <span className="text-slate-200">{lookupResult.edgePoP}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Peering Latency</span>
                  <span className="font-mono tabular-nums text-cyan-400 font-semibold">{lookupResult.latencyMs} ms RTT</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Transport Security</span>
                  <span className="text-slate-300">{lookupResult.encryption}</span>
                </div>
                <div className="mt-3 p-2.5 bg-slate-950 rounded border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400">Configured SIP URI</div>
                  <div className="font-mono text-xs text-cyan-300 truncate mt-0.5">{lookupResult.sipTrunkUri}</div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live SIP Call Session Simulator */}
          <div className="lg:col-span-6 bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-base font-semibold text-white">Carrier SIP Signaling Bench</h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400">Codec:</span>
                  {(['Opus-HD', 'G.722', 'G.711u'] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCodec(c)}
                      disabled={callState.status === 'connected'}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        selectedCodec === c ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Session State Console */}
              <div className="mt-5 p-4 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Caller ID</span>
                    <div className="font-mono text-sm text-white font-medium">{callState.fromNumber}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Destination</span>
                    <div className="font-mono text-sm text-cyan-400 font-medium">{callState.toNumber}</div>
                  </div>
                </div>

                {/* Signaling Status Badge */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Signaling State:{' '}
                    <span
                      className={`font-mono font-semibold ${
                        callState.status === 'connected'
                          ? 'text-emerald-400'
                          : callState.status === 'ringing'
                          ? 'text-amber-400'
                          : callState.status === 'initiating'
                          ? 'text-cyan-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {callState.status === 'idle' && 'SIP 200 Ready'}
                      {callState.status === 'initiating' && 'SIP 100 Trying (INVITE sent)'}
                      {callState.status === 'ringing' && 'SIP 180 Ringing (Carrier 183 Session Progress)'}
                      {callState.status === 'connected' && 'SIP 200 OK (RTP Media Streaming)'}
                      {callState.status === 'terminated' && 'SIP 200 OK (BYE Processed)'}
                    </span>
                  </div>
                  <div className="font-mono text-sm font-semibold tabular-nums text-white">
                    {formatDuration(callState.durationSeconds)}
                  </div>
                </div>

                {/* Live RTP Audio visualizer when connected */}
                {callState.status === 'connected' && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <div className="flex items-center gap-1.5 text-cyan-300">
                        <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                        <span>Bi-directional RTP Stream Active</span>
                      </div>
                      <span className="font-mono text-emerald-400">Opus 48 kHz / 20ms Frame</span>
                    </div>
                    {/* Simulated Waveform bars */}
                    <div className="flex items-end gap-1.5 h-10 px-2 py-1 bg-slate-900/60 rounded">
                      {[40, 75, 25, 90, 60, 45, 80, 95, 30, 65, 85, 50, 70, 35, 90, 60].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-cyan-400/80 rounded-xs transition-all duration-150"
                          style={{
                            height: `${Math.max(15, (h + (callState.durationSeconds % 3) * 15) % 100)}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Call telemetry statistics */}
              <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800">
                  <span className="text-slate-400">RTP Latency</span>
                  <div className="mt-1 font-mono text-sm font-semibold tabular-nums text-white">
                    {callState.status === 'connected' ? `${callState.latencyMs} ms` : '--'}
                  </div>
                </div>
                <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800">
                  <span className="text-slate-400">Jitter</span>
                  <div className="mt-1 font-mono text-sm font-semibold tabular-nums text-emerald-400">
                    {callState.status === 'connected' ? `${callState.jitterMs} ms` : '--'}
                  </div>
                </div>
                <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800">
                  <span className="text-slate-400">Packet Loss</span>
                  <div className="mt-1 font-mono text-sm font-semibold tabular-nums text-emerald-400">
                    {callState.status === 'connected' ? '0.00%' : '--'}
                  </div>
                </div>
              </div>
            </div>

            {/* Call Control Button */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              {callState.status === 'idle' || callState.status === 'terminated' ? (
                <button
                  onClick={handleStartCall}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Initiate Test SIP Call</span>
                </button>
              ) : (
                <button
                  onClick={handleEndCall}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-sm"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>Hang Up (Send SIP BYE)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
