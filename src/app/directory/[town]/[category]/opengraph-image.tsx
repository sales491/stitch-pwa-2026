import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const alt = 'Marinduque Market Local Hub';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

const SLUG_TO_TOWN: Record<string, string> = {
    'boac': 'Boac',
    'gasan': 'Gasan',
    'mogpog': 'Mogpog',
    'santa-cruz': 'Santa Cruz',
    'buenavista': 'Buenavista',
    'torrijos': 'Torrijos',
};

const SLUG_TO_CAT: Record<string, string> = {
    'accommodation': 'Accommodation',
    'beauty-personal-care': 'Beauty & Care',
    'cafe': 'Cafe',
    'hardware': 'Hardware',
    'education': 'Education',
    'finance': 'Finance',
    'food-and-dining': 'Food & Dining',
    'gas-station': 'Gas Stations',
    'healthcare': 'Healthcare',
    'restaurant': 'Restaurants',
    'retail': 'Retail',
    'services': 'Services',
    'sports': 'Sports & Fitness',
};

export default async function Image({ params }: { params: { town: string; category: string } }) {
    const { town, category } = await params;
    const townName = SLUG_TO_TOWN[town.toLowerCase()] || town;
    const catName = SLUG_TO_CAT[category.toLowerCase()] || category;

    return new ImageResponse(
        (
            <div
                style={{
                    background: '#0f172a', // Dark theme for Hubs
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                    padding: '80px',
                    position: 'relative',
                }}
            >
                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: '#ce1126', opacity: 0.2, filter: 'blur(80px)' }} />
                <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: '#0ea5e9', opacity: 0.1, filter: 'blur(80px)' }} />

                {/* Branding */}
                <div style={{ position: 'absolute', top: 60, left: 60, color: 'white', fontSize: 24, fontWeight: 900, letterSpacing: '0.1em' }}>
                    MARINDUQUE MARKET HUB
                </div>

                {/* Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <p style={{ fontSize: 32, fontWeight: 800, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.3em', margin: 0 }}>
                        Local Directory
                    </p>
                    <h1 style={{ fontSize: 96, fontWeight: 900, color: 'white', margin: '20px 0', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                        Best {catName} in {townName}
                    </h1>
                    <div style={{ height: 6, width: 120, background: '#ce1126', marginTop: 20 }} />
                </div>

                {/* Footer */}
                <div style={{ position: 'absolute', bottom: 60, right: 60, color: '#475569', fontSize: 24, fontWeight: 600 }}>
                    marinduquemarket.com
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
