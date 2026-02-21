import { useBikeData } from '@/hooks/useBikeData';
import AppLayout from '@/components/AppLayout';
import HistoryPage from './HistoryPage';

export default function HistoryRoute() {
  const { isRiding, toggleRide, faults } = useBikeData();
  return (
    <AppLayout isRiding={isRiding} onToggleRide={toggleRide} faultCount={faults.length}>
      <HistoryPage />
    </AppLayout>
  );
}
