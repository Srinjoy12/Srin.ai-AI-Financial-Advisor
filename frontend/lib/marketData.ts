// Market Data Service for Real-time Stock Prices
// Supporting both Indian (NSE/BSE) and US (NASDAQ/NYSE) markets

interface StockPrice {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
  market: 'indian' | 'us';
  currency: 'INR' | 'USD';
}

interface MarketData {
  indianStocks: StockPrice[];
  usStocks: StockPrice[];
  indices: {
    // Indian Indices
    nifty50: { value: number; change: number; changePercent: number };
    sensex: { value: number; change: number; changePercent: number };
    // US Indices
    sp500: { value: number; change: number; changePercent: number };
    nasdaq: { value: number; change: number; changePercent: number };
  };
  lastUpdated: string;
}

class MarketDataService {
  // API Configuration - supports multiple providers
  private alphaVantageKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo';
  private twelveDataKey = process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY || '';
  private fmpKey = process.env.NEXT_PUBLIC_FMP_API_KEY || '';
  
  private alphaVantageUrl = 'https://www.alphavantage.co/query';
  private twelveDataUrl = 'https://api.twelvedata.com';
  private fmpUrl = 'https://financialmodelingprep.com/api/v3';
  
  // Popular stocks for both markets
  private indianStocks = [
    { symbol: 'RELIANCE.NSE', name: 'Reliance Industries' },
    { symbol: 'TCS.NSE', name: 'Tata Consultancy Services' },
    { symbol: 'INFY.NSE', name: 'Infosys' },
    { symbol: 'HDFCBANK.NSE', name: 'HDFC Bank' },
    { symbol: 'ICICIBANK.NSE', name: 'ICICI Bank' },
    { symbol: 'ITC.NSE', name: 'ITC Limited' }
  ];

