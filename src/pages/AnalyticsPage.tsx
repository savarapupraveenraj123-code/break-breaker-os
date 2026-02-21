import { motion } from 'framer-motion';
import { TrendingUp, Fuel, Gauge, Zap, Award, Leaf } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, RadialBarChart, RadialBar } from 'recharts';

const efficiencyData = [
  { name: 'City', value: 42, color: '#00d4ff' },
  { name: 'Highway', value: 35, color: '#ff2d55' },
  { name: 'Mixed', value: 23, color: '#00ff8a' },
];

const monthlyData = [
  { month: 'Sep', rides: 18, distance: 420 },
  { month: 'Oct', rides: 22, distance: 580 },
  { month: 'Nov', rides: 15, distance: 340 },
  { month: 'Dec', rides: 20, distance: 510 },
  { month: 'Jan', rides: 25, distance: 680 },
  { month: 'Feb', rides: 12, distance: 280 },
];

const ecoScore = [{ name: 'Score', value: 78, fill: '#00ff8a' }];

const leaderboard = [
  { rank: 1, name: 'RiderX_Pro', score: 94, avatar: '🏆' },
  { rank: 2, name: 'EcoRider22', score: 91, avatar: '🥈' },
  { rank: 3, name: 'BikeWolf', score: 87, avatar: '🥉' },
  { rank: 4, name: 'You', score: 78, avatar: '🏍️', isUser: true },
  { rank: 5, name: 'SpeedDemon', score: 72, avatar: '⚡' },
];

export default function AnalyticsPage() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-xl tracking-wider text-foreground mb-1">ANALYTICS</h2>
        <p className="text-sm text-muted-foreground font-body">Riding patterns, efficiency, and eco score</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Gauge, label: 'Total Distance', value: '12,847 km', color: 'text-neon-blue' },
          { icon: Fuel, label: 'Avg Mileage', value: '42 km/L', color: 'text-neon-green' },
          { icon: Zap, label: 'Total Rides', value: '342', color: 'text-neon-amber' },
          { icon: TrendingUp, label: 'Avg Speed', value: '38 km/h', color: 'text-neon-purple' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="glass-card neon-border-blue p-4"
          >
            <stat.icon size={18} className={stat.color} />
            <p className="text-2xl font-display font-bold text-foreground mt-2">{stat.value}</p>
            <p className="text-xs text-muted-foreground font-body">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Riding Pattern Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card neon-border-blue p-5">
          <h3 className="font-display text-xs tracking-wider uppercase text-neon-blue mb-4">Riding Pattern</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={efficiencyData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                {efficiencyData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {efficiencyData.map(e => (
              <div key={e.name} className="flex items-center gap-1.5 text-xs font-body text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ background: e.color }} />
                {e.name} {e.value}%
              </div>
            ))}
          </div>
        </motion.div>

        {/* Monthly Rides Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card neon-border-blue p-5">
          <h3 className="font-display text-xs tracking-wider uppercase text-neon-blue mb-4">Monthly Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" stroke="#555" fontSize={11} fontFamily="Rajdhani" />
              <YAxis stroke="#555" fontSize={11} />
              <Tooltip contentStyle={{ background: 'hsl(225 35% 9%)', border: '1px solid hsl(225 25% 16%)', borderRadius: 8, fontFamily: 'Rajdhani' }} />
              <Bar dataKey="distance" fill="#00d4ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Eco Score */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card neon-border-blue p-5">
          <h3 className="font-display text-xs tracking-wider uppercase text-neon-green mb-4 flex items-center gap-2">
            <Leaf size={14} /> Eco Score
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={ecoScore} startAngle={180} endAngle={0}>
              <RadialBar background={{ fill: 'hsl(225 25% 16%)' }} dataKey="value" cornerRadius={10} />
            </RadialBarChart>
          </ResponsiveContainer>
          <p className="text-center font-display text-3xl font-bold text-neon-green -mt-6">78</p>
          <p className="text-center text-xs text-muted-foreground font-body mt-1">Good — Keep it up!</p>
        </motion.div>
      </div>

      {/* Leaderboard */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card neon-border-blue p-5">
        <h3 className="font-display text-xs tracking-wider uppercase text-neon-blue mb-4 flex items-center gap-2">
          <Award size={14} /> Eco-Friendly Leaderboard
        </h3>
        <div className="space-y-2">
          {leaderboard.map(entry => (
            <div
              key={entry.rank}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                entry.isUser
                  ? 'bg-primary/10 border border-primary/30'
                  : 'bg-muted/20 hover:bg-muted/40'
              }`}
            >
              <span className="font-display text-sm text-muted-foreground w-6">#{entry.rank}</span>
              <span className="text-xl">{entry.avatar}</span>
              <span className={`font-body text-sm flex-1 ${entry.isUser ? 'text-primary font-bold' : 'text-foreground'}`}>
                {entry.name}
              </span>
              <span className="font-display text-sm text-neon-green">{entry.score}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
