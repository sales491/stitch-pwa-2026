export type PostStatus = 'Normal' | 'Moderate Traffic' | 'Delayed' | 'Cancelled' | 'Other';

export interface RoroCommunityPost {
    id: string;
    initials: string;
    name: string;
    role: string;
    time: string;
    text: string;
    status: PostStatus;
    avatar?: string;
}

export const INITIAL_RORO_POSTS: RoroCommunityPost[] = [
    { id: '1', initials: 'JD', name: 'Juan Dela Cruz', role: 'Verified Traveler', time: '10 mins ago', text: 'Line is getting a bit long at the terminal entrance, but processing is fast. Bring water!', status: 'Moderate Traffic' },
    { id: '2', initials: 'MS', name: 'Maria Santos', role: 'Local Guide', time: '45 mins ago', text: 'Montenegro ferry departure delayed by 30 mins due to loading cargo.', status: 'Delayed' },
];

export interface ShippingLine {
    id: string;
    name: string;
    schedule: string;
    icon: string;
    colorClass: string;
}

export const SHIPPING_LINES: ShippingLine[] = [
    {
        id: 'montenegro',
        name: 'Montenegro',
        schedule: 'Daily • Every 2 hours',
        icon: 'sailing',
        colorClass: 'text-green-600 dark:text-green-400'
    },
    {
        id: 'starhorse',
        name: 'Starhorse',
        schedule: 'Daily • Every 3 hours',
        icon: 'directions_boat_filled',
        colorClass: 'text-red-500 dark:text-red-400'
    }
];
