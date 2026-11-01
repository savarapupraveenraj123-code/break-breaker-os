import { useState, useEffect, useCallback, useRef } from 'react';

export interface BikeData {
  speed: number; engineTemp: number; fuelLevel: number; batteryHealth: number;
  tirePressureFront: number; tirePressureRear: number; brakeCondition: number;
  engineVibration: number; totalDistance: number; rpm: number; gear: number;
  lat: number; lng: number;
}
export interface Fault {
  id: string; component: string; description: string;
  severity: 'low' | 'medium' | 'critical'; solution: string; timestamp: Date;
}
export type GPSStatus = 'idle' | 'tracking' | 'denied' | 'unsupported' | 'error';

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const jitter = (base: number, range: number) => base + (Math.random() - 0.5) * range;

export function useBikeData() {
  const [data, setData] = useState<BikeData>({
    speed: 0, engineTemp: 85, fuelLevel: 72, batteryHealth: 94,
    tirePressureFront: 32, tirePressureRear: 30, brakeCondition: 88,
    engineVibration: 12, totalDistance: 12847, rpm: 0, gear: 0, lat: 0, lng: 0,
  });
  const [faults, setFaults] = useState<Fault[]>([]);
  const [isRiding, setIsRiding] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<GPSStatus>('idle');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const watchId = useRef<number | null>(null);

  const toggleRide = useCallback(() => setIsRiding(p => !p), []);
  const dismissFault = useCallback((id: string) => setFaults(prev => prev.filter(f => f.id !== id)), []);

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setGpsStatus('unsupported');
      return;
    }
    setGpsStatus('tracking');
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    watchId.current = navigator.geolocation.watchPosition(
      position => {
        setData(prev => ({ ...prev, lat: position.coords.latitude, lng: position.coords.longitude }));
        setLastUpdated(new Date());
        setGpsStatus('tracking');
      },
      error => setGpsStatus(error.code === error.PERMISSION_DENIED ? 'denied' : 'error'),
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 12000 },
    );
  }, []);

  const stopLocation = useCallback(() => {
    if (watchId.current !== null && 'geolocation' in navigator) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setGpsStatus('idle');
  }, []);

  useEffect(() => () => {
    if (watchId.current !== null && 'geolocation' in navigator) navigator.geolocation.clearWatch(watchId.current);
  }, []);

  // Clearly labelled demo telemetry. Real engine values require a paired OBD/IoT device.
  useEffect(() => {
    const interval = window.setInterval(() => {
      setData(prev => {
        const speed = isRiding ? clamp(jitter(prev.speed < 40 ? prev.speed + 2 : prev.speed, 8), 0, 120) : clamp(prev.speed - 4, 0, 120);
        const rpm = speed > 0 ? clamp(speed * 45 + jitter(0, 200), 800, 9000) : 0;
        const gear = speed === 0 ? 0 : speed < 20 ? 1 : speed < 40 ? 2 : speed < 65 ? 3 : speed < 90 ? 4 : 5;
        const engineTemp = isRiding ? clamp(jitter(prev.engineTemp + 0.1, 1.2), 70, 130) : clamp(jitter(prev.engineTemp - 0.2, 0.4), 25, 130);
        return {
          ...prev, speed: Math.round(speed), rpm: Math.round(rpm), gear,
          engineTemp: +engineTemp.toFixed(1),
          fuelLevel: isRiding ? +clamp(prev.fuelLevel - 0.002, 0, 100).toFixed(1) : prev.fuelLevel,
          batteryHealth: +clamp(jitter(prev.batteryHealth, 0.08), 0, 100).toFixed(1),
          tirePressureFront: +clamp(jitter(prev.tirePressureFront, 0.08), 20, 40).toFixed(1),
          tirePressureRear: +clamp(jitter(prev.tirePressureRear, 0.08), 20, 40).toFixed(1),
          brakeCondition: +clamp(jitter(prev.brakeCondition, 0.04), 0, 100).toFixed(1),
          engineVibration: +clamp(jitter(prev.engineVibration, 0.3), 0, 100).toFixed(1),
          totalDistance: +(prev.totalDistance + (isRiding ? speed / 7200 : 0)).toFixed(2),
        };
      });
      setLastUpdated(new Date());
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isRiding]);

  useEffect(() => {
    const candidates: Fault[] = [];
    const add = (id: string, component: string, description: string, severity: Fault['severity'], solution: string) =>
      candidates.push({ id, component, description, severity, solution, timestamp: new Date() });
    if (data.engineTemp > 110) add('engine-overheat', 'Engine', 'Engine temperature critically high.', 'critical', 'Stop safely, switch off the engine and let it cool. Never open a hot radiator cap.');
    if (data.fuelLevel < 15) add('low-fuel', 'Fuel', 'Fuel level is running low.', data.fuelLevel < 5 ? 'critical' : 'medium', 'Plan a refuel stop. Do not let the tank run dry.');
    if (data.brakeCondition < 40) add('brake-wear', 'Brakes', 'Brake condition needs inspection.', data.brakeCondition < 20 ? 'critical' : 'medium', 'Avoid riding until a qualified mechanic inspects the braking system.');
    if (data.tirePressureFront < 25 || data.tirePressureRear < 25) add('tire-pressure', 'Tyres', 'Tyre pressure is below the configured safe threshold.', 'medium', 'Check pressure with a reliable gauge and follow the motorcycle manufacturer specification.');
    if (data.engineVibration > 60) add('vibration', 'Engine', 'Abnormal vibration level detected in demo telemetry.', data.engineVibration > 80 ? 'critical' : 'low', 'Inspect mounts, chain and wheels. Arrange a mechanic inspection if vibration persists.');
    if (data.batteryHealth < 30) add('battery-low', 'Battery', 'Battery health estimate is low.', 'medium', 'Have the battery and charging system tested.');
    setFaults(prev => {
      const ids = new Set(candidates.map(f => f.id));
      return [...prev.filter(f => ids.has(f.id)), ...candidates.filter(f => !prev.some(old => old.id === f.id))];
    });
  }, [data.engineTemp, data.fuelLevel, data.brakeCondition, data.tirePressureFront, data.tirePressureRear, data.engineVibration, data.batteryHealth]);

  return { data, faults, isRiding, toggleRide, dismissFault, gpsStatus, requestLocation, stopLocation, lastUpdated, telemetryMode: 'DEMO' as const };
}
