import { motion } from 'framer-motion';
import { Power, Wifi, Shield } from 'lucide-react';

interface StatusBarProps {
  isRiding: boolean;
  onToggleRide: () => void;
  faultCount: number;
}

export default function StatusBar({ isRiding, onToggleRide, faultCount }: StatusBarProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card/50 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-xl font-bold gradient-neon-text tracking-widest">
          BREAK BREAKER
        </h1>
        <div className="hidden sm:flex items-center gap-1.5 ml-4">
          <Wifi size={14} className="text-neon-green" />
          <span className="text-[10px] text-muted-foreground font-mono">CONNECTED</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {faultCount > 0 && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-red/10 border border-neon-red/30"
          >
            <Shield size={14} className="text-neon-red" />
            <span className="text-xs font-display text-neon-red">{faultCount}</span>
          </motion.div>
        )}

        <button
          onClick={onToggleRide}
          className={`flex items-center gap-2 px-5 py-2 rounded-full font-display text-sm tracking-wider transition-all ${
            isRiding
              ? 'bg-neon-red/20 text-neon-red border border-neon-red/40 glow-red'
              : 'bg-neon-green/20 text-neon-green border border-neon-green/40 glow-green'
          }`}
        >
          <Power size={16} />
          {isRiding ? 'STOP' : 'START'}
        </button>
      </div>
    </header>
  );
}
