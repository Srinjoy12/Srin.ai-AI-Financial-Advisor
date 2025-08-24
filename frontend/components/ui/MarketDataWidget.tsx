'use client';

import { useEffect, useState } from 'react';
import { marketDataService, type MarketData, type StockPrice } from '@/lib/marketData';
import { TrendingUp, TrendingDown, Activity, RefreshCw } from 'lucide-react';

export default function MarketDataWidget() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [selectedMarket, setSelectedMarket] = useState<'indian' | 'us'>('indian');

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const data = await marketDataService.getMarketOverview();
      setMarketData(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatChange = (change: number, changePercent: number, currency: 'INR' | 'USD' = 'INR') => {
    const isPositive = change >= 0;
    const color = isPositive ? 'text-green-400' : 'text-red-400';
    const icon = isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />;
    const currencySymbol = currency === 'INR' ? '₹' : '$';
    
    return (
      <div className={`flex items-center gap-1 ${color}`}>
        {icon}
        <span className="text-xs">
          {isPositive ? '+' : ''}{currencySymbol}{Math.abs(change).toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
        </span>
      </div>
    );
  };

  if (loading && !marketData) {
    return (
      <div className="relative bg-blue-500/5 hover:bg-blue-500/0 p-6 rounded-lg border border-blue-500/20 backdrop-blur-md transition-all duration-300 group">
        <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Market Overview
            </h3>
            <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
          </div>
        </div>
        <span className="absolute opacity-0 group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
      </div>
    );
  }

  return (
    <div className="relative bg-blue-500/5 hover:bg-blue-500/0 p-6 rounded-lg border border-blue-500/20 backdrop-blur-md transition-all duration-300 group">
      <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-400" />
            <h3 className="text-gray-400 text-sm">Market Overview</h3>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value as 'indian' | 'us')}
              className="bg-black/30 border border-gray-600/30 rounded px-2 py-1 text-xs text-white"
            >
              <option value="indian">🇮🇳 Indian</option>
              <option value="us">🇺🇸 US</option>
            </select>
            <button 
              onClick={fetchMarketData}
              disabled={loading}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Market Indices */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {selectedMarket === 'indian' ? (
            <>
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">NIFTY 50</div>
                <div className="text-lg font-medium text-white">
                  {marketData?.indices.nifty50.value.toFixed(2)}
                </div>
                {formatChange(marketData?.indices.nifty50.change || 0, marketData?.indices.nifty50.changePercent || 0, 'INR')}
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">SENSEX</div>
                <div className="text-lg font-medium text-white">
                  {marketData?.indices.sensex.value.toFixed(2)}
                </div>
                {formatChange(marketData?.indices.sensex.change || 0, marketData?.indices.sensex.changePercent || 0, 'INR')}
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">S&P 500</div>
                <div className="text-lg font-medium text-white">
                  {marketData?.indices.sp500.value.toFixed(2)}
                </div>
                {formatChange(marketData?.indices.sp500.change || 0, marketData?.indices.sp500.changePercent || 0, 'USD')}
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">NASDAQ</div>
                <div className="text-lg font-medium text-white">
                  {marketData?.indices.nasdaq.value.toFixed(2)}
                </div>
                {formatChange(marketData?.indices.nasdaq.change || 0, marketData?.indices.nasdaq.changePercent || 0, 'USD')}
              </div>
            </>
          )}
        </div>

        {/* Top Stocks */}
        <div className="space-y-3">
          <div className="text-xs text-gray-400 mb-2">
            Top {selectedMarket === 'indian' ? 'Indian' : 'US'} Stocks
          </div>
          {(selectedMarket === 'indian' ? marketData?.indianStocks : marketData?.usStocks)?.slice(0, 4).map((stock, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${selectedMarket === 'indian' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                <div>
                  <div className="text-white font-medium">{stock.symbol}</div>
                  <div className="text-xs text-gray-400 truncate max-w-24">{stock.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white">
                  {stock.currency === 'INR' ? '₹' : '$'}{stock.price.toFixed(2)}
                </div>
                {formatChange(stock.change, stock.changePercent, stock.currency)}
              </div>
            </div>
          ))}
        </div>

        {lastUpdated && (
          <div className="mt-4 pt-4 border-t border-gray-700/30">
            <div className="text-xs text-gray-500">
              Last updated: {lastUpdated}
            </div>
          </div>
        )}
      </div>
      
      <span className="absolute opacity-0 group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
    </div>
  );
} 