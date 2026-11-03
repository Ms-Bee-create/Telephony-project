export interface EdgePoP {
  id: string;
  name: string;
  city: string;
  country: string;
  facility: string;
  lat: number;
  lng: number;
  latencyMs: number;
  capacityGbps: number;
  status: 'nominal' | 'elevated' | 'maintenance';
  directBgpPeers: number;
}

export interface VoiceAgentConfig {
  id: string;
  name: string;
  role: string;
  systemPrompt: string;
  voicePersona: string;
  targetLatencyMs: number;
  bargeInEnabled: boolean;
  backchannelFrequency: 'low' | 'balanced' | 'high';
  ttsVoice: string;
  transferDestination?: string;
  smsFollowupTemplate?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  latencyMs?: number;
}

export interface IotSimDevice {
  iccid: string;
  name: string;
  type: string;
  location: string;
  country: string;
  operator: string;
  status: 'active' | 'suspended' | 'provisioning';
  dataUsageMb: number;
  dataLimitMb: number;
  signalDbm: number;
  lastHeartbeat: string;
  ipAddress: string;
}

export interface GpuModelSpec {
  id: string;
  name: string;
  provider: string;
  architecture: string;
  vramRequired: string;
  contextWindow: number;
  coldStartTimeMs: number;
  timeToFirstTokenMs: number;
  tokensPerSec: number;
  pricePerMillionTokens: number;
  category: 'LLM' | 'Speech-to-Text' | 'Text-to-Speech' | 'Voice-End-to-End';
}

export interface SipCallState {
  status: 'idle' | 'initiating' | 'ringing' | 'connected' | 'terminated';
  callId: string;
  fromNumber: string;
  toNumber: string;
  codec: string;
  latencyMs: number;
  jitterMs: number;
  packetLoss: number;
  durationSeconds: number;
}

export interface HipaaComplianceConfig {
  baaSigned: boolean;
  baaSignatoryName: string;
  baaOrganization: string;
  baaExecutionDate: string;
  baaId: string;
  gcpBaaCovered: boolean;
  gcpBaaOrganization: string;
  gcpBaaAccountType: string;
  gcpKmsKeyResource: string;
  gcpCloudRunRuntimeCovered: boolean;
  gcpGeminiZeroTrainingGuaranteed: boolean;
  zeroDataRetention: boolean;
  realtimePhiRedaction: boolean;
  srtpMandatory: boolean;
  tlsVersion: string;
  customerManagedKeys: boolean;
  cmekKeyArn: string;
  auditLoggingRetentionDays: number;
}

export interface HipaaAuditLog {
  id: string;
  timestamp: string;
  service: 'Voice & SIP' | 'Voice AI' | 'Messaging' | 'IoT' | 'GPU Compute' | 'Key Management';
  action: string;
  actor: string;
  patientIdentifierHash: string;
  status: 'ALLOW' | 'DENY' | 'REDACTED';
  sha256Digest: string;
}

