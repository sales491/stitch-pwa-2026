import { redirect } from 'next/navigation';

// This route is superseded by /jobs — redirect there
export default function Page() {
  redirect('/jobs');
}
