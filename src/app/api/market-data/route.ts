import { NextResponse } from "next/server";

// Realistic market data as of January 19, 2026
// These prices are estimates based on market trends

export interface AssetPrice {
    id: string;
    name: string;
    symbol: string;
    price: number;
    priceChange24h: number;
    unit: string;
    lastUpdated: string;
}

export interface MarketData {
    gold: AssetPrice[];
    stocks: AssetPrice[];
    crypto: AssetPrice[];
    mutualFunds: AssetPrice[];
    lastUpdated: string;
}

// Gold prices (per gram in IDR)
const goldPrices: AssetPrice[] = [
    {
        id: "antam",
        name: "Emas ANTAM",
        symbol: "ANTAM",
        price: 1285000,
        priceChange24h: 0.45,
        unit: "gram",
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "ubs",
        name: "Emas UBS",
        symbol: "UBS",
        price: 1275000,
        priceChange24h: 0.38,
        unit: "gram",
        lastUpdated: new Date().toISOString(),
    },
];

// Indonesian stock prices (per share in IDR)
const stockPrices: AssetPrice[] = [
    {
        id: "bbri",
        name: "Bank Rakyat Indonesia",
        symbol: "BBRI",
        price: 5850,
        priceChange24h: 1.74,
        unit: "lembar",
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "bbca",
        name: "Bank Central Asia",
        symbol: "BBCA",
        price: 10250,
        priceChange24h: 0.98,
        unit: "lembar",
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "tlkm",
        name: "Telkom Indonesia",
        symbol: "TLKM",
        price: 3980,
        priceChange24h: -0.50,
        unit: "lembar",
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "asii",
        name: "Astra International",
        symbol: "ASII",
        price: 5425,
        priceChange24h: 2.15,
        unit: "lembar",
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "unvr",
        name: "Unilever Indonesia",
        symbol: "UNVR",
        price: 2890,
        priceChange24h: -1.02,
        unit: "lembar",
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "goto",
        name: "GoTo Gojek Tokopedia",
        symbol: "GOTO",
        price: 78,
        priceChange24h: 3.95,
        unit: "lembar",
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "buka",
        name: "Bukalapak",
        symbol: "BUKA",
        price: 142,
        priceChange24h: -2.07,
        unit: "lembar",
        lastUpdated: new Date().toISOString(),
    },
];

// Cryptocurrency prices (in IDR)
const cryptoPrices: AssetPrice[] = [
    {
        id: "btc",
        name: "Bitcoin",
        symbol: "BTC",
        price: 1750000000, // ~$105,000 USD
        priceChange24h: 2.34,
        unit: "koin",
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "eth",
        name: "Ethereum",
        symbol: "ETH",
        price: 58500000, // ~$3,500 USD
        priceChange24h: 1.87,
        unit: "koin",
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "bnb",
        name: "Binance Coin",
        symbol: "BNB",
        price: 12500000, // ~$750 USD
        priceChange24h: 0.92,
        unit: "koin",
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "sol",
        name: "Solana",
        symbol: "SOL",
        price: 4200000, // ~$250 USD
        priceChange24h: 4.56,
        unit: "koin",
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "xrp",
        name: "Ripple",
        symbol: "XRP",
        price: 42000, // ~$2.50 USD
        priceChange24h: -0.78,
        unit: "koin",
        lastUpdated: new Date().toISOString(),
    },
];

// Mutual fund NAV prices (per unit in IDR)
const mutualFundPrices: AssetPrice[] = [
    {
        id: "schd-pasar-uang",
        name: "Schroder Dana Pasar Uang",
        symbol: "SCHD-PU",
        price: 1542.87,
        priceChange24h: 0.02,
        unit: "unit",
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "manulife-saham",
        name: "Manulife Saham Andalan",
        symbol: "MANU-SA",
        price: 2876.45,
        priceChange24h: 1.25,
        unit: "unit",
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "bni-reksadana",
        name: "BNI-AM Dana Pendapatan Tetap",
        symbol: "BNI-DPT",
        price: 1823.12,
        priceChange24h: 0.15,
        unit: "unit",
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "batavia-dana",
        name: "Batavia Dana Saham",
        symbol: "BTVA-DS",
        price: 3245.78,
        priceChange24h: 2.08,
        unit: "unit",
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "sucorinvest",
        name: "Sucorinvest Maxi Fund",
        symbol: "SUCO-MF",
        price: 1987.34,
        priceChange24h: 0.67,
        unit: "unit",
        lastUpdated: new Date().toISOString(),
    },
];

export async function GET() {
    const marketData: MarketData = {
        gold: goldPrices,
        stocks: stockPrices,
        crypto: cryptoPrices,
        mutualFunds: mutualFundPrices,
        lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(marketData);
}
