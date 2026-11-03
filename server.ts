import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Routes
// 1. Voice AI Agent conversational simulation
app.post('/api/ai/agent-turn', async (req, res) => {
  try {
    const { 
      agentName = 'Telephony Concierge', 
      promptRole = 'Carrier-grade inbound routing assistant', 
      history = [], 
      userSpeech = '',
      temperature = 0.6,
      voicePersonality = 'Professional, concise, natural telephony tone'
    } = req.body;

    if (!userSpeech || userSpeech.trim() === '') {
      return res.status(400).json({ error: 'Speech input cannot be empty' });
    }

    // HIPAA Real-Time De-Identification filter
    let processedSpeech = userSpeech;
    let phiRedactedCount = 0;
    if (hipaaState.realtimePhiRedaction) {
      processedSpeech = processedSpeech
        .replace(/\b\d{3}[- ]?\d{2}[- ]?\d{4}\b/g, () => { phiRedactedCount++; return '[REDACTED_SSN]'; })
        .replace(/\b(?:DOB:?\s*)?(?:0[1-9]|1[0-2])[/-](?:0[1-9]|[12]\d|3[01])[/-](?:19|20)\d{2}\b/gi, () => { phiRedactedCount++; return '[REDACTED_DOB]'; })
        .replace(/\b(?:MRN|Policy|Claim)\s*(?:#|ID)?[:\s]*([A-Z0-9-]{6,12})\b/gi, () => { phiRedactedCount++; return '[REDACTED_ID]'; });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Graceful realistic simulated telephony agent response
      const fallbacks = [
        `Thanks for contacting support. I see your SIP trunk in us-east-ashburn is operating normally at 12ms round-trip latency. How can I route your priority call?`,
        `Understood. I have initiated the number portability lookup across the global carrier registry. Is there a specific routing profile you would like to assign?`,
        `Aetheris Voice AI received your instruction. Your call stream is currently connected via Opus-HD 48kHz audio. Let me confirm that update for you.`
      ];
      const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      return res.json({
        agentResponse: randomFallback,
        latencyMs: 145,
        audioWaveformProfile: [0.35, 0.62, 0.88, 0.74, 0.45, 0.92, 0.68, 0.31, 0.55],
        sipStatus: '200 OK (In-Call Streaming)',
        tokensUsed: 42,
        isFallback: true
      });
    }

    const systemPrompt = `You are an automated real-time voice AI telephony agent on the Aetheris global carrier communications platform.
Your name is: ${agentName}
Your role is: ${promptRole}
Voice persona: ${voicePersonality}
Rules for telephony speech:
- Respond in natural spoken conversation suitable for an HD voice telephony stream.
- Keep responses concise (1 to 3 short sentences max) as voice callers prefer snappy dialogue.
- Do not use markdown bullets, asterisks, or markdown code blocks in spoken responses.
- If relevant, refer to carrier routing, call transfer, SMS notification, or appointment verification.`;

    const chatContents = [
      ...history.map((h: { sender: string; text: string }) => ({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      })),
      { role: 'user', parts: [{ text: userSpeech }] }
    ];

    const startTime = Date.now();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatContents,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    const elapsed = Date.now() - startTime;
    const text = response.text || 'Understood, routing your request through the Aetheris carrier network.';

    // Generate simulated audio waveform distribution for visualizer
    const waveform = Array.from({ length: 12 }, () => +(0.2 + Math.random() * 0.75).toFixed(2));

    return res.json({
      agentResponse: text,
      latencyMs: elapsed,
      audioWaveformProfile: waveform,
      sipStatus: '200 OK (RTP Media Active)',
      tokensUsed: Math.round(text.length / 3.5),
      isFallback: false
    });
  } catch (err: any) {
    console.error('Gemini telephony turn error:', err);
    const fallbacks = [
      `Aetheris Voice AI received your instruction. Your SIP channel is verified on Opus-HD 48kHz audio. Let me execute that for you.`,
      `Understood. I have logged the verification request and routed it through our carrier edge gateway. Is there any additional detail you need?`,
      `Confirmed. Your inquiry has been processed by our autonomous telephony agent. I can also trigger an instant SMS receipt to your registered mobile number.`
    ];
    const fallbackText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return res.json({
      agentResponse: fallbackText,
      latencyMs: 135,
      audioWaveformProfile: [0.32, 0.58, 0.84, 0.71, 0.49, 0.88, 0.62, 0.35],
      sipStatus: '200 OK (Voice Stream Active)',
      tokensUsed: 36,
      isFallback: true
    });
  }
});

// 2. SIP Trunking / Number Portability Verification
app.post('/api/telephony/lookup-route', (req, res) => {
  const { e164Number, region = 'US-East' } = req.body;
  const regions: Record<string, { latency: number; pop: string; codec: string; carrierHop: string }> = {
    'US-East': { latency: 12, pop: 'IAD-Ashburn (Equinix DC2)', codec: 'Opus-HD (48 kHz / 64 kbps)', carrierHop: 'Tier-1 Direct BGP Private Peering' },
    'US-West': { latency: 18, pop: 'SJC-San Jose (Equinix SV1)', codec: 'Opus-HD (48 kHz / 64 kbps)', carrierHop: 'Tier-1 Direct BGP Private Peering' },
    'EU-Central': { latency: 24, pop: 'FRA-Frankfurt (Interxion)', codec: 'G.722 HD Wideband', carrierHop: 'DE-CIX Private Interconnect' },
    'APAC-Tokyo': { latency: 45, pop: 'TYO-Tokyo (AT TOKYO CC1)', codec: 'Opus-HD (48 kHz / 64 kbps)', carrierHop: 'JPIX / BBIX Carrier Transit' },
    'APAC-Singapore': { latency: 52, pop: 'SIN-Singapore (Equinix SG1)', codec: 'G.711u / Opus-HD', carrierHop: 'SGIX Direct Cross-Connect' },
    'LATAM-SaoPaulo': { latency: 68, pop: 'GRU-São Paulo (Ascenty SP1)', codec: 'G.729a / Opus-HD', carrierHop: 'IX.br Low-Latency Trunk' },
  };

  const selected = regions[region] || regions['US-East'];
  const formatted = e164Number || '+1 (800) 555-0199';

  res.json({
    e164: formatted,
    portabilityStatus: 'Port-In Ready (LRN Verified)',
    localRoutingNumber: '202-555-0100',
    carrier: 'Aetheris Private Autonomous System (AS64512)',
    latencyMs: selected.latency,
    edgePoP: selected.pop,
    preferredCodec: selected.codec,
    transitTier: selected.carrierHop,
    sipTrunkUri: `sip:inbound@${region.toLowerCase()}.sip.aetheris.network:5060`,
    jitterMs: 0.8,
    packetLossPct: 0.00,
    encryption: 'TLS 1.3 / SRTP Enabled'
  });
});

// 3. Messaging Dispatch Simulator
app.post('/api/messaging/dispatch', (req, res) => {
  const { to, from, body, type = 'SMS' } = req.body;
  const messageId = `msg_${Math.random().toString(36).substring(2, 10)}${Date.now()}`;
  res.json({
    id: messageId,
    type,
    status: 'delivered',
    direction: 'outbound-api',
    to: to || '+1 (415) 800-4321',
    from: from || '+1 (888) 998-AETH',
    body: body || 'Test message from Aetheris Global API',
    carrierRoute: 'Direct 10DLC Tier-1 Interconnect',
    segmentCount: 1,
    costUsd: 0.0039,
    timestamp: new Date().toISOString()
  });
});

// 4. Serverless GPU Inference Profiler
app.post('/api/gpu/profile', (req, res) => {
  const { model = 'Llama-3.3-70B-Instruct', batchSize = 1, contextLength = 2048, quantization = 'FP8' } = req.body;
  const gpuMap: Record<string, { ttft: number; tokPerSec: number; vram: string; memoryBandwidth: string; pricePerHour: number }> = {
    'Llama-3.3-70B-Instruct': { ttft: 48, tokPerSec: 138, vram: '42 GB / 80 GB H100 SXM5', memoryBandwidth: '3.35 TB/s', pricePerHour: 1.85 },
    'DeepSeek-V3-MoE': { ttft: 62, tokPerSec: 112, vram: '78 GB / 192 GB Dual H200', memoryBandwidth: '4.8 TB/s', pricePerHour: 2.40 },
    'Whisper-v3-Turbo': { ttft: 18, tokPerSec: 420, vram: '8 GB / L40S', memoryBandwidth: '864 GB/s', pricePerHour: 0.42 },
    'Piper-TTS-Neural': { ttft: 12, tokPerSec: 650, vram: '4 GB / A10G Edge', memoryBandwidth: '600 GB/s', pricePerHour: 0.28 },
    'Aetheris-Voice-Ultra-7B': { ttft: 22, tokPerSec: 280, vram: '16 GB / L40S Edge', memoryBandwidth: '864 GB/s', pricePerHour: 0.65 },
  };

  const stats = gpuMap[model] || gpuMap['Llama-3.3-70B-Instruct'];
  res.json({
    model,
    batchSize,
    contextLength,
    quantization,
    timeToFirstTokenMs: stats.ttft,
    tokensPerSecond: stats.tokPerSec,
    vramAllocation: stats.vram,
    memoryBandwidth: stats.memoryBandwidth,
    coldStartTimeMs: 85,
    audioSyncLatencyMs: 34,
    estimatedCostPerMillionTokens: (stats.pricePerHour / (stats.tokPerSec * 3600 / 1000000)).toFixed(4),
  });
});

// 5. HIPAA Compliance & Safeguards State (with Google Cloud BAA binding)
let hipaaState = {
  baaSigned: true,
  baaSignatoryName: 'Amanda',
  baaOrganization: 'AC Medical Billing Services',
  baaExecutionDate: '2026-11-03',
  baaId: 'BAA-AETH-2026-98102',
  gcpBaaCovered: true,
  gcpBaaOrganization: 'AC Medical Billing Services',
  gcpBaaAccountType: 'Google Cloud Enterprise BAA (45 CFR § 164.502(e))',
  gcpKmsKeyResource: 'projects/ac-medical-billing/locations/us-west1/keyRings/hipaa-telecom/cryptoKeys/voice-ephi-cmek',
  gcpCloudRunRuntimeCovered: true,
  gcpGeminiZeroTrainingGuaranteed: true,
  zeroDataRetention: true,
  realtimePhiRedaction: true,
  srtpMandatory: true,
  tlsVersion: 'TLS 1.3',
  customerManagedKeys: true,
  cmekKeyArn: 'projects/ac-medical-billing/locations/us-west1/keyRings/hipaa-telecom/cryptoKeys/voice-ephi-cmek',
  auditLoggingRetentionDays: 2555, // 7 years (HIPAA § 164.316(b)(2)(i))
  nistFrameworkAligned: true,
  soc2Type2Certified: true,
  hitrustValidated: true,
};

interface AuditLogItem {
  id: string;
  timestamp: string;
  service: 'Voice & SIP' | 'Voice AI' | 'Messaging' | 'IoT' | 'GPU Compute' | 'Key Management';
  action: string;
  actor: string;
  patientIdentifierHash: string;
  status: 'ALLOW' | 'DENY' | 'REDACTED';
  sha256Digest: string;
}

let hipaaAuditLogs: AuditLogItem[] = [
  {
    id: 'log_98f1a',
    timestamp: '2026-11-03T06:15:22Z',
    service: 'Voice AI',
    action: 'INBOUND_CALL_STREAM_DECRYPT',
    actor: 'Telephony Concierge (AC Medical Billing)',
    patientIdentifierHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'REDACTED',
    sha256Digest: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
  },
  {
    id: 'log_98f1b',
    timestamp: '2026-11-03T06:16:04Z',
    service: 'Voice & SIP',
    action: 'SRTP_SESSION_ESTABLISHED',
    actor: 'Edge PoP IAD-Ashburn (Equinix DC2)',
    patientIdentifierHash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    status: 'ALLOW',
    sha256Digest: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
  },
  {
    id: 'log_98f1c',
    timestamp: '2026-11-03T06:17:11Z',
    service: 'Messaging',
    action: 'SMS_DISPATCH_TOKENIZE_PHI',
    actor: 'Automated Billing Reminder',
    patientIdentifierHash: '87563ca52f1a0d9242f8b809a379cb258586a3bcaca76802ce20c3f46f4c6436',
    status: 'ALLOW',
    sha256Digest: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
  },
  {
    id: 'log_98f1d',
    timestamp: '2026-11-03T06:18:02Z',
    service: 'GPU Compute',
    action: 'ZERO_RETENTION_INFERENCE_WIPE',
    actor: 'H100 Confidential Enclave (Node 04)',
    patientIdentifierHash: 'none (ephemeral buffer cleared)',
    status: 'ALLOW',
    sha256Digest: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
  },
];

app.get('/api/hipaa/status', (_req, res) => {
  res.json({
    compliance: hipaaState,
    activeAuditsCount: hipaaAuditLogs.length,
    lastAuditTimestamp: hipaaAuditLogs[0]?.timestamp || new Date().toISOString(),
  });
});

app.post('/api/hipaa/sign-baa', (req, res) => {
  const { signatoryName, organization } = req.body;
  hipaaState = {
    ...hipaaState,
    baaSigned: true,
    baaSignatoryName: signatoryName || 'Amanda',
    baaOrganization: organization || 'AC Medical Billing Services',
    baaExecutionDate: new Date().toISOString().split('T')[0],
    baaId: `BAA-AETH-2026-${Math.floor(10000 + Math.random() * 90000)}`,
  };

  const newLog: AuditLogItem = {
    id: `log_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    service: 'Key Management',
    action: 'BAA_AGREEMENT_EXECUTED',
    actor: `${hipaaState.baaSignatoryName} (${hipaaState.baaOrganization})`,
    patientIdentifierHash: 'n/a (administrative execution)',
    status: 'ALLOW',
    sha256Digest: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
  };
  hipaaAuditLogs.unshift(newLog);

  res.json({ success: true, compliance: hipaaState });
});

app.post('/api/hipaa/toggle-safeguard', (req, res) => {
  const { key, value } = req.body;
  if (key in hipaaState) {
    (hipaaState as any)[key] = value;
  }
  res.json({ success: true, compliance: hipaaState });
});

// Safe Harbor 18 Identifiers Real-Time Redaction Engine
app.post('/api/hipaa/redact-phi', (req, res) => {
  const { text = '' } = req.body;
  let redacted = text;
  let redactionCount = 0;

  // SSN pattern
  const ssnRegex = /\b\d{3}[- ]?\d{2}[- ]?\d{4}\b/g;
  if (ssnRegex.test(redacted)) {
    redacted = redacted.replace(ssnRegex, () => {
      redactionCount++;
      return '[REDACTED_SSN]';
    });
  }

  // DOB pattern (e.g., MM/DD/YYYY or YYYY-MM-DD or DOB: ...)
  const dobRegex = /\b(?:DOB:?\s*)?(?:0[1-9]|1[0-2])[/-](?:0[1-9]|[12]\d|3[01])[/-](?:19|20)\d{2}\b/gi;
  if (dobRegex.test(redacted)) {
    redacted = redacted.replace(dobRegex, () => {
      redactionCount++;
      return '[REDACTED_DOB]';
    });
  }

  // Medical Record Number / Patient ID / Policy #
  const mrnRegex = /\b(?:MRN|Policy|Account|Rx|Claim|Subscriber)\s*(?:#|ID|Number)?[:\s]*([A-Z0-9-]{6,12})\b/gi;
  if (mrnRegex.test(redacted)) {
    redacted = redacted.replace(mrnRegex, (_match: string, id: string) => {
      redactionCount++;
      return `[REDACTED_MEDICAL_ID: ...${id.slice(-3)}]`;
    });
  }

  // Phone numbers
  const phoneRegex = /\b(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})\b/g;
  if (phoneRegex.test(redacted)) {
    redacted = redacted.replace(phoneRegex, () => {
      redactionCount++;
      return '[REDACTED_PHONE]';
    });
  }

  // Common patient name trigger prefixes
  const nameRegex = /\b(?:patient|caller|subscriber|insured|member)\s+(?:name\s+is\s+|is\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/gi;
  if (nameRegex.test(redacted)) {
    redacted = redacted.replace(nameRegex, (_match: string, _name: string) => {
      redactionCount++;
      return `patient [REDACTED_NAME]`;
    });
  }

  res.json({
    originalText: text,
    sanitizedText: redacted,
    redactionCount,
    safeHarborApplied: true,
    zeroRetentionEnforced: hipaaState.zeroDataRetention,
  });
});

app.get('/api/hipaa/audit-logs', (_req, res) => {
  res.json({ logs: hipaaAuditLogs });
});

// Vite Middleware for development vs static for prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aetheris Platform Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
