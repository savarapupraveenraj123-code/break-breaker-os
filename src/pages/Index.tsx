import { motion } from 'framer-motion';
import {
  Thermometer,
  Fuel,
  Battery,
  Gauge,
  CircleDot,
  Disc,
  Activity,
  MapPin,
} from 'lucide-react';
import { useBikeData } from '@/hooks/useBikeData';
import StatusBar from '@/components/StatusBar';
import SpeedDisplay from '@/components/SpeedDisplay';
import CircularGauge from '@/components/CircularGauge';
import MetricCard from '@/components/MetricCard';
import FaultAlerts from '@/components/FaultAlerts';
import GPSMap from '@/components/GPSMap';

const Index = () => {
  const { data, faults, isRiding, toggleRide, dismissFault } = useBikeData();

  const tempStatus = data.engineTemp > 110 ? 'critical' : data.engineTemp > 95 ? 'warning' : 'normal';
  const fuelStatus = data.fuelLevel < 10 ? 'critical' : data.fuelLevel < 20 ? 'warning' : 'normal';
  const batteryStatus = data.batteryHealth < 30 ? 'critical' : data.batteryHealth < 50 ? 'warning' : 'normal';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <StatusBar isRiding={isRiding} onToggleRide={toggleRide} faultCount={faults.length} />

      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column - Speed + Gauges */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 space-y-5"
          >
            <SpeedDisplay speed={data.speed} rpm={data.rpm} gear={data.gear} />

            <div className="grid grid-cols-2 gap-4">
              <CircularGauge
                value={data.engineTemp}
                max={140}
                label="Engine Temp"
                unit="°C"
                size={130}
                variant="temp"
                warningThreshold={95}
                criticalThreshold={110}
              />
              <CircularGauge
                value={data.fuelLevel}
                max={100}
                label="Fuel"
                unit="%"
                size={130}
                variant="fuel"
                warningThreshold={20}
                criticalThreshold={10}
              />
            </div>
          </motion.div>

          {/* Center - Map + Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 space-y-5"
          >
            <GPSMap lat={data.lat} lng={data.lng} />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <MetricCard icon={Thermometer} label="Engine" value={data.engineTemp} unit="°C" status={tempStatus} />
              <MetricCard icon={Fuel} label="Fuel" value={data.fuelLevel} unit="%" status={fuelStatus} />
              <MetricCard icon={Battery} label="Battery" value={`${data.batteryHealth.toFixed(0)}`} unit="%" status={batteryStatus} />
              <MetricCard icon={CircleDot} label="Front Tire" value={data.tirePressureFront} unit="PSI" />
              <MetricCard icon={CircleDot} label="Rear Tire" value={data.tirePressureRear} unit="PSI" />
              <MetricCard icon={Disc} label="Brakes" value={`${data.brakeCondition.toFixed(0)}`} unit="%" />
              <MetricCard icon={Activity} label="Vibration" value={data.engineVibration} unit="hz" />
              <MetricCard icon={Gauge} label="Distance" value={data.totalDistance.toLocaleString()} unit="km" />
              <MetricCard icon={MapPin} label="Location" value={`${data.lat.toFixed(3)}, ${data.lng.toFixed(3)}`} />
            </div>
          </motion.div>

          {/* Right Column - Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <FaultAlerts faults={faults} onDismiss={dismissFault} />

            {faults.length === 0 && (
              <div className="glass-card neon-border-blue p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neon-green/10 flex items-center justify-center">
                  <Activity size={24} className="text-neon-green" />
                </div>
                <p className="font-display text-sm text-neon-green">ALL SYSTEMS OK</p>
                <p className="text-xs text-muted-foreground font-body mt-1">No faults detected</p>
              </div>
            )}

            {/* Ride Status */}
            <div className="glass-card neon-border-blue p-4 mt-5">
              <h3 className="font-display text-xs tracking-wider uppercase text-muted-foreground mb-3">
                Ride Status
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Status</span>
                  <span className={isRiding ? 'text-neon-green' : 'text-muted-foreground'}>
                    {isRiding ? 'ACTIVE' : 'PARKED'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Distance</span>
                  <span className="text-foreground">{data.totalDistance.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Engine</span>
                  <span className={
                    tempStatus === 'critical' ? 'text-neon-red' :
                    tempStatus === 'warning' ? 'text-neon-amber' : 'text-neon-green'
                  }>
                    {data.engineTemp}°C
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;
