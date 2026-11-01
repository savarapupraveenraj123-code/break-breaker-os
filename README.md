# BREAK BREAKER OS

**A rider intelligence and motorcycle health-monitoring prototype.** BREAK BREAKER brings ride telemetry, vehicle-health indicators, fault alerts, GPS awareness and rider assistance into one responsive command center.

## Product capabilities

- **Rider command center:** live-updating dashboard with speed, RPM, gear, engine temperature, fuel, battery, tyre, brake and vibration indicators.
- **Browser GPS:** opt-in device geolocation using the browser Geolocation API. The rider explicitly starts and stops location tracking.
- **Fault rules engine:** threshold-based alerts for overheating, low fuel, brake wear, tyre pressure, vibration and battery health.
- **Rider response:** quick access to India's emergency number (112), nearby motorcycle repair search and location sharing.
- **AI diagnostic assistant:** rule-based troubleshooting guidance based on the currently available telemetry.
- **Ride history, analytics, safety and settings:** supporting product areas for the rider workflow.

## Important prototype / hardware boundary

The current engine and vehicle-health readings are **simulated demo telemetry**, not readings from a real motorcycle. Browser GPS is real device location when the rider grants permission. True engine RPM, coolant temperature, fuel level, tyre pressure and brake-condition data require a compatible OBD/CAN/IoT hardware device and a secure ingestion service. Do not use demo values to make road-safety decisions.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Framer Motion
- Recharts
- React Router
- Browser Geolocation API

## Run locally

```bash
npm install
npm run dev
```

## Build and quality checks

```bash
npm run build
npm run lint
npm test
```

## Production integration roadmap

1. Pair a supported BLE OBD/ESP32 telemetry device.
2. Ingest authenticated, timestamped sensor events through a backend (for example, Supabase Realtime or a WebSocket service).
3. Persist ride sessions and maintenance events per authenticated rider and motorcycle.
4. Add consent-based push notifications and a verified roadside-assistance provider workflow.
5. Validate all diagnostic thresholds against the specific motorcycle manufacturer's service documentation.

---
Built as a prototype for safer, more informed riding. Always follow the motorcycle manufacturer's manual and local road-safety rules.
