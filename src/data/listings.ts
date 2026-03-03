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
    };
    seo: {
        title: string;
        description: string;
        keywords: string[];
    };
};

export const LISTINGS: Listing[] = [
    {
        id: 1,
        slug: 'honda-wave-125-good-condition-torrijos',
        title: 'Honda Wave 125 - Good Condition',
        price: '₱45,000',
        priceValue: 45000,
        category: 'Motorcycles & Parts',
        town: 'Torrijos',
        postedAgo: '2 hours ago',
        postedDate: '2026-03-01',
        condition: 'Good',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpsr3tKOjO2tjaIku0K9bRAzdKnGWe3k7jmlMM98ds7goUc7QpDZLQ9d1NGOWyvWKTLWNQW3UWMTSy1vPIIxx0MgE_ybpXK4OR_VFCyO4qwN0ABBmQDueAoeG3ZHDz2RHrXVk5K06u70vuHAHcvD-sv4S6BfJGUx5sLxatw_fGIacPLIOmGcHcpYHKxGtaagofVD6CKKCy3I6JJN1AHKtK2MWEqa39vXlfYSO9gVsrY6Mj-gWkeHnA2KdpGu_AW2usBZFHUCBlE4c',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDpsr3tKOjO2tjaIku0K9bRAzdKnGWe3k7jmlMM98ds7goUc7QpDZLQ9d1NGOWyvWKTLWNQW3UWMTSy1vPIIxx0MgE_ybpXK4OR_VFCyO4qwN0ABBmQDueAoeG3ZHDz2RHrXVk5K06u70vuHAHcvD-sv4S6BfJGUx5sLxatw_fGIacPLIOmGcHcpYHKxGtaagofVD6CKKCy3I6JJN1AHKtK2MWEqa39vXlfYSO9gVsrY6Mj-gWkeHnA2KdpGu_AW2usBZFHUCBlE4c',
        ],
        alt: 'Honda Wave 125 motorcycle',
        description: `For sale: Honda Wave 125 in good running condition. Well-maintained, regular oil changes done. Engine is smooth, no major issues. Body has minor scratches from normal use.\n\nSpecs:\n• Year: 2019\n• Mileage: ~28,000 km\n• Color: Red/Black\n• Electric start & kick start both working\n• Original OR/CR available\n\nPrice is negotiable for serious buyers. No test rides without full payment or collateral. Viewing in Torrijos, Marinduque.`,
        seller: {
            name: 'Ramon dela Cruz',
            avatar: 'https://i.pravatar.cc/150?img=11',
            memberSince: 'January 2024',
            responseRate: '95%',
            phone: '+63 912 345 6789',
        },
        seo: {
            title: 'Honda Wave 125 For Sale ₱45,000 – Torrijos, Marinduque | Marinduque Market Hub',
            description: 'Buy a used Honda Wave 125 motorcycle in good condition for ₱45,000 in Torrijos, Marinduque. Well-maintained, 2019 model, ~28,000 km. OR/CR available.',
            keywords: ['Honda Wave 125 for sale Marinduque', 'motorcycle Torrijos', 'used motorcycle Marinduque', 'Honda Wave 125 second hand'],
        },
    },
    {
        id: 2,
        slug: 'samsung-43-smart-tv-4k-uhd-boac',
        title: 'Samsung 43" Smart TV 4K UHD',
        price: '₱12,000',
        priceValue: 12000,
        category: 'Electronics',
        town: 'Boac',
        postedAgo: '5 hours ago',
        postedDate: '2026-03-01',
        condition: 'Like New',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB75bSRr_mr6-RzYCQYNTHSn7vWmzswSsSbML4-_Y_gocvVAcNZ4wpZSHGwmAzO4pB6w2zGnh_v67JhHQDKHoR6Qc0j2eMGSYfUYhYQTl9kNeJRie9H73d3-xdtOR5-WqF6XzyH20LKc9nkeR054vrcof0jEZF3Qs3xALEKKZv1VG-mTyM33uFHKN70uiDGBHBsPQN5iGrMdlNjtQXSzSQlPJuMUgXPYa6-RiKyv-rJODQJRS9c31mXd_qClW-EScYw6Ok4FkbTkD0',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuB75bSRr_mr6-RzYCQYNTHSn7vWmzswSsSbML4-_Y_gocvVAcNZ4wpZSHGwmAzO4pB6w2zGnh_v67JhHQDKHoR6Qc0j2eMGSYfUYhYQTl9kNeJRie9H73d3-xdtOR5-WqF6XzyH20LKc9nkeR054vrcof0jEZF3Qs3xALEKKZv1VG-mTyM33uFHKN70uiDGBHBsPQN5iGrMdlNjtQXSzSQlPJuMUgXPYa6-RiKyv-rJODQJRS9c31mXd_qClW-EScYw6Ok4FkbTkD0',
        ],
        alt: 'Samsung 43 inch Smart TV',
        description: `Selling my Samsung 43" 4K UHD Smart TV — only 8 months old, still under warranty. Reason for selling: upgrading to a bigger screen.\n\nFeatures:\n• 43-inch 4K Crystal UHD Display\n• Smart TV with Netflix, YouTube, Vivamax pre-installed\n• USB x2, HDMI x3\n• Built-in WiFi\n• Original remote and stand included\n• Box and receipt available\n\nLocated in Boac, Marinduque. Buyer shoulders transport if delivery needed.`,
        seller: {
            name: 'Lita Bautista',
            avatar: 'https://i.pravatar.cc/150?img=5',
            memberSince: 'March 2023',
            responseRate: '88%',
            phone: '+63 917 234 5678',
        },
        seo: {
            title: 'Samsung 43" 4K Smart TV For Sale ₱12,000 – Boac, Marinduque | Marinduque Market Hub',
            description: 'Samsung 43 inch 4K UHD Smart TV for sale in Boac, Marinduque. Only 8 months old, with warranty, box and receipt. ₱12,000 negotiable.',
            keywords: ['Samsung Smart TV for sale Marinduque', 'TV Boac Marinduque', '4K TV second hand Philippines', 'Samsung 43 inch Marinduque'],
        },
    },
    {
        id: 3,
        slug: 'solid-narra-dining-set-4-seater-gasan',
        title: 'Solid Narra Dining Set (4 Seater)',
        price: '₱3,500',
        priceValue: 3500,
        category: 'Home & Appliances',
        town: 'Gasan',
        postedAgo: '1 day ago',
        postedDate: '2026-02-28',
        condition: 'Good',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKPYvMCgm8od0jvmOKf-rMNo1TrtrmPZgu0AlUv4iUTu4Uw5Du-L_-Czurjwi5ZGf_6FESLUNCwsBT7XGfydCA__fLHL0KPuojWSQ0EvEvkSt9GlxV6hbqCfAJBy810HHP6_TQsRc3G7tBuxa92AZi9ypaXuBKtJOo-EkeH7a05qqt5qH0TDiDJoCI3l4lMGxUpOBbN1w9qr56P2hpz4OKcFnKSN-MqNdG-VkiqTFeSid6gZDh5TIHfi8VLE55ir10wLztvlNpTPY',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBKPYvMCgm8od0jvmOKf-rMNo1TrtrmPZgu0AlUv4iUTu4Uw5Du-L_-Czurjwi5ZGf_6FESLUNCwsBT7XGfydCA__fLHL0KPuojWSQ0EvEvkSt9GlxV6hbqCfAJBy810HHP6_TQsRc3G7tBuxa92AZi9ypaXuBKtJOo-EkeH7a05qqt5qH0TDiDJoCI3l4lMGxUpOBbN1w9qr56P2hpz4OKcFnKSN-MqNdG-VkiqTFeSid6gZDh5TIHfi8VLE55ir10wLztvlNpTPY',
        ],
        alt: 'Solid Narra Dining Set 4 seater',
        description: `Selling our solid Narra wood dining set — 4 seater (1 table + 4 chairs). Sturdy and durable, well-crafted local hardwood furniture. Showing some age but structurally sound.\n\nDimensions:\n• Table: 120cm x 75cm x 75cm\n• Chairs: standard size\n\nBought from a local carpenter in Gasan. Selling because we're downsizing. Good for a small dining room or kitchen. Viewing in Gasan, Marinduque. Buyer arranges pickup/transport.`,
        seller: {
            name: 'Maricel Santos',
            avatar: 'https://i.pravatar.cc/150?img=9',
            memberSince: 'June 2022',
            responseRate: '72%',
            phone: '+63 905 678 9012',
        },
        seo: {
            title: 'Solid Narra Dining Set 4 Seater For Sale ₱3,500 – Gasan, Marinduque | Marinduque Market Hub',
            description: 'Solid Narra wood dining set (1 table + 4 chairs) for sale in Gasan, Marinduque. Good condition local hardwood furniture. ₱3,500.',
            keywords: ['Narra dining set for sale Marinduque', 'dining table Gasan', 'used furniture Marinduque', 'hardwood dining set Philippines'],
        },
    },
    {
        id: 4,
        slug: 'rice-cooker-standard-size-sta-cruz',
        title: 'Rice Cooker Standard Size',
        price: '₱850',
        priceValue: 850,
        category: 'Home & Appliances',
        town: 'Sta. Cruz',
        postedAgo: '2 days ago',
        postedDate: '2026-02-27',
        condition: 'Good',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7miHFn16xT2vq3raO-KyC639KEgDkztUU-EZvE6_y04-6JiSNCQZyoo_p-XVzdYwavs6V-foD5i8Eo9XtF07KLIclR5jB3jFNnbVuyffJirqliVzTo5yj_8YQn5CbDn0Ie9iMnneilB3aBMpoCM0dCG6VuT9uzv09xyJ-apNvluaDEQTp_AueGKbSX-OsHQVnBgSKuJ5HTE_kwZaJTwBYzZ5lHCxmG6xZCsoo9Ul6SgYCNxYs7KQupifuAHVoMOTUSIKW-5kdE2s',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuB7miHFn16xT2vq3raO-KyC639KEgDkztUU-EZvE6_y04-6JiSNCQZyoo_p-XVzdYwavs6V-foD5i8Eo9XtF07KLIclR5jB3jFNnbVuyffJirqliVzTo5yj_8YQn5CbDn0Ie9iMnneilB3aBMpoCM0dCG6VuT9uzv09xyJ-apNvluaDEQTp_AueGKbSX-OsHQVnBgSKuJ5HTE_kwZaJTwBYzZ5lHCxmG6xZCsoo9Ul6SgYCNxYs7KQupifuAHVoMOTUSIKW-5kdE2s',
        ],
        alt: 'Standard size rice cooker',
        description: `Selling a standard rice cooker (1 liter / 6 cups). Still works perfectly — just bought a larger one. Brand: Hanabishi.\n\n• Capacity: 1 liter (6 cups uncooked)\n• Non-stick inner pot\n• Automatic keep-warm function\n• Steamer tray included\n• Measuring cup and paddle included\n\nItem is in Sta. Cruz, Marinduque. Can meet near market area.`,
        seller: {
            name: 'Nena Alcantara',
            avatar: 'https://i.pravatar.cc/150?img=20',
            memberSince: 'November 2023',
            responseRate: '90%',
            phone: '+63 918 456 7890',
        },
        seo: {
            title: 'Rice Cooker For Sale ₱850 – Sta. Cruz, Marinduque | Marinduque Market Hub',
            description: 'Hanabishi standard rice cooker (6 cups) for sale in Sta. Cruz, Marinduque. Working perfectly, ₱850. Non-stick pot, keep-warm function included.',
            keywords: ['rice cooker for sale Marinduque', 'Hanabishi rice cooker Sta Cruz', 'appliances Marinduque second hand'],
        },
    },
    {
        id: 5,
        slug: 'canon-dslr-camera-slightly-used-mogpog',
        title: 'Canon DSLR Camera (Slightly Used)',
        price: '₱8,500',
        priceValue: 8500,
        category: 'Electronics',
        town: 'Mogpog',
        postedAgo: '3 days ago',
        postedDate: '2026-02-26',
        condition: 'Like New',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADmnRTToBR1EIa91KR_rTJba4tA4alju27mKrZTsYYpxs1Pqcqd1pZtMcLtlVCZhPeiAj1tgXUSFcHKJgf0Ewek8G4kfeVTr0G8DB3wMZAOOKJukJNurbjkZ16kJeZLwUUsVYwqi61Dl8UNCKXIVh1V_bboGLPZgy_SOSUdfr1PYz-4IbZ4E1uk8h5DCMwBcAa76kdP4REzei77XY6mjTFdE07Z6f7LrHmaeoOxvACfCycsWuvcoDCxX5lvNZYWymY31reuuBI320',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuADmnRTToBR1EIa91KR_rTJba4tA4alju27mKrZTsYYpxs1Pqcqd1pZtMcLtlVCZhPeiAj1tgXUSFcHKJgf0Ewek8G4kfeVTr0G8DB3wMZAOOKJukJNurbjkZ16kJeZLwUUsVYwqi61Dl8UNCKXIVh1V_bboGLPZgy_SOSUdfr1PYz-4IbZ4E1uk8h5DCMwBcAa76kdP4REzei77XY6mjTFdE07Z6f7LrHmaeoOxvACfCycsWuvcoDCxX5lvNZYWymY31reuuBI320',
        ],
        alt: 'Canon DSLR Camera',
        description: `Canon EOS 1300D (Rebel T6) DSLR Camera with 18-55mm kit lens. Used only for one beach trip — in near-new condition. Comes with everything in the original box.\n\nIncludes:\n• Canon EOS 1300D body\n• 18-55mm kit lens\n• Original battery + charger\n• 16GB SD card\n• Camera bag\n• All original manuals and cables\n• Original box\n\nShutter count: ~350 shots. Perfect for beginners or hobbyists. Located in Mogpog, Marinduque.`,
        seller: {
            name: 'Jeric Medina',
            avatar: 'https://i.pravatar.cc/150?img=15',
            memberSince: 'August 2023',
            responseRate: '99%',
            phone: '+63 921 567 8901',
        },
        seo: {
            title: 'Canon DSLR EOS 1300D For Sale ₱8,500 – Mogpog, Marinduque | Marinduque Market Hub',
            description: 'Canon EOS 1300D DSLR camera with 18-55mm lens for sale in Mogpog, Marinduque. Like new, 350 shutter count, complete with accessories. ₱8,500.',
            keywords: ['Canon DSLR for sale Marinduque', 'Canon 1300D Mogpog', 'camera for sale Philippines', 'DSLR Marinduque second hand'],
        },
    },
    {
        id: 6,
        slug: 'nike-running-shoes-size-9-boac',
        title: 'Nike Running Shoes Size 9',
        price: '₱2,100',
        priceValue: 2100,
        category: 'Clothes & Accessories',
        town: 'Boac',
        postedAgo: '3 days ago',
        postedDate: '2026-02-26',
        condition: 'Like New',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGYXPMRS28cAw3VCBrIivevT5tbYGTRcPOlaJE-2Jzu2B5VJ-iK4d2UD93yE9nCFrqNdjgiWfrSGrRjgYmR547IU8tYJnqBYvNg8gINekhtbLEpSjU0dQshIokaOOjIVlgIMeJ0BYvVjh4TlUq-F0SlWLIMssJ6NHCoJx3N65ZQQZbOIMuxzXaUvYRqrgIwOCxKouGY7GbHE7c1mC6NFXPDnrJV-1jTivtMTO87P6vp5_kMVU-7TsfG7wMA2fsO1wtZiXxMpJ6_q8',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCGYXPMRS28cAw3VCBrIivevT5tbYGTRcPOlaJE-2Jzu2B5VJ-iK4d2UD93yE9nCFrqNdjgiWfrSGrRjgYmR547IU8tYJnqBYvNg8gINekhtbLEpSjU0dQshIokaOOjIVlgIMeJ0BYvVjh4TlUq-F0SlWLIMssJ6NHCoJx3N65ZQQZbOIMuxzXaUvYRqrgIwOCxKouGY7GbHE7c1mC6NFXPDnrJV-1jTivtMTO87P6vp5_kMVU-7TsfG7wMA2fsO1wtZiXxMpJ6_q8',
        ],
        alt: 'Nike running shoes red size 9',
        description: `Selling my Nike Air Zoom Pegasus 39 running shoes, size 9 US. Only worn twice indoors on a treadmill. Bought from SM Lipa, too small for me.\n\n• Brand: Nike Air Zoom Pegasus 39\n• Size: 9 US / 43 EU\n• Color: Red/White\n• Condition: Like New (worn 2x indoors only)\n• Original box included\n• Retail price: ₱4,995\n\nSelling at ₱2,100 firm. Located in Boac, Marinduque. Meetup near Boac market or Jollibee.`,
        seller: {
            name: 'Paolo Reyes',
            avatar: 'https://i.pravatar.cc/150?img=12',
            memberSince: 'February 2024',
            responseRate: '85%',
            phone: '+63 930 789 0123',
        },
        seo: {
            title: 'Nike Running Shoes Size 9 For Sale ₱2,100 – Boac, Marinduque | Marinduque Market Hub',
            description: 'Nike Air Zoom Pegasus 39 size 9 running shoes for sale in Boac, Marinduque. Like new, worn 2x only. Original box included. ₱2,100 firm.',
            keywords: ['Nike shoes for sale Marinduque', 'Nike Pegasus Boac', 'running shoes Marinduque second hand', 'Nike size 9 Philippines'],
        },
    },
    {
        id: 7,
        slug: 'palay-rice-50kg-sack-buenavista',
        title: 'Palay (Rice) 50kg Sack',
        price: '₱1,800',
        priceValue: 1800,
        category: 'Farm & Garden',
        town: 'Buenavista',
        postedAgo: '1 hour ago',
        postedDate: '2026-03-01',
        condition: 'Brand New',
        img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=750&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=750&fit=crop',
        ],
        alt: 'Palay rice sack 50 kilograms',
        description: `Freshly harvested Palay (unmilled rice) from Buenavista, Marinduque. Sold per 50kg sack.\n\n• Variety: RC216 (high-yielding)\n• Moisture content: ~14%\n• Harvest date: February 2026\n• Available quantity: 20 sacks\n• Minimum order: 1 sack\n• Bulk discount available for 5+ sacks\n\nCan deliver within Buenavista for free. Delivery to other towns arranged separately. Perfect for home milling or small rice retailers.`,
        seller: {
            name: 'Mang Tony Farm',
            avatar: 'https://i.pravatar.cc/150?img=60',
            memberSince: 'April 2021',
            responseRate: '78%',
            phone: '+63 908 234 5670',
        },
        seo: {
            title: 'Palay 50kg Sack For Sale ₱1,800 – Buenavista, Marinduque | Marinduque Market Hub',
            description: 'Fresh palay (unmilled rice) 50kg sack for sale in Buenavista, Marinduque. RC216 variety, February 2026 harvest. ₱1,800/sack, bulk discount available.',
            keywords: ['palay for sale Marinduque', 'rice Buenavista Marinduque', 'farm produce Marinduque', 'palay RC216 Philippines'],
        },
    },
    {
        id: 8,
        slug: 'carpentry-services-cabinets-furniture-torrijos',
        title: 'Carpentry Services — Cabinets & Furniture',
        price: '₱500/day',
        priceValue: 500,
        category: 'Services',
        town: 'Torrijos',
        postedAgo: '4 hours ago',
        postedDate: '2026-03-01',
        condition: 'Brand New',
        img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=750&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=750&fit=crop',
        ],
        alt: 'Carpenter working on wood furniture',
        description: `Professional carpentry services available in Torrijos and nearby towns. Specializing in custom furniture and built-in cabinets.\n\nServices offered:\n• Custom kitchen cabinets\n• Built-in closets / aparador\n• Sala sets and dining tables\n• Bed frames (double, queen, king)\n• Door and window installation\n• General woodwork repairs\n\nRate: ₱500/day (materials not included)\nExperience: 12 years\nPortfolio available upon request.\n\nWilling to travel to Boac, Gasan, and Sta. Cruz with travel allowance. Contact for free estimate.`,
        seller: {
            name: 'Isko Carpentry Works',
            avatar: 'https://i.pravatar.cc/150?img=65',
            memberSince: 'September 2020',
            responseRate: '92%',
            phone: '+63 945 678 9012',
        },
        seo: {
            title: 'Carpentry Services Torrijos Marinduque – Custom Cabinets & Furniture | Marinduque Market Hub',
            description: 'Professional carpentry services in Torrijos, Marinduque. Custom kitchen cabinets, closets, furniture. ₱500/day, 12 years experience. Free estimate.',
            keywords: ['carpentry services Marinduque', 'carpenter Torrijos', 'custom cabinets Marinduque', 'furniture maker Marinduque'],
        },
    },
];

export function getListingBySlug(slug: string): Listing | undefined {
    return LISTINGS.find((l) => l.slug === slug);
}

export function generateSlug(title: string, town: string): string {
    return `${title}-${town}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
