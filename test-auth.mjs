import fetch from 'node-fetch';

async function test() {
    const urls = [
        'http://localhost:3000/admin',
        'http://localhost:3000/profile',
        'http://localhost:3000/login'
    ];

    for (const url of urls) {
        const res = await fetch(url, { redirect: 'manual' });
        console.log(`${url} -> ${res.status} ${res.headers.get('location') || ''}`);
    }
}

test();
