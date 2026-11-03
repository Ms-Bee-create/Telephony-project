import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Code2 } from 'lucide-react';

interface ApiCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiCodeModal: React.FC<ApiCodeModalProps> = ({ isOpen, onClose }) => {
  const [selectedLang, setSelectedLang] = useState<'curl' | 'typescript' | 'python' | 'go'>('curl');
  const [selectedEndpoint, setSelectedEndpoint] = useState<'voice' | 'voice-ai' | 'sms' | 'iot' | 'gpu'>('voice-ai');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const codeSnippets: Record<string, Record<string, string>> = {
    'voice-ai': {
      curl: `curl -X POST https://api.aetheris.network/v2/voice/agents/turn \\
  -H "Authorization: Bearer aeth_live_sec_991823" \\
  -H "X-Aetheris-HIPAA-BAA: true" \\
  -H "X-Aetheris-Zero-Retention: true" \\
  -H "X-Aetheris-GCP-BAA-Binding: AC-Medical-Billing" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_id": "agent_concierge_402",
    "call_control_id": "call_iad_8921b7",
    "caller_speech_text": "Verify patient coverage for AC Medical Billing",
    "target_latency_budget_ms": 150,
    "barge_in": true,
    "codec": "audio/opus",
    "phi_redaction": true
  }'`,
      typescript: `import { AetherisClient } from '@aetheris/telephony-sdk';

const client = new AetherisClient({
  apiKey: process.env.AETHERIS_API_KEY,
  edgeRegion: 'iad-ashburn'
});

const session = await client.voiceAI.startCall({
  to: '+18005550199',
  from: '+14157900144',
  agentId: 'agent_concierge_402',
  streamAudio: true,
  onBargeIn: () => console.log('Caller interrupted playback'),
  onTranscript: (turn) => console.log('Turn Latency:', turn.latencyMs)
});`,
      python: `from aetheris import AetherisClient

client = AetherisClient(api_key="aeth_live_sec_991823")

turn = client.voice_ai.process_turn(
    agent_id="agent_concierge_402",
    call_id="call_iad_8921b7",
    user_speech="Verify patient coverage for AC Medical Billing",
    latency_budget_ms=150
)
print(f"Agent Reply: {turn.speech_response} (Latency: {turn.latency_ms}ms)")`,
      go: `package main

import (
    "context"
    "fmt"
    "github.com/aetheris/aetheris-go"
)

func main() {
    client := aetheris.NewClient("aeth_live_sec_991823")
    turn, err := client.VoiceAI.ProcessTurn(context.Background(), &aetheris.TurnRequest{
        AgentID: "agent_concierge_402",
        UserSpeech: "Verify patient coverage for AC Medical Billing",
    })
    if err != nil {
        panic(err)
    }
    fmt.Println(turn.ResponseText)
}`,
    },
    voice: {
      curl: `curl -X POST https://api.aetheris.network/v2/telephony/calls \\
  -H "Authorization: Bearer aeth_live_sec_991823" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+18005550199",
    "from": "+14157900144",
    "sip_trunk_id": "trunk_iad_ashburn_01",
    "preferred_codec": "Opus-HD",
    "enable_recording": false
  }'`,
      typescript: `import { AetherisTelephony } from '@aetheris/telephony-sdk';

const client = new AetherisTelephony({ apiKey: process.env.AETHERIS_API_KEY });

const call = await client.calls.create({
  to: '+18005550199',
  from: '+14157900144',
  webhookUrl: 'https://api.yourdomain.com/webhooks/voice',
  preferredCodec: 'Opus-HD'
});`,
      python: `from aetheris.telephony import Calls

calls = Calls(api_key="aeth_live_sec_991823")
call = calls.create(
    to="+18005550199",
    from_="+14157900144",
    sip_uri="sip:inbound@iad.sip.aetheris.network"
)`,
      go: `client := aetheris.NewTelephony("aeth_live_sec_991823")
call, err := client.Calls.Initiate(&aetheris.CallParams{
    To: "+18005550199",
    From: "+14157900144",
    Codec: "Opus-HD",
})`,
    },
    sms: {
      curl: `curl -X POST https://api.aetheris.network/v2/messages \\
  -H "Authorization: Bearer aeth_live_sec_991823" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+14158004321",
    "from": "+1888998AETH",
    "body": "Your appointment verification code is 492-108.",
    "type": "SMS"
  }'`,
      typescript: `const msg = await client.messages.create({
  to: '+14158004321',
  from: '+1888998AETH',
  body: 'Your appointment verification code is 492-108.'
});`,
      python: `message = client.messages.create(
    to="+14158004321",
    from_="+1888998AETH",
    body="Your appointment verification code is 492-108."
)`,
      go: `msg, err := client.Messages.Send(&aetheris.MessageParams{
    To: "+14158004321",
    From: "+1888998AETH",
    Body: "Your appointment verification code is 492-108.",
})`,
    },
    iot: {
      curl: `curl -X POST https://api.aetheris.network/v2/iot/sims/8901410321159823412/ota-config \\
  -H "Authorization: Bearer aeth_live_sec_991823" \\
  -H "Content-Type: application/json" \\
  -d '{
    "apn": "aetheris.corp.private",
    "roaming_allowed": true,
    "ipsec_vpc_route": "vpc-0912fa88"
  }'`,
      typescript: `await client.iot.updateSim('8901410321159823412', {
  status: 'active',
  apn: 'aetheris.corp.private',
  dataLimitMb: 1000
});`,
      python: `client.iot.sims.update(
    iccid="8901410321159823412",
    apn="aetheris.corp.private",
    status="active"
)`,
      go: `err := client.IoT.UpdateSIM("8901410321159823412", &aetheris.SIMConfig{
    APN: "aetheris.corp.private",
    Status: "active",
})`,
    },
    gpu: {
      curl: `curl -X POST https://api.aetheris.network/v1/chat/completions \\
  -H "Authorization: Bearer aeth_live_sec_991823" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama-3.3-70b-instruct",
    "stream": true,
    "messages": [{"role": "user", "content": "Analyze caller billing query"}]
  }'`,
      typescript: `import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.AETHERIS_API_KEY,
  baseURL: 'https://api.aetheris.network/v1'
});

const completion = await client.chat.completions.create({
  model: 'llama-3.3-70b-instruct',
  messages: [{ role: 'user', content: 'Analyze caller billing query' }],
  stream: true
});`,
      python: `from openai import OpenAI

client = OpenAI(
    api_key="aeth_live_sec_991823",
    base_url="https://api.aetheris.network/v1"
)

response = client.chat.completions.create(
    model="llama-3.3-70b-instruct",
    messages=[{"role": "user", "content": "Analyze caller billing query"}]
)`,
      go: `// Fully OpenAI SDK compatible endpoint:
// BaseURL: "https://api.aetheris.network/v1"
// Model: "llama-3.3-70b-instruct"`,
    },
  };

