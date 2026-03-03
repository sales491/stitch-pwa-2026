/**
 * Content Filter Utility
 * Runs before auto-approved content goes live.
 * Checks for prohibited words (English + Tagalog) and spam signals.
 */

// ─── Prohibited Words ────────────────────────────────────────────────────────
// English profanity, hate speech, and scam trigger words
const PROHIBITED_ENGLISH: string[] = [
    // Profanity
    'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'cock', 'dick', 'pussy', 'nigger',
    'faggot', 'retard', 'whore', 'slut',
    // Scam + spam
    'wire transfer', 'western union', 'moneygram', 'send money',
    'guaranteed income', 'work from home earn', 'make money fast',
    'click here now', 'limited time offer', 'act now', 'you have won',
    'claim your prize', 'earn $$', 'no experience needed easy money',
    'casino', 'online betting', 'sabong live',
    // Dangerous
    'bomb', 'kill yourself', 'suicide', 'drugs for sale', 'shabu', 'meth for sale',
];

// Tagalog profanity, slurs, and prohibited phrases
const PROHIBITED_TAGALOG: string[] = [
    // Major profanity
    'putang ina', 'putangina', 'tang ina', 'tangina', 'puta ka', 'pakyu',
    'gago', 'gaga', 'ulol', 'bobo', 'tanga', 'inutil', 'hayop ka',
    'leche', 'bwisit', 'tarantado', 'lintik', 'putcha', 'pating',
    // Sexual slurs
    'puki', 'tite', 'kantot', 'jakol', 'suso', 'hindot', 'niyot',
    // Racial / Ethnic slurs (context-dependent but worth filtering)
    'intsik', 'negro',
    // Scam phrases in Filipino context
    'padala mo na', 'bayad muna', 'legit to promise', 'libre palang',
    'kikita ka agad', 'walang puhunan',
];

// Spam detection patterns
const SPAM_URL_PATTERN = /https?:\/\/[^\s]+/gi;
const SPAM_EMAIL_PATTERN = /[\w.-]+@[\w.-]+\.[a-z]{2,}/gi;
const ALL_CAPS_THRESHOLD = 0.6; // 60% caps = likely spam
const REPEAT_CHAR_PATTERN = /(.)\1{4,}/g; // e.g. "aaaaaa"
const EXCESSIVE_PUNCTUATION = /[!?]{3,}/g; // "!!!" or "???"
const PHONE_SPAM_PATTERN = /(telegram|t\.me|whatsapp|wa\.me|viber)[^\s]*\s*:?\s*\d{7,}/gi;

// ─── Types ──────────────────────────────────────────────────────────────────
export interface FilterResult {
    passed: boolean;
    reason?: string;
    flaggedWords?: string[];
}

// ─── Main Filter Function ──────────────────────────────────────────────────
export function filterContent(text: string): FilterResult {
    const lower = text.toLowerCase().trim();

    // 1. Check prohibited words (English)
    const foundEnglish = PROHIBITED_ENGLISH.filter((word) =>
        lower.includes(word.toLowerCase())
    );
    if (foundEnglish.length > 0) {
        return {
            passed: false,
            reason: 'Content contains prohibited language.',
            flaggedWords: foundEnglish,
        };
    }

    // 2. Check prohibited words (Tagalog)
    const foundTagalog = PROHIBITED_TAGALOG.filter((word) =>
        lower.includes(word.toLowerCase())
    );
    if (foundTagalog.length > 0) {
        return {
            passed: false,
            reason: 'Content contains prohibited language.',
            flaggedWords: foundTagalog,
        };
    }

    // 3. Check excessive URLs (more than 2 = likely spam)
    const urlMatches = lower.match(SPAM_URL_PATTERN) || [];
    if (urlMatches.length > 2) {
        return {
            passed: false,
            reason: 'Content contains too many links and may be spam.',
        };
    }

    // 4. Check excessive email addresses
    const emailMatches = lower.match(SPAM_EMAIL_PATTERN) || [];
    if (emailMatches.length > 2) {
        return {
            passed: false,
            reason: 'Content contains too many email addresses and may be spam.',
        };
    }

    // 5. ALL CAPS check
    const letters = text.replace(/[^a-zA-Z]/g, '');
    if (letters.length > 20) {
        const capsRatio = (text.replace(/[^A-Z]/g, '').length) / letters.length;
        if (capsRatio > ALL_CAPS_THRESHOLD) {
            return {
                passed: false,
                reason: 'Content appears to be in ALL CAPS.',
            };
        }
    }

    // 6. Repeated characters (aaaaaa)
    if (REPEAT_CHAR_PATTERN.test(lower)) {
        return {
            passed: false,
            reason: 'Content contains suspicious repeated characters.',
        };
    }

    // 7. Excessive punctuation
    if (EXCESSIVE_PUNCTUATION.test(text)) {
        return {
            passed: false,
            reason: 'Content contains excessive punctuation.',
        };
    }

    // 8. Telegram/WhatsApp spam pattern
    if (PHONE_SPAM_PATTERN.test(lower)) {
        return {
            passed: false,
            reason: 'Content appears to contain external messaging platform spam.',
        };
    }

    return { passed: true };
}

/**
 * Quick helper for use in form onSubmit handlers.
 * Checks multiple fields at once (title, description, etc.)
 */
export function filterAllFields(fields: Record<string, string>): FilterResult {
    for (const [, value] of Object.entries(fields)) {
        if (!value) continue;
        const result = filterContent(value);
        if (!result.passed) return result;
    }
    return { passed: true };
}
