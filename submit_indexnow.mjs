const HOST = "marinduquemarket.com";
const KEY = "cfdf6418b7eb4232bfdf6418b7eb4232";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// Default to submitting the main routes if no argument is provided
const defaultUrls = [
  `https://${HOST}/`,
  `https://${HOST}/marketplace/`,
  `https://${HOST}/jobs/`,
  `https://${HOST}/directory/`,
  `https://${HOST}/events/`,
  `https://${HOST}/gems/`
];

const args = process.argv.slice(2);
const urlsToSubmit = args.length > 0 ? args : defaultUrls;

async function submitToIndexNow(urls) {
  // Ensure URLs are properly formatted
  const formattedUrls = urls.map(url => {
    if (!url.startsWith('http')) {
      return `https://${HOST}${url.startsWith('/') ? '' : '/'}${url}`;
    }
    return url;
  });

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: formattedUrls
  };

  try {
    console.log(`Submitting ${formattedUrls.length} URLs to IndexNow...`);
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log('✅ Successfully submitted to IndexNow (Bing/Yandex)!');
      console.log('Submitted URLs:');
      formattedUrls.forEach(u => console.log(` - ${u}`));
    } else {
      const errorText = await response.text();
      console.error(`❌ Failed to submit. Status: ${response.status} ${response.statusText}`);
      console.error(errorText);
    }
  } catch (error) {
    console.error('❌ Error submitting to IndexNow:', error);
  }
}

submitToIndexNow(urlsToSubmit);
