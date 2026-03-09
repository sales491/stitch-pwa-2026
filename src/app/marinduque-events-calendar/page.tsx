import { redirect } from 'next/navigation';

// Old URL — permanently redirect to the canonical /events route
export default function LegacyCalendarRedirect() {
  redirect('/events');
}