  private usStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' }
  ];

  // Primary method - tries multiple APIs in order
  async getStockPrice(symbol: string, stockName: string, market: 'indian' | 'us'): Promise<StockPrice | null> {
    // Try Twelve Data first (best coverage)
    if (this.twelveDataKey) {
      const price = await this.getTwelveDataPrice(symbol, stockName, market);
      if (price) return price;
    }

    // Fallback to Alpha Vantage
    if (this.alphaVantageKey && this.alphaVantageKey !== 'demo') {
      const price = await this.getAlphaVantagePrice(symbol, stockName, market);
      if (price) return price;
    }

    // Fallback to Financial Modeling Prep (mainly for US stocks)
    if (this.fmpKey && market === 'us') {
      const price = await this.getFMPPrice(symbol, stockName, market);
      if (price) return price;
    }

    return null;
  }

  // Twelve Data API (Recommended)
  private async getTwelveDataPrice(symbol: string, stockName: string, market: 'indian' | 'us'): Promise<StockPrice | null> {
    try {
      const cleanSymbol = symbol.replace('.NSE', '').replace('.BSE', '');
      const response = await fetch(
        `${this.twelveDataUrl}/quote?symbol=${cleanSymbol}&apikey=${this.twelveDataKey}`
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      
      if (data.status === 'error') return null;
      
      return {
        symbol: cleanSymbol,
        name: stockName,
        price: parseFloat(data.close || '0'),
        change: parseFloat(data.change || '0'),
        changePercent: parseFloat(data.percent_change || '0'),
        lastUpdated: data.datetime || new Date().toISOString(),
        market,
        currency: market === 'indian' ? 'INR' : 'USD'
      };
    } catch (error) {
      console.error(`Twelve Data error for ${symbol}:`, error);
      return null;
    }
  }

  // Alpha Vantage API
  private async getAlphaVantagePrice(symbol: string, stockName: string, market: 'indian' | 'us'): Promise<StockPrice | null> {
    try {
      const response = await fetch(
        `${this.alphaVantageUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.alphaVantageKey}`
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      const quote = data['Global Quote'];
      
      if (!quote) return null;
      
      return {
        symbol: quote['01. symbol'] || symbol,
        name: stockName,
        price: parseFloat(quote['05. price'] || '0'),
        change: parseFloat(quote['09. change'] || '0'),
        changePercent: parseFloat(quote['10. change percent']?.replace('%', '') || '0'),
        lastUpdated: quote['07. latest trading day'] || new Date().toISOString().split('T')[0],
        market,
        currency: market === 'indian' ? 'INR' : 'USD'
      };
    } catch (error) {
      console.error(`Alpha Vantage error for ${symbol}:`, error);
      return null;
    }
  }

  // Financial Modeling Prep API (US stocks)
  private async getFMPPrice(symbol: string, stockName: string, market: 'indian' | 'us'): Promise<StockPrice | null> {
    try {
      const response = await fetch(
        `${this.fmpUrl}/quote/${symbol}?apikey=${this.fmpKey}`
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      
      if (!data || data.length === 0) return null;
      
      const quote = data[0];
      
      return {
        symbol: quote.symbol || symbol,
        name: stockName,
        price: parseFloat(quote.price || '0'),
        change: parseFloat(quote.change || '0'),
        changePercent: parseFloat(quote.changesPercentage || '0'),
        lastUpdated: new Date().toISOString(),
        market,
        currency: market === 'indian' ? 'INR' : 'USD'
      };
    } catch (error) {
      console.error(`FMP error for ${symbol}:`, error);
      return null;
    }
  }

  async getMultipleStockPrices(stockList: Array<{symbol: string, name: string}>, market: 'indian' | 'us'): Promise<StockPrice[]> {
    const promises = stockList.map(stock => this.getStockPrice(stock.symbol, stock.name, market));
    const results = await Promise.allSettled(promises);
    
    return results
      .filter((result): result is PromiseFulfilledResult<StockPrice> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);
  }

  async getMarketOverview(): Promise<MarketData> {
    try {
      // Get both Indian and US stocks in parallel
      const [indianStocks, usStocks] = await Promise.all([
        this.getMultipleStockPrices(this.indianStocks.slice(0, 6), 'indian'),
        this.getMultipleStockPrices(this.usStocks.slice(0, 6), 'us')
      ]);
      
      // Mock indices data (in real implementation, you'd fetch from respective APIs)
      const indices = {
        // Indian Indices
        nifty50: {
          value: 19800 + Math.random() * 400 - 200,
          change: Math.random() * 200 - 100,
          changePercent: Math.random() * 2 - 1
        },
        sensex: {
          value: 66000 + Math.random() * 1000 - 500,
          change: Math.random() * 500 - 250,
          changePercent: Math.random() * 2 - 1
        },
        // US Indices
        sp500: {
          value: 4500 + Math.random() * 100 - 50,
          change: Math.random() * 50 - 25,
          changePercent: Math.random() * 1 - 0.5
        },
        nasdaq: {
          value: 14000 + Math.random() * 200 - 100,
          change: Math.random() * 100 - 50,
          changePercent: Math.random() * 1.5 - 0.75
        }
      };

      return {
        indianStocks,
        usStocks,
        indices,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching market overview:', error);
      
      // Return mock data as fallback
      return this.getMockMarketData();
    }
  }

  private getMockMarketData(): MarketData {
    const mockIndianStocks: StockPrice[] = [
      { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2456.75, change: 23.45, changePercent: 0.96, lastUpdated: new Date().toISOString().split('T')[0], market: 'indian', currency: 'INR' },
      { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3678.90, change: -12.30, changePercent: -0.33, lastUpdated: new Date().toISOString().split('T')[0], market: 'indian', currency: 'INR' },
      { symbol: 'INFY', name: 'Infosys', price: 1543.25, change: 8.75, changePercent: 0.57, lastUpdated: new Date().toISOString().split('T')[0], market: 'indian', currency: 'INR' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1687.40, change: 15.60, changePercent: 0.93, lastUpdated: new Date().toISOString().split('T')[0], market: 'indian', currency: 'INR' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 945.80, change: -5.20, changePercent: -0.55, lastUpdated: new Date().toISOString().split('T')[0], market: 'indian', currency: 'INR' },
      { symbol: 'ITC', name: 'ITC Limited', price: 456.30, change: 2.10, changePercent: 0.46, lastUpdated: new Date().toISOString().split('T')[0], market: 'indian', currency: 'INR' }
    ];

    const mockUsStocks: StockPrice[] = [
      { symbol: 'AAPL', name: 'Apple Inc.', price: 175.84, change: 2.15, changePercent: 1.24, lastUpdated: new Date().toISOString().split('T')[0], market: 'us', currency: 'USD' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21, change: -1.45, changePercent: -1.04, lastUpdated: new Date().toISOString().split('T')[0], market: 'us', currency: 'USD' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.85, change: 4.32, changePercent: 1.15, lastUpdated: new Date().toISOString().split('T')[0], market: 'us', currency: 'USD' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -8.75, changePercent: -3.40, lastUpdated: new Date().toISOString().split('T')[0], market: 'us', currency: 'USD' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 155.89, change: 1.23, changePercent: 0.80, lastUpdated: new Date().toISOString().split('T')[0], market: 'us', currency: 'USD' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.28, change: 15.67, changePercent: 1.82, lastUpdated: new Date().toISOString().split('T')[0], market: 'us', currency: 'USD' }
    ];

    return {
      indianStocks: mockIndianStocks,
      usStocks: mockUsStocks,
      indices: {
        nifty50: { value: 19845.65, change: 125.30, changePercent: 0.63 },
        sensex: { value: 66589.93, change: 287.50, changePercent: 0.43 },
        sp500: { value: 4567.18, change: 12.45, changePercent: 0.27 },
        nasdaq: { value: 14236.92, change: -23.67, changePercent: -0.17 }
      },
      lastUpdated: new Date().toISOString()
    };
  }

  // Get stock recommendations with real-time prices
  async getStockRecommendationsWithPrices(recommendations: any[]): Promise<any[]> {
    if (!recommendations || recommendations.length === 0) {
      return [];
    }

    // Separate Indian and US recommendations
    const indianRecs = recommendations.filter(rec => rec.market === 'indian' || rec.symbol.includes('.NSE') || rec.symbol.includes('.BSE'));
    const usRecs = recommendations.filter(rec => rec.market === 'us' || (!rec.symbol.includes('.NSE') && !rec.symbol.includes('.BSE')));

    // Get prices for both markets
    const [indianPrices, usPrices] = await Promise.all([
      indianRecs.length > 0 ? this.getMultipleStockPrices(
        indianRecs.map(rec => ({ symbol: rec.symbol, name: rec.name || rec.symbol })), 
        'indian'
      ) : [],
      usRecs.length > 0 ? this.getMultipleStockPrices(
        usRecs.map(rec => ({ symbol: rec.symbol, name: rec.name || rec.symbol })), 
        'us'
      ) : []
    ]);

    const allPrices = [...indianPrices, ...usPrices];
    
    return recommendations.map(rec => {
      const priceData = allPrices.find(p => p.symbol === rec.symbol || p.symbol.includes(rec.symbol.split('.')[0]));
      return {
        ...rec,
        currentPrice: priceData?.price || null,
        priceChange: priceData?.change || null,
        priceChangePercent: priceData?.changePercent || null,
        lastUpdated: priceData?.lastUpdated || null,
        currency: priceData?.currency || 'INR'
      };
    });
  }
}

export const marketDataService = new MarketDataService();
export type { StockPrice, MarketData }; 