import dynamic from 'next/dynamic';

// Dynamically import the Calendar component with no SSR
const Calendar = dynamic(() => import('@/features/calendar/components/Calendar'), {
  ssr: false,
});

export default function CalendarPage() {
  return <Calendar />;
}
