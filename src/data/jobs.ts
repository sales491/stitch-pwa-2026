export type Job = {
    id: string;
    slug: string;
    title: string;
    company: string;
    location: string;
    type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Casual';
    salary: string;
    postedAgo: string;
    description: string;
    requirements: string[];
    logo?: string;
    icon?: string;
    color?: string;
    isFeatured?: boolean;
    isVerified?: boolean;
    isClosed?: boolean;
    contact?: {
        phone?: string;
        email?: string;
        fb?: string;
    };
    seo: {
        title: string;
        description: string;
        keywords: string[];
    };
};
