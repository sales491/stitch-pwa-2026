import { redirect } from 'next/navigation';

// /post is an alias used in older nav links — redirect to community create
export default function PostPage() {
    redirect('/community/create');
}
