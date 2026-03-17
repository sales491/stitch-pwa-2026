export type Listing = {
    id: number;
    slug: string;
    title: string;
    price: string;
    priceValue: number;
    category: string;
    town: string;
    postedAgo: string;
    postedDate: string;
    img: string;
    images: string[];
    alt: string;
    description: string;
    condition: 'Brand New' | 'Like New' | 'Good' | 'Fair' | 'For Parts';
    seller: {
        name: string;
        avatar: string;
        memberSince: string;
        responseRate: string;
        phone: string;
        fb?: string;
    };
    seo: {
        title: string;
        description: string;
        keywords: string[];
    };
};

export function generateSlug(title: string, town: string): string {
    const base = `${title}-${town}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    const suffix = Math.random().toString(36).substring(2, 7);
    return `${base}-${suffix}`;
}
