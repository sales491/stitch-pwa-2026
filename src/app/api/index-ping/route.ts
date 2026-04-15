import { NextResponse } from 'next/server';

const INDEX_NOW_KEY = 'cfdf6418b7eb4232bfdf6418b7eb4232';
const HOST = 'marinduquemarket.com';

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const urlToPing = searchParams.get('url');

        if (!urlToPing) {
            return NextResponse.json({ error: 'Missing ?url= parameter' }, { status: 400 });
        }

        // Must be absolute URL
        const absoluteUrl = urlToPing.startsWith('http') 
            ? urlToPing 
            : `https://${HOST}${urlToPing.startsWith('/') ? '' : '/'}${urlToPing}`;

        console.log(`Pinging IndexNow for: ${absoluteUrl}`);

        const response = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
                host: HOST,
                key: INDEX_NOW_KEY,
                keyLocation: `https://${HOST}/${INDEX_NOW_KEY}.txt`,
                urlList: [absoluteUrl],
            }),
        });

        if (response.ok) {
            return NextResponse.json({ success: true, url: absoluteUrl });
        } else {
            const errorText = await response.text();
            return NextResponse.json({ success: false, error: 'IndexNow rejected', details: errorText }, { status: response.status });
        }

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
    }
}
