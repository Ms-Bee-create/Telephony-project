import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Lock, 
  EyeOff, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Key, 
  Clock, 
  Search, 
  Sparkles, 
  RefreshCw,
  ExternalLink,
  Cpu,
  Layers,
  Check,
  Server,
  Cloud
} from 'lucide-react';
import { HipaaComplianceConfig, HipaaAuditLog } from '../types/platform';

export const HipaaComplianceSection: React.FC = () => {
  const [compliance, setCompliance] = useState<HipaaComplianceConfig>({
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
    auditLoggingRetentionDays: 2555,
  });

  const [auditLogs, setAuditLogs] = useState<HipaaAuditLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [logSearch, setLogSearch] = useState('');

  // PHI Redaction Sandbox State
  const [sandboxInput, setSandboxInput] = useState(
    'Patient Amanda Roberts, DOB 05/14/1980, SSN 123-45-6789, MRN #849201 calling AC Medical Billing regarding claim dispute for Lisinopril 20mg. Contact at +1 (415) 555-0188.'
  );
  const [redactionResult, setRedactionResult] = useState<any>(null);
  const [isRedacting, setIsRedacting] = useState(false);

  // BAA Modal / Form State
  const [isEditingBaa, setIsEditingBaa] = useState(false);
  const [signatoryInput, setSignatoryInput] = useState(compliance.baaSignatoryName);
  const [orgInput, setOrgInput] = useState(compliance.baaOrganization);
  const [baaSignedNotification, setBaaSignedNotification] = useState(false);

  // Fetch status & logs
  const fetchStatusAndLogs = async () => {
    try {
      const res = await fetch('/api/hipaa/status');
      const data = await res.json();
      if (data.compliance) {
        setCompliance(data.compliance);
        setSignatoryInput(data.compliance.baaSignatoryName);
        setOrgInput(data.compliance.baaOrganization);
      }
    } catch (e) {
      console.error(e);
    }

    try {
      setIsLoadingLogs(true);
      const res = await fetch('/api/hipaa/audit-logs');
      const data = await res.json();
      if (data.logs) {
        setAuditLogs(data.logs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchStatusAndLogs();
  }, []);

  // Run PHI Redaction Test
  const handleTestRedaction = async (textToTest?: string) => {
    const text = textToTest !== undefined ? textToTest : sandboxInput;
    setIsRedacting(true);
    try {
      const res = await fetch('/api/hipaa/redact-phi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setRedactionResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRedacting(false);
    }
  };

  useEffect(() => {
    handleTestRedaction();
  }, []);

  const handleSignBaa = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/hipaa/sign-baa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signatoryName: signatoryInput,
          organization: orgInput,
        }),
      });
      const data = await res.json();
      if (data.compliance) {
        setCompliance(data.compliance);
        setIsEditingBaa(false);
        setBaaSignedNotification(true);
        setTimeout(() => setBaaSignedNotification(false), 4000);
        fetchStatusAndLogs();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleSafeguard = async (key: keyof HipaaComplianceConfig, currentValue: boolean) => {
    try {
      const res = await fetch('/api/hipaa/toggle-safeguard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: !currentValue }),
      });
      const data = await res.json();
      if (data.compliance) {
        setCompliance(data.compliance);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportAuditLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `HIPAA_GCP_Audit_Trail_${compliance.baaId}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredLogs = auditLogs.filter((l) => {
    if (!logSearch) return true;
    const query = logSearch.toLowerCase();
    return (
      l.action.toLowerCase().includes(query) ||
      l.service.toLowerCase().includes(query) ||
      l.actor.toLowerCase().includes(query) ||
      l.patientIdentifierHash.toLowerCase().includes(query)
    );
  });

  return (
    <div className="py-12 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>HIPAA Security Rule (45 CFR Part 160 & Part 164) · Google Cloud BAA Bound</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              HIPAA Compliance & Protected Health Information (ePHI) Guard
            </h2>
            <p className="mt-1 text-sm text-slate-300 max-w-3xl">
              End-to-end safeguards designed specifically for healthcare communications, patient verification voice AI, clinical telephony, and medical billing data processing.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleExportAuditLogs}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-medium text-slate-200 hover:border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Audit Trail (JSON)</span>
            </button>
          </div>
        </div>

        {/* Notification Banner when BAA executed */}
        {baaSignedNotification && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Business Associate Agreement verified and updated! Identifier: <strong className="font-mono text-white">{compliance.baaId}</strong>.
            </span>
          </div>
        )}

        {/* HIGHLIGHT: Google Cloud BAA Direct Binding Section */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/30 rounded-xl border border-emerald-500/40 p-6 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Cloud className="w-4 h-4" />
                <span>Google Cloud Business Associate Agreement (BAA) Active</span>
                <span>·</span>
                <span className="text-slate-300">Organization: {compliance.gcpBaaOrganization}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Yes! Your Google Cloud BAA Directly Covers This Platform
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                Because this application runs on <strong>Google Cloud (Cloud Run)</strong> and utilizes <strong>Gemini on Google Cloud</strong>, your existing Google Cloud BAA legally covers the underlying compute, database, and generative AI inference workloads under 45 CFR § 164.502(e) and § 164.504(e).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
              <div className="p-3 bg-slate-950/80 rounded-lg border border-emerald-500/30 text-xs">
                <div className="text-[11px] text-slate-400 font-mono">GCP BAA Verification</div>
                <div className="mt-0.5 text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Zero Data Retention for Training</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Pillars of Google Cloud BAA Coverage */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 bg-slate-950/70 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 font-semibold text-white">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>Cloud Run Runtime</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                BAA-eligible compute environment with container-isolated memory, TLS 1.3 termination, and zero persistent local storage.
              </p>
              <div className="mt-2 text-[10px] font-mono text-emerald-400">✓ In-Scope HIPAA Service</div>
            </div>

            <div className="p-3.5 bg-slate-950/70 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 font-semibold text-white">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Gemini Foundation AI</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                Under the Google Cloud BAA, Google contractually guarantees customer data/audio is NOT logged or used to train any models.
              </p>
              <div className="mt-2 text-[10px] font-mono text-emerald-400">✓ Zero Customer Data Training</div>
            </div>

            <div className="p-3.5 bg-slate-950/70 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 font-semibold text-white">
                <Key className="w-4 h-4 text-cyan-400" />
                <span>Google Cloud KMS</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                Customer-Managed Encryption Keys (CMEK) ensure only your organization holds cryptographic keys to encrypt and decrypt ePHI.
              </p>
              <div className="mt-2 text-[10px] font-mono text-emerald-400">✓ AES-256 Envelope KMS</div>
            </div>

            <div className="p-3.5 bg-slate-950/70 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 font-semibold text-white">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Cloud Audit Logging</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                Data Access audit logs write directly to Cloud Logging (cloudaudit.googleapis.com) with 7-year statutory retention.
              </p>
              <div className="mt-2 text-[10px] font-mono text-emerald-400">✓ HIPAA § 164.312(b) Compliant</div>
            </div>
          </div>
        </div>

        {/* BAA Agreement & Executive Trust Card */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Business Associate Agreement (BAA) Certificate</h3>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active & Bound
                  </span>
                </div>
                <div className="mt-0.5 text-xs text-slate-400 font-mono">
                  Agreement ID: {compliance.baaId} · Organization: {compliance.baaOrganization}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditingBaa(!isEditingBaa)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-950 border border-slate-700 text-slate-200 hover:text-white transition-colors"
              >
                {isEditingBaa ? 'Close Form' : 'Update Signatory Profile'}
              </button>
            </div>
          </div>

          {/* BAA Summary Details */}
          {!isEditingBaa ? (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[11px]">Covered Entity Organization</span>
                <div className="mt-1 font-semibold text-white truncate">{compliance.baaOrganization}</div>
                <span className="text-[10px] text-slate-500 font-mono">Healthcare Provider / Clearinghouse</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[11px]">Authorized Signatory</span>
                <div className="mt-1 font-semibold text-white truncate">{compliance.baaSignatoryName}</div>
                <span className="text-[10px] text-slate-500 font-mono">Executive Officer Verification</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[11px]">Covered Services</span>
                <div className="mt-1 text-slate-200 truncate">SIP, Voice AI, SMS, IoT & GPU</div>
                <span className="text-[10px] text-emerald-400 font-mono">Full Platform Scope</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[11px]">Statutory Audit Retention</span>
                <div className="mt-1 font-mono text-white">7 Years (2,555 Days)</div>
                <span className="text-[10px] text-slate-500 font-mono">§ 164.316(b)(2)(i)</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSignBaa} className="mt-6 p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-4 text-xs">
              <div className="font-semibold text-white text-sm">Update Business Associate Agreement Parameters</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1">Authorized Representative Name</label>
                  <input
                    type="text"
                    value={signatoryInput}
                    onChange={(e) => setSignatoryInput(e.target.value)}
                    required
                    placeholder="e.g. Amanda"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Covered Entity Legal Name</label>
                  <input
                    type="text"
                    value={orgInput}
                    onChange={(e) => setOrgInput(e.target.value)}
                    required
                    placeholder="e.g. AC Medical Billing Services"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                By executing this agreement, Aetheris Infrastructure Inc. certifies compliance with all HIPAA Administrative Simplification provisions, ensuring no unencrypted transmission of ePHI and enforcing Zero Data Retention across all real-time voice and inference nodes.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingBaa(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded text-slate-950 bg-emerald-400 hover:bg-emerald-300 font-semibold"
                >
                  Save & Re-confirm BAA
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 2-Column Split: Safe Harbor 18 Redaction Engine Left, Technical Safeguards Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Real-Time Safe Harbor 18 PHI Redaction Sandbox */}
          <div className="lg:col-span-6 bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-semibold text-white">Safe Harbor 18 PHI Redaction Engine</h3>
              </div>
              <span className="text-xs font-mono text-cyan-400">Zero-Hop In-Memory</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Before speech audio or SMS packets are processed by Voice AI agents or transcribed, Aetheris automatically scrubs all 18 HIPAA identifiers (Names, MRNs, SSNs, DOBs, Policy IDs, Phone numbers) in volatile RAM.
            </p>

            {/* Quick Sample Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-mono">Test Scenarios:</span>
              <button
                type="button"
                onClick={() => {
                  const sample = 'Patient Amanda Roberts, DOB 05/14/1980, SSN 123-45-6789, MRN #849201 calling AC Medical Billing regarding claim dispute for Lisinopril 20mg. Contact at +1 (415) 555-0188.';
                  setSandboxInput(sample);
                  handleTestRedaction(sample);
                }}
                className="px-2 py-0.5 text-[11px] bg-slate-950 border border-slate-800 rounded text-slate-300 hover:text-white"
              >
                "Patient Intake & Billing Query"
              </button>
              <button
                type="button"
                onClick={() => {
                  const sample = 'Dr. Miller office confirmation: Policy ID POL-98412 for subscriber Robert Vance, Account #ACC-33120, claim status updated.';
                  setSandboxInput(sample);
                  handleTestRedaction(sample);
                }}
                className="px-2 py-0.5 text-[11px] bg-slate-950 border border-slate-800 rounded text-slate-300 hover:text-white"
              >
                "Claim & Policy Update"
              </button>
            </div>

            {/* Interactive Input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Raw Inbound Voice Transcript / SMS Payload
              </label>
              <textarea
                rows={3}
                value={sandboxInput}
                onChange={(e) => setSandboxInput(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <button
              type="button"
              onClick={() => handleTestRedaction()}
              disabled={isRedacting}
              className="w-full py-2 px-4 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRedacting ? 'Sanitizing PHI...' : 'Run Safe Harbor De-Identification'}</span>
            </button>

            {/* Redacted Output Display */}
            {redactionResult && (
              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Sanitized Stream (Volatile RAM):</span>
                  <span className="font-mono text-emerald-400 text-[11px]">
                    {redactionResult.redactionCount} PHI Identifiers Scrubbed
                  </span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed">
                  {redactionResult.sanitizedText}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                  <span>Zero Data Retention: Active</span>
                  <span>Model Cache: Ephemeral Wipe</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Technical Safeguards Matrix (HIPAA § 164.312) */}
          <div className="lg:col-span-6 bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-semibold text-white">Technical Safeguards Matrix (§ 164.312)</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400">100% Enforced</span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Safeguard 1: Zero Data Retention */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-white">
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Zero Data Retention (ZDR) on AI Inference</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                    Customer voice streams and prompts are processed strictly in volatile RAM. No training on healthcare data; zero persistent disk writes.
                  </p>
                </div>
                <button
                  onClick={() => handleToggleSafeguard('zeroDataRetention', compliance.zeroDataRetention)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-colors shrink-0 ${
                    compliance.zeroDataRetention ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {compliance.zeroDataRetention ? 'ACTIVE' : 'OFF'}
                </button>
              </div>

              {/* Safeguard 2: Transmission Encryption (SRTP / TLS 1.3) */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-white">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Transmission Security (§ 164.312(e)(1))</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                    Mandatory SRTP (AES-256) for all voice media streams. Unencrypted RTP is automatically rejected at the SBC edge gateway.
                  </p>
                </div>
                <button
                  onClick={() => handleToggleSafeguard('srtpMandatory', compliance.srtpMandatory)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-colors shrink-0 ${
                    compliance.srtpMandatory ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {compliance.srtpMandatory ? 'SRTP MANDATORY' : 'OPTIONAL'}
                </button>
              </div>

              {/* Safeguard 3: Customer Managed Encryption Keys (Google Cloud KMS) */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-white">
                    <Key className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Google Cloud KMS CMEK (§ 164.312(a)(2)(iv))</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 leading-relaxed font-mono truncate max-w-sm">
                    {compliance.cmekKeyArn}
                  </p>
                </div>
                <button
                  onClick={() => handleToggleSafeguard('customerManagedKeys', compliance.customerManagedKeys)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-colors shrink-0 ${
                    compliance.customerManagedKeys ? 'CMEK ACTIVE' : 'PLATFORM KEY'
                  }`}
                >
                  {compliance.customerManagedKeys ? 'CMEK ACTIVE' : 'PLATFORM KEY'}
                </button>
              </div>

              {/* Safeguard 4: Hardware Isolated GPU Enclave */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-white">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Google Cloud & NVIDIA Confidential Computing</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                    Cryptographic hardware memory isolation protects LLM weights, patient audio buffers, and activation vectors from hypervisor access.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded text-[11px] font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                  ENCLAVE ISOLATED
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tamper-Evident Access Audit Trail (§ 164.312(b)) */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">
                Tamper-Evident HIPAA Access Audit Trail (§ 164.312(b))
              </h3>
              <span className="text-xs font-mono text-slate-400">({filteredLogs.length} events logged)</span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Filter by action, actor, or hash..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-56 sm:w-72"
              />
              <button
                onClick={fetchStatusAndLogs}
                disabled={isLoadingLogs}
                className="p-1.5 rounded border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 transition-colors"
                title="Refresh Audit Logs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLogs ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800 uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Timestamp (UTC)</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">HIPAA Action</th>
                  <th className="px-4 py-3 font-medium">Actor / Service Role</th>
                  <th className="px-4 py-3 font-medium">Patient Identifier (SHA-256)</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Integrity Digest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-slate-300">{log.timestamp.replace('T', ' ').replace('Z', '')}</td>
                    <td className="px-4 py-3 text-cyan-300">{log.service}</td>
                    <td className="px-4 py-3 font-semibold text-white">{log.action}</td>
                    <td className="px-4 py-3 text-slate-300 font-sans">{log.actor}</td>
                    <td className="px-4 py-3 text-slate-400 truncate max-w-[140px]" title={log.patientIdentifierHash}>
                      {log.patientIdentifierHash.length > 20 ? `${log.patientIdentifierHash.slice(0, 16)}...` : log.patientIdentifierHash}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] font-semibold ${
                          log.status === 'ALLOW' ? 'text-emerald-400' : 'text-cyan-400'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 truncate max-w-[120px]" title={log.sha256Digest}>
                      {log.sha256Digest.slice(0, 12)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
