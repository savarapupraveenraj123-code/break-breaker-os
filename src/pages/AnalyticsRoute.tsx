import { useBikeData } from '@/hooks/useBikeData';
import AppLayout from '@/components/AppLayout';
import AnalyticsPage from './AnalyticsPage';

export default function AnalyticsRoute() {
  const { isRiding, toggleRide, faults } = useBikeData();
  return (
    <AppLayout isRiding={isRiding} onToggleRide={toggleRide} faultCount={faults.length}>
      <AnalyticsPage />
    </AppLayout>
  );
}
