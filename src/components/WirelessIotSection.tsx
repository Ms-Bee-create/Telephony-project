import React, { useState } from 'react';
import { IOT_FLEET_DEVICES } from '../data/mockPlatformData';
import { IotSimDevice } from '../types/platform';
import { Wifi, Signal, RefreshCw, Power, ShieldAlert, Cpu, Globe, CheckCircle2 } from 'lucide-react';

export const WirelessIotSection: React.FC = () => {
  const [devices, setDevices] = useState<IotSimDevice[]>(IOT_FLEET_DEVICES);
  const [selectedDevice, setSelectedDevice] = useState<IotSimDevice>(devices[0]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProvisioning, setIsProvisioning] = useState(false);

  // Toggle active/suspended
  const handleToggleStatus = (iccid: string) => {
    setDevices((prev) =>
      prev.map((dev) => {
        if (dev.iccid === iccid) {
          const newStatus = dev.status === 'active' ? 'suspended' : 'active';
          const updated = { ...dev, status: newStatus as 'active' | 'suspended' };
          if (selectedDevice.iccid === iccid) {
            setSelectedDevice(updated);
          }
          return updated;
        }
        return dev;
      })
    );
  };

  // Simulate Over-the-air (OTA) APN configuration update
  const handleTriggerOta = () => {
    setIsProvisioning(true);
    setTimeout(() => {
      setIsProvisioning(false);
    }, 1200);
  };

  const filteredDevices = devices.filter((d) => {
    if (filterStatus !== 'all' && d.status !== filterStatus) return false;
    if (
      searchQuery &&
      !d.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !d.iccid.includes(searchQuery) &&
      !d.location.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <section className="py-12 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono text-cyan-400 mb-1">
              Pillar 04 · Cellular Core & eUICC SIM Orchestration
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Global Wireless IoT Connectivity
            </h2>
            <p className="mt-1 text-sm text-slate-300 max-w-3xl">
              Connect fleet telematics, smart energy grids, autonomous rovers, and medical telemetry across 190+ countries. Zero-touch multi-IMSI eUICC remote provisioning with private carrier APN tunnels.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerOta}
              disabled={isProvisioning}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-200 hover:border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isProvisioning ? 'animate-spin' : ''}`} />
              <span>{isProvisioning ? 'Syncing HLR/HSS...' : 'OTA Sync SIM Fleet'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Split: Hardware Spotlight Left, Fleet Console Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          {/* Hardware Spotlight with generated eSIM photo */}
          <div className="lg:col-span-4 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col justify-between">
            <div className="relative h-48 sm:h-56 bg-slate-950 overflow-hidden">
              <img
                src="/src/assets/images/iot_cellular_embedded_sim_1793683528738.jpg"
                alt="Aetheris industrial grade embedded eUICC cellular eSIM chip"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-sm">Industrial eUICC Specification</span>
                <span className="font-mono text-cyan-400">GSMA SGP.32</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                Solderable MFF2 form factor tested for -40°C to +105°C temperature ranges, 10-year data retention, and automated over-the-air carrier swapping without hardware replacement.
              </p>
              <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                <div>· Multi-IMSI Auto Roaming</div>
                <div>· Private APN IPSec Tunnel</div>
                <div>· NB-IoT & LTE-M Ready</div>
                <div>· 5G RedCap Compatible</div>
              </div>
            </div>
          </div>

          {/* Selected Device Telemetry Card */}
          <div className="lg:col-span-8 bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Wifi className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{selectedDevice.name}</h3>
                    <div className="text-xs text-slate-400 font-mono">
                      ICCID: {selectedDevice.iccid}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-mono font-semibold uppercase ${
                      selectedDevice.status === 'active' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {selectedDevice.status}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(selectedDevice.iccid)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      selectedDevice.status === 'active'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{selectedDevice.status === 'active' ? 'Suspend SIM' : 'Reactivate SIM'}</span>
                  </button>
                </div>
              </div>

              {/* Grid Metrics for selected device */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400">Signal Strength</span>
                  <div className="mt-1 font-mono text-sm font-semibold tabular-nums text-white flex items-center gap-1.5">
                    <Signal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{selectedDevice.signalDbm} dBm</span>
                  </div>
                  <span className="text-[10px] text-slate-500">RSRP Strong</span>
                </div>

                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400">Data Consumption</span>
                  <div className="mt-1 font-mono text-sm font-semibold tabular-nums text-cyan-400">
                    {selectedDevice.dataUsageMb} / {selectedDevice.dataLimitMb} MB
                  </div>
                  <div className="mt-1 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full rounded-full"
                      style={{ width: `${Math.min(100, (selectedDevice.dataUsageMb / selectedDevice.dataLimitMb) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400">Active Operator</span>
                  <div className="mt-1 text-xs font-medium text-white truncate">
                    {selectedDevice.operator}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Multi-IMSI Roaming</span>
                </div>

                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400">Private IP (VPC)</span>
                  <div className="mt-1 font-mono text-xs text-white">
                    {selectedDevice.ipAddress}
                  </div>
                  <span className="text-[10px] text-slate-500">APN: aetheris.corp</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                Deployed Location: <strong className="text-slate-200">{selectedDevice.location}, {selectedDevice.country}</strong>
              </span>
              <span className="font-mono text-[11px] text-slate-500">Heartbeat: {selectedDevice.lastHeartbeat}</span>
            </div>
          </div>
        </div>

        {/* Global SIM Fleet Table */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Global SIM Inventory</span>
              <span className="text-xs font-mono text-slate-400">({devices.length} deployed units)</span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search ICCID, name, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48 sm:w-64"
              />
              <div className="flex items-center gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded text-xs font-medium">
                {(['all', 'active', 'suspended'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-2.5 py-1 rounded capitalize transition-colors ${
                      filterStatus === s ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800 uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Device Name / Type</th>
                  <th className="px-4 py-3 font-medium">ICCID</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Roaming Operator</th>
                  <th className="px-4 py-3 font-medium">Data (MB)</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredDevices.map((dev) => (
                  <tr
                    key={dev.iccid}
                    onClick={() => setSelectedDevice(dev)}
                    className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                      selectedDevice.iccid === dev.iccid ? 'bg-cyan-950/20' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{dev.name}</div>
                      <div className="text-[11px] text-slate-400">{dev.type}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-cyan-300">{dev.iccid}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {dev.location}, {dev.country}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{dev.operator}</td>
                    <td className="px-4 py-3 font-mono tabular-nums text-slate-200">
                      {dev.dataUsageMb} / {dev.dataLimitMb}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-mono font-medium text-[11px] uppercase ${
                          dev.status === 'active' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {dev.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(dev.iccid);
                        }}
                        className="px-2.5 py-1 text-[11px] rounded border border-slate-700 bg-slate-800 text-slate-200 hover:text-white hover:border-slate-600 transition-colors"
                      >
                        {dev.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
