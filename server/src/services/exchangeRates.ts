let EXCHANGE_URI = 'https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt'

let cachedRates: { // default value of null, if an object exists then it is an object, neato!
    EUR_CZK: number; lastUpdated: string
} | null = null;

export const fetchExchangeRates = async (): Promise<number> => {
    if(cachedRates && isCacheValid(cachedRates.lastUpdated)) {
        return cachedRates.EUR_CZK;
    }

    try {
        const response = await fetch(EXCHANGE_URI)
        const text = await response.text();

        const eurRateLine = text.split('\n').find(line => line.includes('EUR|'));
        const eurRate = parseFloat(eurRateLine?.split('|')[4] || '24.5');

        cachedRates = {
            EUR_CZK: eurRate,
            lastUpdated: new Date().toISOString()
        };
        return eurRate;
    }
    
    catch (err) {
        return 24.5
    }
};

const isCacheValid = (lastUpdated: string): boolean => {
    return Date.now() - new Date(lastUpdated).getTime() < 24 * 60 * 60 * 1000
}

