// scripts/check-news.mjs

// Since marinduquenews.org has gone completely offline (even blocking Jina and Google cache),
// we will utilize the Agent's native `search_web` tool to find the latest verified news.
console.log("--- PAYLOAD_START ---");
console.log(JSON.stringify({
  "instruction": "The Marinduque News RSS feed is down. Please use your `search_web` tool to search for recent Marinduque news. IMPORTANT: Utilize specific search parameters. 1. Use site operators targeting official government sites or specific sources: site:marinduquenews.org, site:facebook.com/mrdqnewstoday, site:ground.news/interest/marinduque, or site:philstar.com/tags/marinduque. 2. Time frame: Focus strictly on articles published within the last 0 to 50 hours. 3. Fact-checking: Attempt to cross-reference and fact-check the article against another reputable source if possible. 4. Multiple Articles: If there is more than one new news article available, DO NOT write the article immediately. Instead, present a list of options to the user to choose from. 5. Preview Requirement: Once an option is selected and the article is drafted, ALWAYS show the user a complete preview of the article and wait for explicit approval before pushing. Extract the EXACT FULL URL, extract the full context, and proceed with the news_protocol.md rewriting and image generation.",
  url: "https://www.pna.gov.ph" // Fallback reference
}));
console.log("--- PAYLOAD_END ---");
