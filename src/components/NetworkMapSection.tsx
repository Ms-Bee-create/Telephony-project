import React, { useState } from 'react';
import { GLOBAL_EDGE_POPS } from '../data/mockPlatformData';
import { EdgePoP } from '../types/platform';
import { Network, Server, ArrowUpRight, CheckCircle2, Activity } from 'lucide-react';

export const NetworkMapSection: React.FC = () => {
  const [selectedPoP, setSelectedPoP] = useState<EdgePoP>(GLOBAL_EDGE_POPS[0]);
  const [interconnectFilter, setInterconnectFilter] = useState<'all' | 'aws' | 'gcp' | 'azure'>('all');

  return (
    <section className="py-12 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono text-cyan-400 mb-1">
              Autonomous System AS64512 · Global Fiber Infrastructure
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Private IP Backbone & Carrier-Grade Edge PoPs
            </h2>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              Traffic never touches the public internet. Calls, SMS, and Voice AI audio streams travel over dedicated DWDM fiber cross-connects with sub-millisecond jitter.
            </p>
          </div>

          {/* Cloud Interconnect Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium self-start md:self-auto">
            <span className="px-2 text-slate-400 font-mono text-[11px]">Direct Connect:</span>
            <button
              onClick={() => setInterconnectFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                interconnectFilter === 'all' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Cloud
            </button>
            <button
              onClick={() => setInterconnectFilter('aws')}
              className={`px-2.5 py-1 rounded transition-colors ${
                interconnectFilter === 'aws' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              AWS Direct
            </button>
            <button
              onClick={() => setInterconnectFilter('gcp')}
              className={`px-2.5 py-1 rounded transition-colors ${
                interconnectFilter === 'gcp' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Google Cloud
            </button>
            <button
              onClick={() => setInterconnectFilter('azure')}
              className={`px-2.5 py-1 rounded transition-colors ${
                interconnectFilter === 'azure' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Azure Express
            </button>
          </div>
        </div>

        {/* Global Topology Visual Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Visual Schematic Box */}
          <div className="lg:col-span-8 bg-slate-900/80 rounded-xl border border-slate-800 p-6 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-white">Global Edge Routing Matrix</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                All 68 Transatlantic & Transpacific Paths Active
              </span>
            </div>

            {/* Interactive PoP Grid Buttons */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {GLOBAL_EDGE_POPS.map((pop) => {
                const isSelected = selectedPoP.id === pop.id;
                return (
                  <button
                    key={pop.id}
                    onClick={() => setSelectedPoP(pop)}
                    className={`p-3.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-white">{pop.name}</span>
                      <span className="text-xs font-mono font-medium tabular-nums text-cyan-400">
                        {pop.latencyMs}ms
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-slate-400 truncate">{pop.facility}</div>
                    <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>{pop.capacityGbps} Gbps Core</span>
                      <span>{pop.directBgpPeers} BGP Peers</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Interactive Fiber Trunk Telemetry */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-950/60 rounded border border-slate-800/60">
                <div className="text-slate-400 font-mono">BGP Autonomous System</div>
                <div className="mt-1 font-mono text-sm text-white font-semibold">AS64512 (AETHERIS-NET)</div>
                <div className="mt-0.5 text-slate-400">Direct carrier peering with Tier-1 telcos</div>
              </div>
              <div className="p-3 bg-slate-950/60 rounded border border-slate-800/60">
                <div className="text-slate-400 font-mono">Jitter Suppression</div>
                <div className="mt-1 font-mono text-sm text-emerald-400 font-semibold">&lt; 0.4 ms</div>
                <div className="mt-0.5 text-slate-400">Deterministic hardware pacing</div>
              </div>
              <div className="p-3 bg-slate-950/60 rounded border border-slate-800/60">
                <div className="text-slate-400 font-mono">Anycast Convergence</div>
                <div className="mt-1 font-mono text-sm text-cyan-400 font-semibold">BGP Anycast Sub-second</div>
                <div className="mt-0.5 text-slate-400">Auto-routes to closest voice gateway</div>
              </div>
            </div>
          </div>

          {/* Selected PoP Detail Card */}
          <div className="lg:col-span-4 bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-white">PoP Architecture</span>
                </div>
                <span className="text-xs font-mono text-cyan-400 uppercase">{selectedPoP.id}</span>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-bold text-white">{selectedPoP.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedPoP.city}, {selectedPoP.country}</p>
              </div>

              <div className="mt-5 space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Tier-4 Facility</span>
                  <span className="text-slate-200 font-medium text-right">{selectedPoP.facility}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Core Network Capacity</span>
                  <span className="font-mono tabular-nums text-white">{selectedPoP.capacityGbps} Gbps</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Carrier Interconnects</span>
                  <span className="font-mono tabular-nums text-white">{selectedPoP.directBgpPeers} BGP sessions</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Opus RTP Latency</span>
                  <span className="font-mono tabular-nums text-cyan-400 font-semibold">{selectedPoP.latencyMs} ms RTT</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Cloud Cross-Connect</span>
                  <span className="text-emerald-400">AWS / GCP / Azure 100G Direct</span>
                </div>
              </div>

              <div className="mt-5 p-3 rounded bg-slate-950 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">SIP Edge Proxy Endpoint</div>
                <div className="mt-1 font-mono text-xs text-cyan-300 break-all">
                  sip:{selectedPoP.id}.edge.aetheris.network:5061
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero public hops to local PSTN gateways</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
