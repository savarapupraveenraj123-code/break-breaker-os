import { useState, useEffect, useCallback } from 'react';

export interface BikeData {
  speed: number;
  engineTemp: number;
  fuelLevel: number;
  batteryHealth: number;
  tirePressureFront: number;
  tirePressureRear: number;
  brakeCondition: number;
  engineVibration: number;
  totalDistance: number;
  rpm: number;
  gear: number;
  lat: number;
  lng: number;
}

export interface Fault {
  id: string;
  component: string;
  description: string;
  severity: 'low' | 'medium' | 'critical';
  solution: string;
  timestamp: Date;
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const jitter = (base: number, range: number) => base + (Math.random() - 0.5) * range;

export function useBikeData() {
  const [data, setData] = useState<BikeData>({
    speed: 0,
    engineTemp: 85,
    fuelLevel: 72,
    batteryHealth: 94,
    tirePressureFront: 32,
    tirePressureRear: 30,
    brakeCondition: 88,
    engineVibration: 12,
    totalDistance: 12847,
    rpm: 0,
    gear: 0,
    lat: 28.6139,
    lng: 77.2090,
  });

  const [faults, setFaults] = useState<Fault[]>([]);
  const [isRiding, setIsRiding] = useState(false);

  const toggleRide = useCallback(() => setIsRiding(p => !p), []);

  const dismissFault = useCallback((id: string) => {
    setFaults(prev => prev.filter(f => f.id !== id));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const speed = isRiding
          ? clamp(jitter(prev.speed < 40 ? prev.speed + 2 : prev.speed, 8), 0, 180)
          : clamp(prev.speed - 3, 0, 180);

        const rpm = speed > 0 ? clamp(speed * 45 + jitter(0, 200), 800, 9000) : 0;
        const gear = speed === 0 ? 0 : speed < 20 ? 1 : speed < 40 ? 2 : speed < 65 ? 3 : speed < 90 ? 4 : speed < 120 ? 5 : 6;

        const engineTemp = isRiding
          ? clamp(jitter(prev.engineTemp + 0.1, 2), 70, 130)
          : clamp(jitter(prev.engineTemp - 0.3, 1), 25, 130);

        const fuelLevel = isRiding
          ? clamp(prev.fuelLevel - 0.02, 0, 100)
          : prev.fuelLevel;

        const lat = prev.lat + (isRiding ? (Math.random() - 0.5) * 0.0005 : 0);
        const lng = prev.lng + (isRiding ? (Math.random() - 0.5) * 0.0005 : 0);

        return {
          ...prev,
          speed: Math.round(speed),
          rpm: Math.round(rpm),
          gear,
          engineTemp: +engineTemp.toFixed(1),
          fuelLevel: +fuelLevel.toFixed(1),
          batteryHealth: clamp(jitter(prev.batteryHealth, 0.3), 0, 100),
          tirePressureFront: +clamp(jitter(prev.tirePressureFront, 0.2), 20, 40).toFixed(1),
          tirePressureRear: +clamp(jitter(prev.tirePressureRear, 0.2), 20, 40).toFixed(1),
          brakeCondition: +clamp(jitter(prev.brakeCondition, 0.1), 0, 100).toFixed(1),
          engineVibration: +clamp(jitter(prev.engineVibration, 1), 0, 100).toFixed(1),
          totalDistance: +(prev.totalDistance + (isRiding ? speed / 3600 : 0)).toFixed(1),
          lat,
          lng,
        };
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isRiding]);

  // Fault detection
  useEffect(() => {
    const newFaults: Fault[] = [];

    if (data.engineTemp > 110) {
      newFaults.push({
        id: 'engine-overheat',
        component: 'Engine',
        description: 'Engine temperature critically high!',
        severity: 'critical',
        solution: 'Stop riding immediately. Let the engine cool down. Check coolant levels.',
        timestamp: new Date(),
      });
    }

    if (data.fuelLevel < 15) {
      newFaults.push({
        id: 'low-fuel',
        component: 'Fuel',
        description: 'Fuel level critically low',
        severity: data.fuelLevel < 5 ? 'critical' : 'medium',
        solution: 'Refuel at the nearest station. Avoid high RPM riding.',
        timestamp: new Date(),
      });
    }

    if (data.brakeCondition < 40) {
      newFaults.push({
        id: 'brake-wear',
        component: 'Brakes',
        description: 'Brake pads significantly worn',
        severity: data.brakeCondition < 20 ? 'critical' : 'medium',
        solution: 'Get brake pads replaced. Avoid aggressive braking.',
        timestamp: new Date(),
      });
    }

    if (data.tirePressureFront < 25 || data.tirePressureRear < 25) {
      newFaults.push({
        id: 'tire-pressure',
        component: 'Tires',
        description: 'Tire pressure below safe threshold',
        severity: 'medium',
        solution: 'Inflate tires to recommended PSI (30-32 front, 28-30 rear).',
        timestamp: new Date(),
      });
    }

    if (data.engineVibration > 60) {
      newFaults.push({
        id: 'vibration',
        component: 'Engine',
        description: 'Abnormal engine vibration detected',
        severity: data.engineVibration > 80 ? 'critical' : 'low',
        solution: 'Check engine mounts and internal components. Schedule service.',
        timestamp: new Date(),
      });
    }

    if (data.batteryHealth < 30) {
      newFaults.push({
        id: 'battery-low',
        component: 'Battery',
        description: 'Battery health degraded',
        severity: 'medium',
        solution: 'Battery replacement recommended. Avoid short trips.',
        timestamp: new Date(),
      });
    }

    setFaults(prev => {
      const existingIds = new Set(prev.map(f => f.id));
      const toAdd = newFaults.filter(f => !existingIds.has(f.id));
      const activeIds = new Set(newFaults.map(f => f.id));
      const stillActive = prev.filter(f => activeIds.has(f.id));
      return [...stillActive, ...toAdd];
    });
  }, [data]);

  return { data, faults, isRiding, toggleRide, dismissFault };
}
