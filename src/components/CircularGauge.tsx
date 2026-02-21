import { motion } from 'framer-motion';

interface CircularGaugeProps {
  value: number;
  max: number;
  label: string;
  unit: string;
  size?: number;
  variant?: 'speed' | 'temp' | 'fuel' | 'battery' | 'pressure' | 'brake';
  warningThreshold?: number;
  criticalThreshold?: number;
}

const variantColors: Record<string, { normal: string; warning: string; critical: string }> = {
  speed: { normal: '#00d4ff', warning: '#ffaa00', critical: '#ff2d55' },
  temp: { normal: '#00d4ff', warning: '#ffaa00', critical: '#ff2d55' },
  fuel: { normal: '#00ff8a', warning: '#ffaa00', critical: '#ff2d55' },
  battery: { normal: '#00ff8a', warning: '#ffaa00', critical: '#ff2d55' },
  pressure: { normal: '#00d4ff', warning: '#ffaa00', critical: '#ff2d55' },
  brake: { normal: '#00ff8a', warning: '#ffaa00', critical: '#ff2d55' },
};

export default function CircularGauge({
  value,
  max,
  label,
  unit,
  size = 160,
  variant = 'speed',
  warningThreshold,
  criticalThreshold,
}: CircularGaugeProps) {
  const pct = Math.min(value / max, 1);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius * 0.75; // 270 degree arc
  const offset = circumference * (1 - pct);
  const colors = variantColors[variant];

  let color = colors.normal;
  if (criticalThreshold !== undefined && value >= criticalThreshold) color = colors.critical;
  else if (warningThreshold !== undefined && value >= warningThreshold) color = colors.warning;

  // For fuel/battery, invert logic (low = bad)
  if ((variant === 'fuel' || variant === 'battery' || variant === 'brake') && criticalThreshold !== undefined) {
    if (value <= criticalThreshold) color = colors.critical;
    else if (warningThreshold !== undefined && value <= warningThreshold) color = colors.warning;
    else color = colors.normal;
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(225 25% 16%)"
          strokeWidth={8}
          strokeDasharray={`${circumference} ${2 * Math.PI * radius * 0.25}`}
          strokeLinecap="round"
          transform={`rotate(135 ${size / 2} ${size / 2})`}
        />
        {/* Value arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeDasharray={`${circumference} ${2 * Math.PI * radius * 0.25}`}
          strokeLinecap="round"
          transform={`rotate(135 ${size / 2} ${size / 2})`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
        {/* Value text */}
        <text
          x={size / 2}
          y={size / 2 - 4}
          textAnchor="middle"
          fill={color}
          className="font-display"
          fontSize={size > 140 ? 32 : 22}
          fontWeight={700}
        >
          {Math.round(value)}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 18}
          textAnchor="middle"
          fill="hsl(215 20% 55%)"
          className="font-body"
          fontSize={12}
        >
          {unit}
        </text>
      </svg>
      <span className="text-xs font-body text-muted-foreground tracking-wider uppercase">{label}</span>
    </div>
  );
}
