import { useBikeData } from '@/hooks/useBikeData';
import AppLayout from '@/components/AppLayout';
import DashboardPage from '@/pages/DashboardPage';

const Index = () => {
  const { data, faults, isRiding, toggleRide, dismissFault, gpsStatus, requestLocation, stopLocation, lastUpdated, telemetryMode } = useBikeData();
  return (
    <AppLayout isRiding={isRiding} onToggleRide={toggleRide} faultCount={faults.length}>
      <DashboardPage data={data} faults={faults} isRiding={isRiding} dismissFault={dismissFault}
        gpsStatus={gpsStatus} requestLocation={requestLocation} stopLocation={stopLocation}
        lastUpdated={lastUpdated} telemetryMode={telemetryMode}/>
    </AppLayout>
  );
};
export default Index;
