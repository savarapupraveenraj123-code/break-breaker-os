import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, Battery, Bike, CheckCircle2, CircleDot, Disc, Fuel, Gauge, LocateFixed, MapPin, Navigation, PhoneCall, Radio, Share2, ShieldCheck, Thermometer, Wrench, Zap } from 'lucide-react';
import type { BikeData, Fault, GPSStatus } from '@/hooks/useBikeData';
import SpeedDisplay from '@/components/SpeedDisplay';
import CircularGauge from '@/components/CircularGauge';
import MetricCard from '@/components/MetricCard';
import FaultAlerts from '@/components/FaultAlerts';
import GPSMap from '@/components/GPSMap';

interface DashboardPageProps {
  data: BikeData; faults: Fault[]; isRiding: boolean; dismissFault: (id: string) => void;
  gpsStatus: GPSStatus; requestLocation: () => void; stopLocation: () => void;
  lastUpdated: Date; telemetryMode: 'DEMO';
}
const statusLabel = (status: GPSStatus) => ({ idle: 'GPS OFF', tracking: 'GPS LIVE', denied: 'PERMISSION DENIED', unsupported: 'GPS UNAVAILABLE', error: 'GPS SIGNAL ISSUE' }[status]);

export default function DashboardPage({ data, faults, isRiding, dismissFault, gpsStatus, requestLocation, stopLocation, lastUpdated, telemetryMode }: DashboardPageProps) {
  const [copied, setCopied] = useState(false);
  const tempStatus = data.engineTemp > 110 ? 'critical' : data.engineTemp > 95 ? 'warning' : 'normal';
  const fuelStatus = data.fuelLevel < 10 ? 'critical' : data.fuelLevel < 20 ? 'warning' : 'normal';
  const batteryStatus = data.batteryHealth < 30 ? 'critical' : data.batteryHealth < 50 ? 'warning' : 'normal';
  const rideScore = useMemo(() => Math.max(0, Math.min(100, Math.round(100 - faults.reduce((sum, fault) => sum + (fault.severity === 'critical' ? 28 : fault.severity === 'medium' ? 12 : 5), 0)))), [faults]);
  const hasLocation = gpsStatus === 'tracking' && data.lat !== 0 && data.lng !== 0;
  const shareLocation = async () => {
    if (!hasLocation) return;
    const url = `https://www.google.com/maps?q=${data.lat},${data.lng}`;
    if (navigator.share) await navigator.share({ title: 'My bike location', text: 'My current GPS location', url });
    else if (navigator.clipboard) { await navigator.clipboard.writeText(url); setCopied(true); window.setTimeout(() => setCopied(false), 2200); }
  };

  return (
    <div className="relative p-4 md:p-7 max-w-[1600px] mx-auto w-full space-y-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.10),transparent_65%)]" />
      <div className="relative flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.28em] text-neon-blue mb-3"><span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" /> RIDER COMMAND CENTER <span className="text-muted-foreground">/ LIVE SYSTEMS</span></div>
          <h2 className="text-2xl md:text-4xl font-display font-bold tracking-tight">Your ride. <span className="gradient-neon-text">Under control.</span></h2>
          <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-2xl">A unified cockpit for ride telemetry, vehicle health, location awareness and rapid response.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-neon-amber/30 bg-neon-amber/10 px-3 py-2 text-[10px] font-mono tracking-wider text-neon-amber"><Radio size={13}/> DEMO TELEMETRY</span>
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-mono tracking-wider ${gpsStatus === 'tracking' ? 'border-neon-green/30 bg-neon-green/10 text-neon-green' : 'border-border bg-card/70 text-muted-foreground'}`}><MapPin size={13}/> {statusLabel(gpsStatus)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: 'RIDE STATUS', value: isRiding ? 'IN MOTION' : 'PARKED', detail: isRiding ? 'Demo ride session active' : 'Ready when you are', icon: Bike, color: isRiding ? 'text-neon-green' : 'text-muted-foreground' },
          { label: 'HEALTH SCORE', value: `${rideScore}/100`, detail: faults.length ? `${faults.length} active alert(s)` : 'No active alerts', icon: ShieldCheck, color: rideScore > 75 ? 'text-neon-green' : 'text-neon-amber' },
          { label: 'ODOMETER', value: `${data.totalDistance.toLocaleString()} km`, detail: 'Session estimate', icon: Gauge, color: 'text-neon-blue' },
          { label: 'LAST UPDATE', value: lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), detail: 'Telemetry refresh: 1 second', icon: Activity, color: 'text-neon-purple' },
        ].map((item, i) => <motion.div key={item.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .06 }} className="glass-card p-4 md:p-5">
          <div className="flex items-center justify-between"><span className="text-[9px] tracking-[.2em] font-mono text-muted-foreground">{item.label}</span><item.icon size={16} className={item.color}/></div>
          <p className="font-display text-xl md:text-2xl font-bold mt-3">{item.value}</p><p className="text-xs text-muted-foreground mt-1">{item.detail}</p>
        </motion.div>)}
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-5">
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="2xl:col-span-4 space-y-4">
          <div className="glass-card neon-border-blue p-4 md:p-5">
            <div className="flex justify-between items-center mb-4"><div><p className="text-[10px] font-mono tracking-[.2em] text-neon-blue">POWERTRAIN / 01</p><h3 className="font-display text-sm mt-1">Ride telemetry</h3></div><span className="text-[9px] font-mono text-neon-amber border border-neon-amber/30 rounded-full px-2 py-1">SIMULATED</span></div>
            <SpeedDisplay speed={data.speed} rpm={data.rpm} gear={data.gear} />
            <div className="grid grid-cols-2 gap-3 mt-4">
              <CircularGauge value={data.engineTemp} max={140} label="Engine Temp" unit="°C" size={135} variant="temp" warningThreshold={95} criticalThreshold={110}/>
              <CircularGauge value={data.fuelLevel} max={100} label="Fuel Level" unit="%" size={135} variant="fuel" warningThreshold={20} criticalThreshold={10}/>
            </div>
          </div>
          <div className="glass-card p-4 md:p-5">
            <div className="flex items-center justify-between mb-3"><div><p className="text-[10px] font-mono tracking-[.2em] text-neon-blue">LOCATION / 02</p><h3 className="font-display text-sm mt-1">GPS tracking</h3></div><LocateFixed size={18} className="text-neon-blue"/></div>
            <p className="text-xs text-muted-foreground mb-4">Use your device's GPS to show your actual location. Location permission is requested only when you start tracking.</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={requestLocation} className="flex-1 min-w-[140px] rounded-lg bg-primary text-primary-foreground px-4 py-3 text-xs font-display tracking-wider hover:opacity-90 transition"><Navigation size={14} className="inline mr-2"/>START GPS</button>
              <button onClick={stopLocation} className="rounded-lg border border-border px-4 py-3 text-xs font-display tracking-wider hover:bg-muted/40">STOP</button>
              {hasLocation && <button onClick={shareLocation} className="rounded-lg border border-neon-blue/30 text-neon-blue px-4 py-3 text-xs font-display tracking-wider"><Share2 size={14} className="inline mr-2"/>{copied ? 'COPIED' : 'SHARE'}</button>}
            </div>
            {gpsStatus === 'denied' && <p className="text-xs text-neon-amber mt-3">Location permission denied. Enable it in your browser settings and try again.</p>}
            {gpsStatus === 'unsupported' && <p className="text-xs text-neon-amber mt-3">This browser does not support geolocation.</p>}
            {hasLocation && <p className="font-mono text-[10px] text-muted-foreground mt-3">{data.lat.toFixed(5)}, {data.lng.toFixed(5)}</p>}
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className="2xl:col-span-5 space-y-4">
          {hasLocation ? <GPSMap lat={data.lat} lng={data.lng}/> : <div className="glass-card min-h-[285px] p-6 flex flex-col items-center justify-center text-center"><div className="w-14 h-14 rounded-2xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center mb-4"><MapPin className="text-neon-blue" size={25}/></div><h3 className="font-display text-sm">GPS awaiting signal</h3><p className="text-xs text-muted-foreground mt-2 max-w-sm">Start GPS tracking to load your real position on the map. No location is fabricated or silently collected.</p><button onClick={requestLocation} className="mt-4 text-xs text-neon-blue border border-neon-blue/30 rounded-lg px-4 py-2">Enable location</button></div>}
          <div className="glass-card p-4 md:p-5">
            <div className="flex items-center justify-between mb-4"><div><p className="text-[10px] font-mono tracking-[.2em] text-neon-blue">VEHICLE CONDITION / 03</p><h3 className="font-display text-sm mt-1">Health matrix</h3></div><Activity size={17} className="text-neon-green"/></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <MetricCard icon={Thermometer} label="Engine" value={data.engineTemp} unit="°C" status={tempStatus}/>
              <MetricCard icon={Fuel} label="Fuel" value={data.fuelLevel} unit="%" status={fuelStatus}/>
              <MetricCard icon={Battery} label="Battery" value={data.batteryHealth.toFixed(0)} unit="%" status={batteryStatus}/>
              <MetricCard icon={CircleDot} label="Front tyre" value={data.tirePressureFront} unit="PSI"/>
              <MetricCard icon={CircleDot} label="Rear tyre" value={data.tirePressureRear} unit="PSI"/>
              <MetricCard icon={Disc} label="Brakes" value={data.brakeCondition.toFixed(0)} unit="%"/>
              <MetricCard icon={Activity} label="Vibration" value={data.engineVibration} unit="Hz"/>
              <MetricCard icon={Zap} label="RPM" value={data.rpm.toLocaleString()} unit="rpm"/>
              <MetricCard icon={Gauge} label="Gear" value={data.gear} unit=""/>
            </div>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16 }} className="2xl:col-span-3 space-y-4">
          <FaultAlerts faults={faults} onDismiss={dismissFault}/>
          {faults.length === 0 && <div className="glass-card p-5"><div className="flex items-center gap-2 text-neon-green"><CheckCircle2 size={18}/><span className="font-display text-xs">NO ACTIVE ALERTS</span></div><p className="text-xs text-muted-foreground mt-2">Demo telemetry is currently within configured thresholds.</p></div>}
          <div className="glass-card p-5 space-y-4">
            <div><p className="text-[10px] font-mono tracking-[.2em] text-neon-blue">RIDER RESPONSE / 04</p><h3 className="font-display text-sm mt-1">Need help on the road?</h3></div>
            <a href="tel:112" className="flex items-center gap-3 rounded-xl border border-neon-red/30 bg-neon-red/10 p-3 hover:bg-neon-red/15 transition"><div className="w-9 h-9 rounded-lg bg-neon-red/15 flex items-center justify-center"><PhoneCall size={17} className="text-neon-red"/></div><div><p className="text-xs font-display text-neon-red">EMERGENCY CALL · 112</p><p className="text-[10px] text-muted-foreground">Use only for genuine emergencies</p></div></a>
            <a href="https://www.google.com/maps/search/motorcycle+repair+near+me/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-3 hover:bg-muted/40 transition"><div className="w-9 h-9 rounded-lg bg-neon-blue/10 flex items-center justify-center"><Wrench size={17} className="text-neon-blue"/></div><div><p className="text-xs font-display">FIND A BIKE MECHANIC</p><p className="text-[10px] text-muted-foreground">Open nearby repair search in Maps</p></div></a>
            <div className="rounded-xl bg-muted/20 p-3"><div className="flex items-center gap-2 text-neon-amber"><AlertTriangle size={14}/><span className="text-[10px] font-mono tracking-wider">SAFETY FIRST</span></div><p className="text-[11px] leading-relaxed text-muted-foreground mt-2">This prototype is not connected to certified vehicle sensors. Never use demo values to decide whether a motorcycle is safe to ride.</p></div>
          </div>
        </motion.section>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-muted-foreground border-t border-border/50 pt-4"><span>BREAK BREAKER OS · RIDER INTELLIGENCE</span><span>TELEMETRY: {telemetryMode} · REFRESH: 1s · GPS: {gpsStatus.toUpperCase()}</span></div>
    </div>
  );
}
