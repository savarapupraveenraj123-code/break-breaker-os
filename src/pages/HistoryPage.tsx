import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Fuel, Gauge, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts';

const mockRides = [
  { id: 1, date: '2026-02-21', duration: '45 min', distance: 28.4, avgSpeed: 38, maxSpeed: 72, fuel: 2.1, route: 'Home → Office' },
  { id: 2, date: '2026-02-20', duration: '1h 12min', distance: 52.7, avgSpeed: 44, maxSpeed: 85, fuel: 3.8, route: 'Office → Mall → Home' },
  { id: 3, date: '2026-02-19', duration: '32 min', distance: 18.9, avgSpeed: 35, maxSpeed: 60, fuel: 1.4, route: 'Home → Gym' },
  { id: 4, date: '2026-02-18', duration: '1h 38min', distance: 74.2, avgSpeed: 46, maxSpeed: 95, fuel: 5.2, route: 'City Tour' },
  { id: 5, date: '2026-02-17', duration: '25 min', distance: 14.1, avgSpeed: 34, maxSpeed: 55, fuel: 1.0, route: 'Home → Market' },
];

const speedHistory = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  speed: Math.random() * 60 + 10,
  temp: Math.random() * 30 + 75,
}));

const weeklyDistance = [
  { day: 'Mon', km: 32 },
  { day: 'Tue', km: 55 },
  { day: 'Wed', km: 18 },
  { day: 'Thu', km: 74 },
  { day: 'Fri', km: 41 },
  { day: 'Sat', km: 89 },
  { day: 'Sun', km: 25 },
];

export default function HistoryPage() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-xl tracking-wider text-foreground mb-1">RIDE HISTORY</h2>
        <p className="text-sm text-muted-foreground font-body">Your recent rides and performance data</p>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card neon-border-blue p-5">
          <h3 className="font-display text-xs tracking-wider uppercase text-neon-blue mb-4">Weekly Distance</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weeklyDistance}>
              <defs>
                <linearGradient id="distGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#555" fontSize={11} fontFamily="Rajdhani" />
              <YAxis stroke="#555" fontSize={11} />
              <Tooltip contentStyle={{ background: 'hsl(225 35% 9%)', border: '1px solid hsl(225 25% 16%)', borderRadius: 8, fontFamily: 'Rajdhani' }} />
              <Area type="monotone" dataKey="km" stroke="#00d4ff" fill="url(#distGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card neon-border-blue p-5">
          <h3 className="font-display text-xs tracking-wider uppercase text-neon-blue mb-4">Speed & Temp (24h)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={speedHistory}>
              <XAxis dataKey="time" stroke="#555" fontSize={10} interval={5} fontFamily="Rajdhani" />
              <YAxis stroke="#555" fontSize={10} />
              <Tooltip contentStyle={{ background: 'hsl(225 35% 9%)', border: '1px solid hsl(225 25% 16%)', borderRadius: 8, fontFamily: 'Rajdhani' }} />
              <Line type="monotone" dataKey="speed" stroke="#00d4ff" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="temp" stroke="#ff2d55" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Ride List */}
      <div className="space-y-3">
        {mockRides.map((ride, i) => (
          <motion.div
            key={ride.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className="glass-card neon-border-blue p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-neon-blue/10 flex items-center justify-center shrink-0">
                <Calendar size={18} className="text-neon-blue" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-sm text-foreground">{ride.date}</p>
                <p className="text-xs text-muted-foreground font-body flex items-center gap-1">
                  <MapPin size={10} /> {ride.route}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap text-xs font-body">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock size={12} className="text-neon-blue" />
                {ride.duration}
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Gauge size={12} className="text-neon-blue" />
                {ride.distance} km
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <TrendingUp size={12} className="text-neon-green" />
                Avg {ride.avgSpeed} km/h
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Fuel size={12} className="text-neon-amber" />
                {ride.fuel} L
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
