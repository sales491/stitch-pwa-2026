export type CommunityBoardPost = {
    id: string;
    author: {
        name: string;
        avatar?: string;
        initials?: string;
    };
    timeAgo: string;
    type?: 'announcement' | 'lost-found' | 'general';
    categoryLabel?: string;
    location: string;
    title?: string;
    content: string;
    tags?: string[];
    image?: string;
    likes: number;
    comments: number;
};

export const COMMUNITY_POSTS: CommunityBoardPost[] = [
    {
        id: 'post-1',
        author: { name: 'Barangay Announcement', initials: 'BA' },
        timeAgo: '2h ago',
        type: 'announcement',
        categoryLabel: 'Official',
        title: '🎭 Moriones Festival Preparation Meeting',
        content: 'Calling all barangay officials and volunteers for the upcoming Moriones Festival 2024. Assembly at the Boac Plaza Covered Court this Saturday, 2:00 PM.',
        location: 'Boac Proper',
        tags: ['Culture'],
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3IvmBlggjaOln_QWojzQ_ugozsv82eGmjz5nlkB2Ut1X08NYyMNhQ2PWOSWBOH2aWf8gJ_nTxoHina169NqagMxLpP5WCCOMjf6hcZa23OHjnI89LOsHdzPT8SemPiBl3PyaNj-YWxb_Lukxql9q8x_7zUYKLjGjCHrijQoYtn-X7zWNenzmMaWFdamJWY2ESA0g-qKxUeJH1dLFAE3z1rrrDqroAbmY2BlnshIUcKogMTxokhP0g-bzNd9-i-TlErddSLm2E30w',
        likes: 45,
        comments: 12
    },
    {
        id: 'post-2',
        author: { name: 'Ramon Magdurulang', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYmvYp4NCCrQoZ-49KCk0OK03zLs8FGuMD8dqykJWDI2AiFI6D3OOTQmKRg12aZUrlqk5pwV0Ja8e4RorxP4rnunh-JDoXQ3MHwB89tMFoT4MqBYHOpL2S-Iv6BwZpUmjkWhVZlb2s--7TgmsuTNj293w_qxTtD7JSxzZbEBfMYxO55jAiWI9BNDTuWr0mJ3gbaPac7oU523B0VUoMKojif_1gU-bhBVEEmRcGE5iFSEzNeJGPbYXqDooVNpnnoMc49IAF7iDz1Ic' },
        timeAgo: '45m ago',
        type: 'lost-found',
        categoryLabel: 'Lost & Found',
        content: 'Hello neighbors! Has anyone seen a brown Labrador puppy near the market area? He answers to "Bantay". Please DM me if you\'ve seen him. 🙏🐕',
        location: 'Mogpog',
        likes: 12,
        comments: 4
    }
];
