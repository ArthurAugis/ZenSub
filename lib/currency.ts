export const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'JPY', symbol: '¥' },
    { code: 'CAD', symbol: 'C$' },
    { code: 'AUD', symbol: 'A$' },
];

export type ExchangeRates = Record<string, number>;

// Fallback rates if API fails
const FALLBACK_RATES: ExchangeRates = {
    USD: 1.0,
    EUR: 0.95,
    GBP: 0.79,
    JPY: 154.0,
    CAD: 1.41,
    AUD: 1.54,
};

export async function getExchangeRates(): Promise<ExchangeRates> {
    try {
        const res = await fetch('https://api.frankfurter.app/latest?from=USD', { next: { revalidate: 3600 } }); // Cache for 1 hour
        if (!res.ok) throw new Error('Failed to fetch rates');
        const data = await res.json();
        
        return { USD: 1, ...data.rates };
    } catch (error) {
        console.warn('Using fallback currency rates:', error);
        return FALLBACK_RATES;
    }
}

export function convertCurrency(amount: number, from: string, to: string, rates: ExchangeRates): number {
    const fromRate = rates[from] || 1;
    const toRate = rates[to] || 1;
    
    const amountInUSD = amount / fromRate;
    return amountInUSD * toRate;
}

export function formatPrice(amount: number, currencyCode: string) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: 2,
    }).format(amount);
}
