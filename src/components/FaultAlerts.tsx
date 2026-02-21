import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, ChevronRight } from 'lucide-react';
import type { Fault } from '@/hooks/useBikeData';

interface FaultAlertsProps {
  faults: Fault[];
  onDismiss: (id: string) => void;
}

const severityStyles: Record<string, { bg: string; border: string; icon: string }> = {
  low: {
    bg: 'bg-neon-amber/5',
    border: 'border-neon-amber/30',
    icon: 'text-neon-amber',
  },
  medium: {
    bg: 'bg-neon-amber/10',
    border: 'border-neon-amber/50',
    icon: 'text-neon-amber',
  },
  critical: {
    bg: 'bg-neon-red/10',
    border: 'border-neon-red/50',
    icon: 'text-neon-red',
  },
};

export default function FaultAlerts({ faults, onDismiss }: FaultAlertsProps) {
  if (faults.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-display text-sm tracking-wider uppercase text-neon-red flex items-center gap-2">
        <AlertTriangle size={16} />
        Active Alerts ({faults.length})
      </h3>
      <AnimatePresence>
        {faults.map(fault => {
          const s = severityStyles[fault.severity];
          return (
            <motion.div
              key={fault.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`${s.bg} ${s.border} border rounded-lg p-4 relative`}
            >
              <button
                onClick={() => onDismiss(fault.id)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className={`${s.icon} mt-0.5 shrink-0 animate-pulse-glow`} />
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm text-foreground">{fault.component}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                        fault.severity === 'critical'
                          ? 'bg-neon-red/20 text-neon-red'
                          : 'bg-neon-amber/20 text-neon-amber'
                      }`}
                    >
                      {fault.severity}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-body">{fault.description}</p>
                  <div className="flex items-center gap-1 text-xs text-neon-blue mt-2">
                    <ChevronRight size={12} />
                    <span className="font-body">{fault.solution}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
