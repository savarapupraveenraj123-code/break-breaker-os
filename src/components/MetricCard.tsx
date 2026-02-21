import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  status?: 'normal' | 'warning' | 'critical';
}

const statusBorder: Record<string, string> = {
  normal: 'neon-border-blue',
  warning: 'border border-neon-amber/40',
  critical: 'neon-border-red',
};

export default function MetricCard({ icon: Icon, label, value, unit, status = 'normal' }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-4 ${statusBorder[status]} flex flex-col gap-2`}
    >
      <div className="flex items-center gap-2">
        <Icon
          size={18}
          className={
            status === 'critical'
              ? 'text-neon-red'
              : status === 'warning'
              ? 'text-neon-amber'
              : 'text-neon-blue'
          }
        />
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-body">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-display font-bold text-foreground">{value}</span>
        {unit && <span className="text-sm text-muted-foreground font-body">{unit}</span>}
      </div>
    </motion.div>
  );
}
