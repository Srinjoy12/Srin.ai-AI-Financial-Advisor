# 📈 Stock Market API Setup Guide

Your financial advisor now supports **both Indian and US stock markets**! Here's how to set up the APIs:

## 🚀 **Quick Start (Works Immediately)**

The app works with **mock data** by default - no API keys needed for testing!

## 🔑 **API Options (Choose One or More)**

### **1. Twelve Data (Recommended) 🏆**
- ✅ **Best Coverage**: 70+ exchanges including NSE/BSE (India) + NASDAQ/NYSE (US)
- ✅ **Free Tier**: 800 requests/day
- ✅ **Affordable**: $8/month for 5000 requests/day
- ✅ **Real-time**: WebSocket support available

**Setup:**
1. Sign up at [twelvedata.com](https://twelvedata.com)
2. Get your API key from dashboard
3. Add to `.env.local`:
```bash
NEXT_PUBLIC_TWELVE_DATA_API_KEY=your_twelve_data_key_here
```

### **2. Alpha Vantage (Current)**
- ✅ **Good Coverage**: Indian stocks (BSE/NSE) + US stocks
- ✅ **Free Tier**: 25 requests/day, 5 requests/minute
- ❌ **Limited**: May need premium for real-time data

**Setup:**
1. Get free key at [alphavantage.co](https://www.alphavantage.co/support/#api-key)
2. Add to `.env.local`:
```bash
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
```

### **3. Financial Modeling Prep (US Focus)**
- ✅ **US Stocks**: Excellent coverage for NASDAQ/NYSE
- ✅ **Free Tier**: 250 requests/day
- ❌ **Limited Indian Coverage**: Few Indian stocks

**Setup:**
1. Sign up at [financialmodelingprep.com](https://financialmodelingprep.com)
2. Add to `.env.local`:
```bash
NEXT_PUBLIC_FMP_API_KEY=your_fmp_key_here
```

## ⚙️ **How It Works**

The system tries APIs in this order:
1. **Twelve Data** (if key available) - best coverage
2. **Alpha Vantage** (if key available) - fallback
3. **Financial Modeling Prep** (if key available, US only) - secondary fallback
4. **Mock Data** - always works as final fallback

## 🌍 **Supported Markets**

### **Indian Stocks (NSE/BSE)**
- Reliance Industries (RELIANCE)
- Tata Consultancy Services (TCS)
- Infosys (INFY)
- HDFC Bank (HDFCBANK)
- ICICI Bank (ICICIBANK)
- ITC Limited (ITC)

### **US Stocks (NASDAQ/NYSE)**
- Apple Inc. (AAPL)
- Alphabet Inc. (GOOGL)
- Microsoft Corporation (MSFT)
- Tesla Inc. (TSLA)
- Amazon.com Inc. (AMZN)
- NVIDIA Corporation (NVDA)

### **Market Indices**
- **Indian**: NIFTY 50, SENSEX
- **US**: S&P 500, NASDAQ

## 🎯 **Features**

- **Real-time Prices**: Live stock prices with change indicators
- **Dual Currency**: ₹ (INR) for Indian stocks, $ (USD) for US stocks
- **Market Switching**: Toggle between Indian 🇮🇳 and US 🇺🇸 markets
- **Auto-refresh**: Updates every 5 minutes
- **Fallback System**: Always works even without API keys
- **Company Names**: Full company names with stock symbols

## 🔧 **Environment Variables**

Add to your `.env.local` file:

```bash
# Stock Market APIs (Optional - mock data available)
NEXT_PUBLIC_TWELVE_DATA_API_KEY=your_twelve_data_key_here
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
NEXT_PUBLIC_FMP_API_KEY=your_fmp_key_here

# Existing keys
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

## 💡 **Recommendations**

### **For Development**
- Use **mock data** (no setup required)
- Test with **Alpha Vantage free tier**

### **For Production**
- Use **Twelve Data** for best coverage and reliability
- **$8/month** for 5000 requests/day is very reasonable
- Supports both Indian and US markets perfectly

### **For Budget-Conscious**
- Start with **Alpha Vantage free tier** (25 requests/day)
- Upgrade to **Twelve Data** when you need more requests

## 🚨 **Important Notes**

1. **Rate Limits**: Respect API rate limits to avoid getting blocked
2. **Caching**: The app caches data for 5 minutes to reduce API calls
3. **Fallbacks**: Multiple fallback systems ensure the app always works
4. **Mock Data**: Realistic mock data for testing without API keys
5. **CORS**: All APIs support browser requests (no CORS issues)

## 🔄 **After Setup**

1. Add your API keys to `.env.local`
2. Restart your development server
3. Go to **Dashboard → Market** to see live data
4. Use the 🇮🇳/🇺🇸 toggle to switch between markets

Your AI financial advisor now has professional-grade market data! 🎉 