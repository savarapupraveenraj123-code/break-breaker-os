import { useBikeData } from '@/hooks/useBikeData';
import AppLayout from '@/components/AppLayout';
import SettingsPage from './SettingsPage';

export default function SettingsRoute() {
  const { isRiding, toggleRide, faults } = useBikeData();
  return (
    <AppLayout isRiding={isRiding} onToggleRide={toggleRide} faultCount={faults.length}>
      <SettingsPage />
    </AppLayout>
  );
}
