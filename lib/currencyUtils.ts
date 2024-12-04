export const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    CNY: '¥',
    KRW: '₩',
    // Add more currencies as needed
  };
  
  /**
   * Get the symbol for a given currency code.
   * @param currencyCode - The ISO currency code (e.g., USD, EUR).
   * @returns The currency symbol or the currency code itself if not found.
   */
  export function getCurrencySymbol(currencyCode: string): string {
    return currencySymbols[currencyCode] || currencyCode;
  }
  