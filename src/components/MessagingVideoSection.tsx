import React, { useState } from 'react';
import { MessageSquare, Video, Send, CheckCircle2, Copy, Check, Radio, Shield, Layers } from 'lucide-react';

export const MessagingVideoSection: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'messaging' | 'video'>('messaging');

  // Messaging Form State
  const [msgTo, setMsgTo] = useState('+1 (415) 800-4321');
  const [msgFrom, setMsgFrom] = useState('+1 (888) 998-AETH');
  const [msgBody, setMsgBody] = useState('Your Aetheris authentication code is 492-108. Valid for 10 minutes.');
  const [msgType, setMsgType] = useState<'SMS' | 'MMS'>('SMS');
  const [isSending, setIsSending] = useState(false);
  const [dispatchedLogs, setDispatchedLogs] = useState<any[]>([
    {
      id: 'msg_98f12a',
      to: '+1 (415) 800-4321',
      from: '+1 (888) 998-AETH',
      body: 'Your Aetheris appointment reminder is confirmed for 2:30 PM EST.',
      status: 'delivered',
      route: 'Direct 10DLC Tier-1 Interconnect',
      time: '10:14:02',
      cost: '$0.0039',
    },
  ]);

  // Video Room State
  const [roomName, setRoomName] = useState('aetheris-boardroom-402');
  const [videoCodec, setVideoCodec] = useState<'AV1' | 'VP9' | 'H.264'>('AV1');
  const [simulcastEnabled, setSimulcastEnabled] = useState(true);
  const [generatedToken, setGeneratedToken] = useState('aeth_vtok_live_891249fa09b88231c');
  const [copiedToken, setCopiedToken] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgBody.trim() || isSending) return;

    setIsSending(true);
    try {
      const res = await fetch('/api/messaging/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: msgTo, from: msgFrom, body: msgBody, type: msgType }),
      });
      const data = await res.json();
      setDispatchedLogs((prev) => [
        {
          id: data.id,
          to: data.to,
          from: data.from,
          body: data.body,
          status: data.status,
          route: data.carrierRoute,
          time: new Date().toLocaleTimeString(),
          cost: `$${data.costUsd.toFixed(4)}`,
        },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(generatedToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleGenerateRoom = () => {
    const token = `aeth_vtok_${roomName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Math.random().toString(36).substring(2, 8)}`;
    setGeneratedToken(token);
  };

  return (
    <section className="py-12 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono text-cyan-400 mb-1">
              Pillar 03 · Enterprise Messaging & Real-Time Video
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Scalable Messaging & WebRTC Video Engine
            </h2>
            <p className="mt-1 text-sm text-slate-300 max-w-3xl">
              High-throughput SMS & MMS with 10DLC carrier registration, smart global routing, and ultra-low latency WebRTC video rooms with SFU simulcast.
            </p>
          </div>

          {/* Sub-tab switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium self-start md:self-auto">
            <button
              onClick={() => setActiveSubTab('messaging')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                activeSubTab === 'messaging'
                  ? 'bg-cyan-500/10 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>SMS & MMS API</span>
            </button>
            <button
              onClick={() => setActiveSubTab('video')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                activeSubTab === 'video'
                  ? 'bg-cyan-500/10 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>WebRTC Video Rooms</span>
            </button>
          </div>
        </div>

        {activeSubTab === 'messaging' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Messaging Dispatch Sandbox */}
            <div className="lg:col-span-5 bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-base font-semibold text-white">REST API Dispatch Testbench</h3>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setMsgType('SMS')}
                    className={`px-2 py-0.5 rounded ${msgType === 'SMS' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-500'}`}
                  >
                    SMS
                  </button>
                  <button
                    type="button"
                    onClick={() => setMsgType('MMS')}
                    className={`px-2 py-0.5 rounded ${msgType === 'MMS' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-500'}`}
                  >
                    MMS
                  </button>
                </div>
              </div>

              <form onSubmit={handleSendMessage} className="mt-5 space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Destination Number (+E.164)</label>
                  <input
                    type="text"
                    value={msgTo}
                    onChange={(e) => setMsgTo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Sender ID / 10DLC Number</label>
                  <input
                    type="text"
                    value={msgFrom}
                    onChange={(e) => setMsgFrom(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <label className="font-medium text-slate-300">Message Content</label>
                    <span className="font-mono">{msgBody.length} chars · 1 segment</span>
                  </div>
                  <textarea
                    rows={3}
                    value={msgBody}
                    onChange={(e) => setMsgBody(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 leading-relaxed focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
                  <div className="flex justify-between">
                    <span>10DLC Trust Score:</span>
                    <span className="text-emerald-400 font-semibold">Tier-1 Approved (Brand Score 94/100)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carrier Encoding:</span>
                    <span className="font-mono text-slate-300">GSM 7-bit (Standard Latin)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? 'Dispatching...' : 'Dispatch Message (REST POST)'}</span>
                </button>
              </form>
            </div>

            {/* Right: Live Delivery Receipts & Logs */}
            <div className="lg:col-span-7 bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <h3 className="text-base font-semibold text-white">Live Delivery Receipts (DLR Stream)</h3>
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Tier-1 Handshake Verified
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {dispatchedLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-cyan-400">{log.id}</span>
                        <span className="text-emerald-400 font-semibold uppercase">{log.status}</span>
                      </div>
                      <p className="text-slate-200 text-xs">{log.body}</p>
                      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>To: {log.to}</span>
                        <span>Route: {log.route}</span>
                        <span>Cost: {log.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Webhook Delivery: <strong className="text-white">POST https://api.yourdomain.com/dlr</strong></span>
                <span className="font-mono text-slate-300">HTTP 200 OK</span>
              </div>
            </div>
          </div>
        ) : (
          /* WebRTC Video Room Sandbox */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-base font-semibold text-white">WebRTC Room Provisioner</h3>
                </div>
                <span className="text-xs font-mono text-cyan-400">SFU Engine</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Room Identifier</label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Video Codec & Encoding</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['AV1', 'VP9', 'H.264'] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setVideoCodec(c)}
                        className={`p-2 rounded border font-mono text-xs transition-colors ${
                          videoCodec === c
                            ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSimulcastEnabled(!simulcastEnabled)}
                    className="w-full p-3 rounded-lg border border-slate-800 bg-slate-950 text-left flex items-center justify-between"
                  >
                    <div>
                      <div className="text-slate-200 font-semibold">Simulcast Multi-layer Streams</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Transmits 1080p, 720p, and 360p adaptive tracks
                      </div>
                    </div>
                    <span className="font-mono text-cyan-400">{simulcastEnabled ? 'ON' : 'OFF'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateRoom}
                  className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors mt-2"
                >
                  Generate WebRTC Room Token
                </button>
              </div>
            </div>

            {/* Room Credentials & Topology display */}
            <div className="lg:col-span-7 bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-base font-semibold text-white">Active Room Architecture</h3>
                <span className="text-xs font-mono text-emerald-400">E2EE Ready</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3 text-xs">
                <div>
                  <span className="text-slate-400">WebRTC Client Token:</span>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedToken}
                      className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-cyan-300 select-all"
                    />
                    <button
                      onClick={handleCopyToken}
                      className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                      {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 text-slate-300">
                  <div>
                    <span className="text-slate-400 text-[11px]">SFU Edge Gateway:</span>
                    <div className="font-mono text-xs text-white">sfu.iad.aetheris.network</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Encryption:</span>
                    <div className="font-mono text-xs text-emerald-400">DTLS-SRTP (AES-256)</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Target Bitrate:</span>
                    <div className="font-mono text-xs text-white">2.5 Mbps (Adaptive)</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Sub-frame Latency:</span>
                    <div className="font-mono text-xs text-cyan-400">&lt; 35ms Glass-to-Glass</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-2">
                <div className="flex items-center gap-2 text-slate-300 font-semibold">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Selective Forwarding Unit (SFU) vs Peer-to-Peer</span>
                </div>
                <p className="leading-relaxed">
                  Unlike traditional mesh networks where CPU load scales quadratically, Aetheris SFU distributes video via our private fiber edge, allowing 500+ participants per room without client bottleneck.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
