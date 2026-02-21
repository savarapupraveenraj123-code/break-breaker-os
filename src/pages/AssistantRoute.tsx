import { useBikeData } from '@/hooks/useBikeData';
import AppLayout from '@/components/AppLayout';
import AssistantPage from './AssistantPage';

export default function AssistantRoute() {
  const { data, isRiding, toggleRide, faults } = useBikeData();
  return (
    <AppLayout isRiding={isRiding} onToggleRide={toggleRide} faultCount={faults.length}>
      <AssistantPage bikeData={data} />
    </AppLayout>
  );
}
