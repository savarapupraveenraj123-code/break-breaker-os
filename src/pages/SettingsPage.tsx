import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bike, Plus, User, Bell, Palette, Sliders } from 'lucide-react';

const mockBikes = [
  { id: '1', name: 'Royal Enfield Classic 350', plate: 'DL 01 AB 1234', active: true },
  { id: '2', name: 'KTM Duke 390', plate: 'DL 02 CD 5678', active: false },
];

export default function SettingsPage() {
  const [selectedBike, setSelectedBike] = useState('1');
  const [notifications, setNotifications] = useState(true);
  const [tempThreshold, setTempThreshold] = useState(100);
  const [fuelThreshold, setFuelThreshold] = useState(15);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto w-full space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-xl tracking-wider text-foreground mb-1">SETTINGS</h2>
        <p className="text-sm text-muted-foreground font-body">Configure your bikes, alerts, and preferences</p>
      </motion.div>

      {/* Multi-Bike Support */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card neon-border-blue p-5">
        <h3 className="font-display text-xs tracking-wider uppercase text-neon-blue mb-4 flex items-center gap-2">
          <Bike size={14} /> My Bikes
        </h3>
        <div className="space-y-2">
          {mockBikes.map(bike => (
            <div
              key={bike.id}
              onClick={() => setSelectedBike(bike.id)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all ${
                selectedBike === bike.id
                  ? 'bg-primary/10 border border-primary/30'
                  : 'bg-muted/20 hover:bg-muted/40 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bike size={20} className={selectedBike === bike.id ? 'text-primary' : 'text-muted-foreground'} />
                <div>
                  <p className="font-body text-sm text-foreground">{bike.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{bike.plate}</p>
                </div>
              </div>
              {selectedBike === bike.id && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-green/20 text-neon-green uppercase font-bold">Active</span>
              )}
            </div>
          ))}
          <button className="w-full py-3 rounded-xl border border-dashed border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all flex items-center justify-center gap-2 text-sm font-body">
            <Plus size={16} />
            Add New Bike
          </button>
        </div>
      </motion.div>

      {/* Alert Thresholds */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card neon-border-blue p-5">
        <h3 className="font-display text-xs tracking-wider uppercase text-neon-amber mb-4 flex items-center gap-2">
          <Sliders size={14} /> Alert Thresholds
        </h3>
        <div className="space-y-5">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-body text-muted-foreground">Engine Temp Warning</span>
              <span className="text-sm font-display text-foreground">{tempThreshold}°C</span>
            </div>
            <input
              type="range"
              min={80}
              max={130}
              value={tempThreshold}
              onChange={e => setTempThreshold(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none bg-muted cursor-pointer accent-primary"
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-body text-muted-foreground">Low Fuel Warning</span>
              <span className="text-sm font-display text-foreground">{fuelThreshold}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              value={fuelThreshold}
              onChange={e => setFuelThreshold(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none bg-muted cursor-pointer accent-primary"
            />
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card neon-border-blue p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-neon-blue" />
            <div>
              <p className="font-display text-sm text-foreground">Push Notifications</p>
              <p className="text-xs text-muted-foreground font-body">Receive alerts for faults and reminders</p>
            </div>
          </div>
          <div
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${
              notifications ? 'bg-primary/30' : 'bg-muted'
            }`}
          >
            <motion.div
              className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                notifications ? 'bg-primary' : 'bg-muted-foreground'
              }`}
              animate={{ left: notifications ? 26 : 4 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card neon-border-blue p-5">
        <h3 className="font-display text-xs tracking-wider uppercase text-neon-blue mb-4 flex items-center gap-2">
          <User size={14} /> Profile
        </h3>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <User size={28} className="text-primary" />
          </div>
          <div>
            <p className="font-display text-sm text-foreground">Rider_001</p>
            <p className="text-xs text-muted-foreground font-body">rider@breakbreaker.app</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