  const currentSnippet = codeSnippets[selectedEndpoint]?.[selectedLang] || '// No snippet available';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Aetheris Universal REST & SDK Explorer</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Selector */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-wrap gap-1.5 text-xs">
          <button
            onClick={() => setSelectedEndpoint('voice-ai')}
            className={`px-2.5 py-1 rounded transition-colors ${
              selectedEndpoint === 'voice-ai'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Voice AI Stream
          </button>
          <button
            onClick={() => setSelectedEndpoint('voice')}
            className={`px-2.5 py-1 rounded transition-colors ${
              selectedEndpoint === 'voice'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Programmable SIP Call
          </button>
          <button
            onClick={() => setSelectedEndpoint('sms')}
            className={`px-2.5 py-1 rounded transition-colors ${
              selectedEndpoint === 'sms'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SMS / MMS Dispatch
          </button>
          <button
            onClick={() => setSelectedEndpoint('iot')}
            className={`px-2.5 py-1 rounded transition-colors ${
              selectedEndpoint === 'iot'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cellular IoT OTA
          </button>
          <button
            onClick={() => setSelectedEndpoint('gpu')}
            className={`px-2.5 py-1 rounded transition-colors ${
              selectedEndpoint === 'gpu'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Serverless GPU API
          </button>
        </div>

        {/* Language Tabs & Copy */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            {(['curl', 'typescript', 'python', 'go'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`uppercase font-mono text-[11px] pb-1 transition-colors ${
                  selectedLang === lang
                    ? 'border-b-2 border-cyan-400 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Code View */}
        <div className="p-4 bg-slate-950 max-h-96 overflow-y-auto">
          <pre className="font-mono text-xs text-cyan-200/90 leading-relaxed overflow-x-auto whitespace-pre">
            {currentSnippet}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Target Base URL: <code className="text-slate-300 font-mono">https://api.aetheris.network</code></span>
          <span className="font-mono text-slate-500">API Version: 2026-11-01</span>
        </div>
      </div>
    </div>
  );
};
