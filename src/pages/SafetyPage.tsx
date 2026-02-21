import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  ShieldAlert,
  Phone,
  MapPin,
  Lock,
  Unlock,
  AlertTriangle,
  Bell,
  Wrench,
  Share2,
  Siren,
} from 'lucide-react';

interface ServiceReminder {
  id: string;
  title: string;
  dueIn: string;
  severity: 'low' | 'medium' | 'high';
}

const reminders: ServiceReminder[] = [
  { id: '1', title: 'Oil Change', dueIn: '200 km', severity: 'high' },
  { id: '2', title: 'Brake Pad Inspection', dueIn: '1,500 km', severity: 'medium' },
  { id: '3', title: 'Chain Lubrication', dueIn: '50 km', severity: 'high' },
  { id: '4', title: 'Air Filter Replacement', dueIn: '3,200 km', severity: 'low' },
];

export default function SafetyPage() {
  const [antiTheft, setAntiTheft] = useState(false);
  const [crashDetection, setCrashDetection] = useState(true);
  const [geofencing, setGeofencing] = useState(false);
  const [sosActive, setSosActive] = useState(false);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto w-full space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-xl tracking-wider text-foreground mb-1">SAFETY & SECURITY</h2>
        <p className="text-sm text-muted-foreground font-body">Anti-theft, crash detection, SOS, and service reminders</p>
      </motion.div>

      {/* SOS Button */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}>
        <div className={`glass-card p-6 text-center transition-all ${sosActive ? 'neon-border-red bg-neon-red/5' : 'neon-border-blue'}`}>
          <button
            onClick={() => setSosActive(!sosActive)}
            className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all ${
              sosActive
                ? 'bg-neon-red/30 border-2 border-neon-red glow-red animate-pulse-glow'
                : 'bg-neon-red/10 border-2 border-neon-red/30 hover:bg-neon-red/20'
            }`}
          >
            <Siren size={40} className="text-neon-red" />
          </button>
          <p className="font-display text-sm mt-4 text-foreground">{sosActive ? 'SOS ACTIVE — SENDING ALERT' : 'EMERGENCY SOS'}</p>
          <p className="text-xs text-muted-foreground font-body mt-1">
            {sosActive ? 'Location shared with emergency contacts' : 'Tap to send emergency alert with your GPS location'}
          </p>
          {sosActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center justify-center gap-2 text-xs text-neon-red font-body"
            >
              <Phone size={14} className="animate-bounce" />
              Contacting emergency services...
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Security Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: antiTheft ? Lock : Unlock,
            label: 'Anti-Theft Mode',
            desc: 'Alert on movement when parked',
            active: antiTheft,
            onToggle: () => setAntiTheft(!antiTheft),
            activeColor: 'text-neon-red',
          },
          {
            icon: ShieldAlert,
            label: 'Crash Detection',
            desc: 'Auto-alert on impact',
            active: crashDetection,
            onToggle: () => setCrashDetection(!crashDetection),
            activeColor: 'text-neon-amber',
          },
          {
            icon: MapPin,
            label: 'Geofencing',
            desc: 'Alert when bike leaves zone',
            active: geofencing,
            onToggle: () => setGeofencing(!geofencing),
            activeColor: 'text-neon-blue',
          },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className={`glass-card p-5 cursor-pointer transition-all ${
              item.active ? 'neon-border-blue' : 'border border-border/30'
            }`}
            onClick={item.onToggle}
          >
            <div className="flex items-center justify-between mb-3">
              <item.icon size={22} className={item.active ? item.activeColor : 'text-muted-foreground'} />
              <div
                className={`w-12 h-6 rounded-full relative transition-all ${
                  item.active ? 'bg-primary/30' : 'bg-muted'
                }`}
              >
                <motion.div
                  className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                    item.active ? 'bg-primary' : 'bg-muted-foreground'
                  }`}
                  animate={{ left: item.active ? 26 : 4 }}
                />
              </div>
            </div>
            <p className="font-display text-sm text-foreground">{item.label}</p>
            <p className="text-xs text-muted-foreground font-body">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Share Location + Emergency Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card neon-border-blue p-5">
          <h3 className="font-display text-xs tracking-wider uppercase text-neon-blue mb-4 flex items-center gap-2">
            <Share2 size={14} /> Share Live Location
          </h3>
          <p className="text-sm text-muted-foreground font-body mb-4">Share your real-time GPS location with friends or family during a ride.</p>
          <button className="w-full py-2.5 rounded-xl bg-neon-blue/10 border border-neon-blue/30 text-neon-blue font-display text-sm tracking-wider hover:bg-neon-blue/20 transition-all">
            SHARE LOCATION
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card neon-border-blue p-5">
          <h3 className="font-display text-xs tracking-wider uppercase text-neon-blue mb-4 flex items-center gap-2">
            <Phone size={14} /> Emergency Contacts
          </h3>
          <div className="space-y-2">
            {['Mom — +91 98765 43210', 'Dad — +91 87654 32109', 'Emergency — 112'].map(contact => (
              <div key={contact} className="flex items-center gap-2 text-sm font-body text-muted-foreground px-3 py-2 rounded-lg bg-muted/20">
                <Phone size={12} className="text-neon-green" />
                {contact}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Service Reminders */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card neon-border-blue p-5">
        <h3 className="font-display text-xs tracking-wider uppercase text-neon-amber mb-4 flex items-center gap-2">
          <Wrench size={14} /> Service Reminders
        </h3>
        <div className="space-y-2">
          {reminders.map(r => (
            <div key={r.id} className="flex items-center justify-between px-4 py-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-3">
                <Bell
                  size={16}
                  className={
                    r.severity === 'high' ? 'text-neon-red' : r.severity === 'medium' ? 'text-neon-amber' : 'text-neon-green'
                  }
                />
                <span className="font-body text-sm text-foreground">{r.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">Due in {r.dueIn}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                    r.severity === 'high'
                      ? 'bg-neon-red/20 text-neon-red'
                      : r.severity === 'medium'
                      ? 'bg-neon-amber/20 text-neon-amber'
                      : 'bg-neon-green/20 text-neon-green'
                  }`}
                >
                  {r.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
