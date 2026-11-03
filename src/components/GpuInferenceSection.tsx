import React, { useState, useEffect } from 'react';
import { GPU_MODELS } from '../data/mockPlatformData';
import { GpuModelSpec } from '../types/platform';
import { Cpu, Zap, Activity, Calculator, ArrowRight, Play, CheckCircle2, Shield, Layers } from 'lucide-react';

export const GpuInferenceSection: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<GpuModelSpec>(GPU_MODELS[0]);
  const [isProfiling, setIsProfiling] = useState(false);
  const [profileResult, setProfileResult] = useState<any>(null);

  // Pricing calculator state
  const [monthlyTokensMillions, setMonthlyTokensMillions] = useState(50);

  const handleRunBenchmark = async (model: GpuModelSpec) => {
    setIsProfiling(true);
    try {
      const res = await fetch('/api/gpu/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model.name,
          batchSize: 1,
          contextLength: 2048,
          quantization: 'FP8',
        }),
      });
      const data = await res.json();
      setProfileResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProfiling(false);
    }
  };

  useEffect(() => {
    handleRunBenchmark(selectedModel);
  }, [selectedModel]);

  // Audio Pipeline Latency Waterfall calculations
  const sttLatency = 18;
  const llmLatency = profileResult?.timeToFirstTokenMs || selectedModel.timeToFirstTokenMs;
  const ttsLatency = 12;
  const rtpTransport = 6;
  const totalAudioTurnLatency = sttLatency + llmLatency + ttsLatency + rtpTransport;

  return (
    <section className="py-12 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono text-cyan-400 mb-1">
              Pillar 05 · Serverless GPU & Edge AI Infrastructure
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              AI Inference & Dedicated GPU Clusters
            </h2>
            <p className="mt-1 text-sm text-slate-300 max-w-3xl">
              Execute open-weight models (Llama 3.3, DeepSeek V3, Whisper, Piper) on serverless H100 and H200 clusters. Co-located with our private fiber edge for instantaneous speech-to-speech audio loops.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 self-start md:self-auto">
            <CheckCircle2 className="w-4 h-4" />
            <span>NVLink 900 GB/s Interconnect Active</span>
          </div>
        </div>

        {/* 2-Column Split: Hardware Photo & Model Selector Left, Profiler & Audio Pipeline Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          {/* Left Column: GPU Hardware & Model Selection */}
          <div className="lg:col-span-5 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col justify-between">
            <div className="relative h-48 sm:h-52 bg-slate-950 overflow-hidden">
              <img
                src="/src/assets/images/gpu_cluster_accelerator_1793683528979.jpg"
                alt="Aetheris serverless edge GPU accelerator and liquid cooling manifold"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-white">Open-Weight Catalog</span>
                </div>
                <span className="text-xs font-mono text-cyan-400">FP8 & INT4 Kernel</span>
              </div>

              {/* Model selection list */}
              <div className="space-y-2">
                {GPU_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model)}
                    className={`w-full p-3 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                      selectedModel.id === model.id
                        ? 'bg-cyan-950/40 border-cyan-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-white">{model.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{model.architecture}</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-cyan-400 font-semibold">{model.tokensPerSec} tok/s</div>
                      <div className="text-[10px] text-slate-500">${model.pricePerMillionTokens}/M tok</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Profiler & Low-Latency Audio Pipeline */}
          <div className="lg:col-span-7 bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-base font-semibold text-white">Live Edge Inference Profiler</h3>
                </div>
                <button
                  onClick={() => handleRunBenchmark(selectedModel)}
                  disabled={isProfiling}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors disabled:opacity-60"
                >
                  <Play className={`w-3.5 h-3.5 ${isProfiling ? 'animate-spin' : ''}`} />
                  <span>{isProfiling ? 'Benchmarking...' : 'Re-run Benchmark'}</span>
                </button>
              </div>

              {/* Benchmark Metrics Grid */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400">Time to First Token</span>
                  <div className="mt-1 font-mono text-base font-bold tabular-nums text-cyan-400">
                    {profileResult?.timeToFirstTokenMs || selectedModel.timeToFirstTokenMs} ms
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Sub-50ms TTFT</span>
                </div>

                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400">Inference Speed</span>
                  <div className="mt-1 font-mono text-base font-bold tabular-nums text-white">
                    {profileResult?.tokensPerSecond || selectedModel.tokensPerSec} t/s
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Stream Throughput</span>
                </div>

                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400">VRAM Allocation</span>
                  <div className="mt-1 font-mono text-xs font-semibold text-slate-200 truncate">
                    {profileResult?.vramAllocation || selectedModel.vramRequired}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">H100 SXM5 / NVLink</span>
                </div>

                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400">Cold Start Pool</span>
                  <div className="mt-1 font-mono text-base font-bold tabular-nums text-emerald-400">
                    {profileResult?.coldStartTimeMs || selectedModel.coldStartTimeMs} ms
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Warm Standby Pool</span>
                </div>
              </div>
            </div>

            {/* Low-Latency Audio Integration Pipeline Waterfall */}
            <div className="pt-5 border-t border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-white">
                    End-to-End Voice AI Audio Waterfall
                  </span>
                </div>
                <span className="font-mono text-xs text-emerald-400 font-bold">
                  Total Conversational Loop: {totalAudioTurnLatency} ms
                </span>
              </div>

              {/* Waterfall bars */}
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>1. Inbound Voice Audio Streaming (Opus RTP to Edge)</span>
                    <span className="font-mono text-white">{rtpTransport} ms</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: '8%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>2. Speech-to-Text Transcription (Whisper-v3-Turbo Edge)</span>
                    <span className="font-mono text-white">{sttLatency} ms</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: '22%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>3. Reasoning & Intent Evaluation ({selectedModel.name})</span>
                    <span className="font-mono text-cyan-400 font-semibold">{llmLatency} ms TTFT</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-400 h-full rounded-full" style={{ width: '48%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>4. Neural Acoustic Text-to-Speech (Piper Fast-TTS)</span>
                    <span className="font-mono text-white">{ttsLatency} ms</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage-Based Cost Estimator */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Usage-Based Inference Pricing Calculator</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Scale to Zero · Billed per 1,000 tokens</span>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-xs">
            <div className="md:col-span-7 space-y-2">
              <div className="flex justify-between text-slate-300 font-medium">
                <span>Monthly Token Volume</span>
                <span className="font-mono tabular-nums text-cyan-400 font-bold text-sm">
                  {monthlyTokensMillions.toLocaleString()} Million Tokens
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="500"
                step="5"
                value={monthlyTokensMillions}
                onChange={(e) => setMonthlyTokensMillions(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>5M (Early Startup)</span>
                <span>100M (Growth Platform)</span>
                <span>500M+ (Enterprise Scale)</span>
              </div>
            </div>

            <div className="md:col-span-5 grid grid-cols-2 gap-3 text-center">
              <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[11px]">Aetheris Serverless Cost</span>
                <div className="mt-1 font-mono text-lg font-bold text-emerald-400">
                  ${(monthlyTokensMillions * selectedModel.pricePerMillionTokens).toFixed(2)}
                </div>
                <span className="text-[10px] text-slate-500">Zero idle charges</span>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[11px]">Dedicated H100 Node</span>
                <div className="mt-1 font-mono text-lg font-bold text-slate-400">
                  $1,332.00
                </div>
                <span className="text-[10px] text-slate-500">Fixed 24/7 reservation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
