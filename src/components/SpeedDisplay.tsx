import { motion } from 'framer-motion';
import CircularGauge from './CircularGauge';

interface SpeedDisplayProps {
  speed: number;
  rpm: number;
  gear: number;
}

export default function SpeedDisplay({ speed, rpm, gear }: SpeedDisplayProps) {
  return (
    <div className="glass-card neon-border-blue p-6 flex flex-col items-center gap-4">
      <CircularGauge
        value={speed}
        max={200}
        label="Speed"
        unit="km/h"
        size={220}
        variant="speed"
        warningThreshold={120}
        criticalThreshold={160}
      />
      <div className="flex items-center gap-8">
        <div className="text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-body">RPM</div>
          <motion.div
            key={rpm}
            className="text-lg font-display font-bold text-neon-blue"
          >
            {rpm.toLocaleString()}
          </motion.div>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-body">Gear</div>
          <div className="text-lg font-display font-bold text-neon-blue">
            {gear === 0 ? 'N' : gear}
          </div>
        </div>
      </div>
    </div>
  );
}
