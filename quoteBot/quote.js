const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const fallbackQuotes = [
    "Life is what happens while you're busy making other plans. - John Lennon",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "In three words I can sum up everything I've learned about life: it goes on. - Robert Frost",
    "Be yourself; everyone else is already taken. - Oscar Wilde",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill"
];

const API_URLS = [
    'https://api.quotable.io/random',
    'https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en',
    'https://zenquotes.io/api/random'
];

async function fetchWithTimeout(url, options = {}) {
    const timeout = 5000; // 5 seconds timeout
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

async function getRandomQuote() {
    for (const url of API_URLS) {
        try {
            const response = await fetchWithTimeout(url, {
                headers: {
                    'User-Agent': 'Discord-Quote-Bot/1.0'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Handle different API response formats
            if (url.includes('quotable.io')) {
                return `"${data.content}" - ${data.author}`;
            } else if (url.includes('forismatic')) {
                return `"${data.quoteText}" - ${data.quoteAuthor || 'Unknown'}`;
            } else if (url.includes('zenquotes')) {
                return `"${data[0].q}" - ${data[0].a}`;
            }
        } catch (error) {
            console.error(`Failed with ${url}:`, error);
            continue; // Try next API if available
        }
    }
    
    // If all APIs fail, use fallback
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    return fallbackQuotes[randomIndex];
}

module.exports = { getRandomQuote };
