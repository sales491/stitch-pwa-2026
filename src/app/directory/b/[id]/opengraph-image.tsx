import { ImageResponse } from 'next/og';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'edge';

// Image metadata
export const alt = 'Marinduque Market Hub Business Profile';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch business data
    const { data: biz } = await supabase
        .from('business_profiles')
        .select('business_name, location, average_rating, review_count, gallery_image')
        .eq('id', id)
        .single();

    if (!biz) {
        return new ImageResponse(
            (
                <div style={{ fontSize: 48, background: 'white', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Business Not Found
                </div>
            ),
            { ...size }
        );
    }

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                    padding: '40px',
                    position: 'relative',
                    border: '20px solid #ce1126', // Moriones Red border
                }}
            >
                {/* Branding */}
                <div style={{ position: 'absolute', top: 60, left: 60, display: 'flex', alignItems: 'center' }}>
                    <div style={{ background: '#ce1126', color: 'white', padding: '8px 16px', borderRadius: '12px', fontSize: 24, fontWeight: 'black', letterSpacing: '-0.05em' }}>
                        MARINDUQUE MARKET
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: 40 }}>
                    <h1 style={{ fontSize: 84, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.05em', lineHeight: 1 }}>
                        {biz.business_name}
                    </h1>
                    <p style={{ fontSize: 32, fontWeight: 700, color: '#64748b', marginTop: 20, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                        {biz.location}, Marinduque
                    </p>

                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 40, background: '#f1f5f9', padding: '16px 32px', borderRadius: '32px' }}>
                        <span style={{ fontSize: 48, fontWeight: 900, color: '#0f172a' }}>
                            {(biz.average_rating || 0).toFixed(1)}
                        </span>
                        <div style={{ display: 'flex', marginLeft: 16 }}>
                             <span style={{ fontSize: 42, color: '#fbbf24' }}>★</span>
                        </div>
                        <span style={{ fontSize: 24, fontWeight: 700, color: '#94a3b8', marginLeft: 16 }}>
                            ({biz.review_count || 0} reviews)
                        </span>
                    </div>
                </div>

                {/* Footer Tagline */}
                <div style={{ position: 'absolute', bottom: 60, fontSize: 24, fontWeight: 600, color: '#94a3b8' }}>
                    Verified Local Business • marinduquemarket.com
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
