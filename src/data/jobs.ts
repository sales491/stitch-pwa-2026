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

export const JOBS: Job[] = [
    {
        id: 'featured-1',
        slug: 'store-manager-boac-trading-post',
        title: 'Store Manager',
        company: 'Boac Trading Post',
        location: 'Boac',
        type: 'Full-time',
        salary: '₱15k - ₱20k',
        postedAgo: 'Just now',
        isFeatured: true,
        description: 'We are looking for an energetic Store Manager to oversee daily operations at the Boac Trading Post. Responsibilities include inventory management, staff supervision, and customer service excellence.',
        requirements: [
            'At least 2 years experience in retail management',
            'Strong leadership and communication skills',
            'Must be a resident of Boac or nearby towns',
            'Willing to work on weekends and holidays'
        ],
        icon: 'storefront',
        color: 'orange',
        seo: {
            title: 'Store Manager at Boac Trading Post | Marinduque Jobs',
            description: 'Apply for the Store Manager position at Boac Trading Post. ₱15k - ₱20k salary. Full-time role in Boac, Marinduque.',
            keywords: ['Store Manager Boac', 'Retail Jobs Marinduque', 'Boac Trading Post careers']
        }
    },
    {
        id: 'job-1',
        slug: 'tricycle-driver-gasan-local-hirer',
        title: 'Tricycle Driver',
        company: 'Local Hirer',
        location: 'Gasan',
        type: 'Contract',
        salary: '₱500/day',
        postedAgo: '2h ago',
        isVerified: true,
        description: 'Looking for a reliable tricycle driver for a private unit. Route will primarily be within Gasan and occasionally to Boac.',
        requirements: [
            'Professional Driver\'s License',
            'Knowledgeable of Gasan routes',
            'Honest and hardworking',
            'Clean driving record'
        ],
        icon: 'two_wheeler',
        color: 'emerald',
        seo: {
            title: 'Tricycle Driver Job in Gasan | Marinduque Jobs',
            description: 'Local Hirer in Gasan is looking for a Tricycle Driver. ₱500/day. Contract based. Apply now!',
            keywords: ['Tricycle Driver Gasan', 'Driver Jobs Marinduque', 'Gasan local hiring']
        }
    },
    {
        id: 'job-2',
        slug: 'online-esl-tutor-remote-rarejob',
        title: 'Online ESL Tutor',
        company: 'RareJob Ph',
        location: 'Remote',
        type: 'Part-time',
        salary: '₱150/hr',
        postedAgo: '5h ago',
        isVerified: true,
        description: 'Teach English online to Japanese students from the comfort of your home in Marinduque. Flexible hours and competitive rates.',
        requirements: [
            'Excellent English communication skills',
            'Stable internet connection (at least 5mbps)',
            'Quiet environment for teaching',
            'Available for at least 10 hours a week'
        ],
        icon: 'language',
        color: 'blue',
        seo: {
            title: 'Online ESL Tutor (Remote) - RareJob Ph | Marinduque Jobs',
            description: 'Earn from home as an Online ESL Tutor for RareJob Ph. ₱150/hr. Remote work available for Marinduque residents.',
            keywords: ['ESL Tutor Remote', 'Online Teaching Jobs Marinduque', 'RareJob hiring Philippines']
        }
    },
    {
        id: 'job-3',
        slug: 'resort-staff-stay-in-bellarocca-island-resort',
        title: 'Resort Staff (Stay-in)',
        company: 'Bellarocca Island Resort',
        location: 'Buenavista',
        type: 'Full-time',
        salary: '₱12k/mo + Meals',
        postedAgo: '1d ago',
        description: 'Bellarocca Island Resort is hiring additional resort staff. This is a stay-in position with meals provided. Great opportunity to work in a world-class resort.',
        requirements: [
            'Experience in hospitality is an advantage',
            'Physically fit and proactive',
            'Good customer service skills',
            'Willing to stay on the island'
        ],
        icon: 'beach_access',
        color: 'amber',
        seo: {
            title: 'Resort Staff (Stay-in) at Bellarocca | Marinduque Jobs',
            description: 'Join the team at Bellarocca Island Resort as a stay-in Resort Staff. ₱12k/mo with meals. Apply now!',
            keywords: ['Bellarocca Jobs', 'Resort Staff Buenavista', 'Hotel Jobs Marinduque']
        }
    },
    {
        id: 'job-4',
        slug: 'computer-technician-pc-express-boac',
        title: 'Computer Technician',
        company: 'PC Express Boac',
        location: 'Boac',
        type: 'Full-time',
        salary: 'Negotiable',
        postedAgo: '3d ago',
        isClosed: true,
        description: 'PC Express Boac is looking for a skilled Computer Technician to handle repairs and maintenance of various hardware components.',
        requirements: [
            'TESDA NC II in Computer Systems Servicing is a plus',
            'Knowledgeable in software troubleshooting',
            'Can work with minimal supervision',
            'Customer-oriented'
        ],
        icon: 'computer',
        color: 'gray',
        seo: {
            title: 'Computer Technician at PC Express Boac | Marinduque Jobs',
            description: 'PC Express Boac is hiring a Computer Technician. Salary negotiable. Apply to join our technical team.',
            keywords: ['Computer Technician Boac', 'IT Jobs Marinduque', 'PC Express hiring']
        }
    },
    {
        id: 'job-5',
        slug: 'senior-farm-manager-marinduque-agriculture-corp',
        title: 'Senior Farm Manager',
        company: 'Marinduque Agriculture Corp.',
        location: 'Boac',
        type: 'Full-time',
        salary: '₱25k - ₱30k',
        postedAgo: '2 days ago',
        isVerified: true,
        description: 'We are looking for an experienced Farm Manager to oversee our copra production in Boac. You will be responsible for daily operations, staff management, and ensuring quality yield.',
        requirements: [
            'At least 3 years of experience in farm management or related field.',
            'Must reside within Marinduque or willing to relocate to Boac.',
            'Knowledgeable in sustainable farming techniques and copra processing.',
            'High school diploma required; Degree in Agriculture is a plus.'
        ],
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwGX3uQChroCrDF5znsSomw8_ZX8AlCiK3jsbIy8jXKwnRZ4_JLSGO9g_vU1hdoW96T7d47rbu4k0O1IR2dbLX6SXLg2Swhb8VKFyqgE60CTbTwsZkDMfgtNSaCwzecX6WMn2dDx81fMUsVZe0GfFdnq76r4CnNRU2zhQrLI8UoBkmXj_QqFFl03Bs_ZcA0oe3GP1Cl7eePFX3-bVRz3_C4sUF-rjpJ73sULOCRwASQZdKGWwW-96DuzZXMzHXsT00AwB-zugw4jo',
        seo: {
            title: 'Senior Farm Manager Boac | Marinduque Jobs',
            description: 'Apply for Senior Farm Manager at Marinduque Agriculture Corp. ₱25k-₱30k salary. Leading copra production in Boac.',
            keywords: ['Farm Manager Marinduque', 'Agriculture Jobs Boac', 'Copra Production Marinduque']
        }
    }
];

export function getJobBySlug(slug: string): Job | undefined {
    return JOBS.find((j) => j.slug === slug);
}

export function generateJobSlug(title: string, company: string): string {
    return `${title}-${company}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
