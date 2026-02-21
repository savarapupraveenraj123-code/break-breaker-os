import { useBikeData } from '@/hooks/useBikeData';
import AppLayout from '@/components/AppLayout';
import SafetyPage from './SafetyPage';

export default function SafetyRoute() {
  const { isRiding, toggleRide, faults } = useBikeData();
  return (
    <AppLayout isRiding={isRiding} onToggleRide={toggleRide} faultCount={faults.length}>
      <SafetyPage />
    </AppLayout>
  );
}
