export type BlogPost = {
    id: string;
    title: string;
    location: string;
    date: string;
    excerpt: string;
    image: string;
    imageAlt: string;
    likes: number;
    isFeatured?: boolean;
};

export const BLOG_POSTS: BlogPost[] = [
    {
        id: 'sunset-magic-poctoy',
        title: 'Sunset Magic at Poctoy White Beach',
        location: 'Torrijos',
        date: 'Oct 24, 2023',
        excerpt: 'Experience the golden hour like never before on the pristine sands of Poctoy. The local vibe is unmatched as Mount Malindig watches over the horizon. We met with local fishermen who shared stories of the sea that have been passed down for generations...',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYWKIjB5ahRN26Nm2H39tnd83RmrUolv1adDy45xYf0zPFgO4UEVK-9QOVergynZ8sl0DOBEkKcwalCpSIqMymR0rMzCQpkyFfEYtIvuEY5SQkBQF2fLEYLt0HOk3FoSsybMCzEZN6VeUKBXqyMUa7TDaxIXLjsmB19IGvo2ndTK5e84pUD3j0mZ2j_A5rMlBoit-xof90w_-yIrhIZIkuoCTkiC4ldpc1aiyRb1RRqPHBExD6TTMjFRPSc5e10qFx09gdpgQDw4M',
        imageAlt: 'Golden sunset over Poctoy White Beach',
        likes: 124,
        isFeatured: true
    },
    {
        id: 'preparing-moriones',
        title: 'Preparing for the Moriones Festival',
        location: 'Boac',
        date: 'Oct 20, 2023',
        excerpt: 'Months before the Holy Week, the artisans of Boac are already hard at work carving the intricate masks that define our island\'s most famous tradition. We visited the workshop of Mang Jose to see the process firsthand...',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBff8fLBhe5vUAcwwgIGdpmd2E7edBVjkkVUc09r_72ImEcoQvedF7cbuHF2uKvPwQiPXZM10V1Mq2CNiPpMa-gpl5OPBfY8XQ6KF316fPiTEVdPNKrcIRcUAoNpfFLRk9lJY0eHuIFrQUXjACnWhMzFiVuoNa_9VSDP5R1b7VXRocFLmhw5D727Xg2MwDMrJJdFNUfvuRtUs1unEQZUp2hGEcW477buX-eTFpvh2oR5QHoGlxK81LeIKIiJ-Lv_KUwwX0-r20Gi2o',
        imageAlt: 'Traditional Moriones Festival mask close up',
        likes: 89
    },
    {
        id: 'maniwaya-island-hopping',
        title: 'Island Hopping: Maniwaya & Palad Sandbar',
        location: 'Santa Cruz',
        date: 'Oct 15, 2023',
        excerpt: 'Crystal clear waters and powdery white sands await at Maniwaya. Don\'t miss the Palad Sandbar which appears only during low tide, offering a surreal experience of standing in the middle of the ocean...',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI2Q_YzVSIQPtmKuWc6NL931PrHbX3T3Og7JW9l-ARWAwsopGVWaP9PCJA6yEjLRYx23Kipd4yCOYI1z0xwNq7vzS7PKGZ23G8AOLo6eb9vkpubyNH7oO9kQm3L9MJ41JMbVH8E9jNqZ-1ejq7MDC2Z0Gp05jmlLK6IwMj81vBANaxFLW3aklNwfEr6TZqlxlkaYqvSPJ210kpbSIJnCvp51uKWSrryCZUXkZ9M617m1qIdk2p_b226oQFg9vBxMuPztAQB1x4ysY',
        imageAlt: 'Boat view of Maniwaya Island sandbar',
        likes: 215
    },
    {
        id: 'boac-cathedral-history',
        title: 'Whispers of the Past: The Boac Cathedral',
        location: 'History',
        date: 'Oct 12, 2023',
        excerpt: 'Standing atop a hill, the Boac Cathedral is not just a place of worship but a fortress that once protected the town from pirates. Its walls hold centuries of prayers and secrets...',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBspWe8zY1eRx_o3dLNkKULXgloloveLTcQoERAAvXXXmZd6j9CncdUZQO3oYFKWE4BULVyw8aLUtGCtQ6aplmbDgicUf-cGektL7_CeonN7pPojYGn9EZast6sdxnEA8nDQe7igHdy-DGTcuV2CGYWoQk41nu_3A7KswYki6geFrygYqSD3i6Lhy9u44TnpaEFmcwrooPZ5x_WPfVZQ-Tx-wGzLXI5e92tE5AISRBxklvbaDOUL1TVjMe6_coHiQr5ovXvtfDCk3Y',
        imageAlt: 'Interior of Boac Cathedral old church',
        likes: 156
    }
];
