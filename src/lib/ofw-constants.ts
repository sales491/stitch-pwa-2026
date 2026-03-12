// OFW currency list — shared between server actions and client components
export const OFW_CURRENCIES = [
    { code: 'USD', flag: '🇺🇸', name: 'US Dollar',         country: 'USA' },
    { code: 'SAR', flag: '🇸🇦', name: 'Saudi Riyal',       country: 'Saudi Arabia' },
    { code: 'AED', flag: '🇦🇪', name: 'UAE Dirham',        country: 'UAE' },
    { code: 'GBP', flag: '🇬🇧', name: 'British Pound',     country: 'UK' },
    { code: 'CAD', flag: '🇨🇦', name: 'Canadian Dollar',   country: 'Canada' },
    { code: 'AUD', flag: '🇦🇺', name: 'Australian Dollar', country: 'Australia' },
    { code: 'SGD', flag: '🇸🇬', name: 'Singapore Dollar',  country: 'Singapore' },
    { code: 'HKD', flag: '🇭🇰', name: 'Hong Kong Dollar',  country: 'Hong Kong' },
    { code: 'JPY', flag: '🇯🇵', name: 'Japanese Yen',      country: 'Japan' },
    { code: 'KRW', flag: '🇰🇷', name: 'Korean Won',        country: 'South Korea' },
    { code: 'EUR', flag: '🇪🇺', name: 'Euro',              country: 'Europe' },
    { code: 'QAR', flag: '🇶🇦', name: 'Qatari Riyal',      country: 'Qatar' },
] as const;
