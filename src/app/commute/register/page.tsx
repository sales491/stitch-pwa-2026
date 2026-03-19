import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Legacy route — consolidated into the full form.
// Any old bookmarks or cached links will be sent to the correct page.
export default function Page() {
  redirect('/post-commute-or-delivery-listing');
}
