import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, TrendingUp, RefreshCw } from 'lucide-react';

const MarketPrices = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/market-prices');
      setPrices(response.data.prices);
      setError(null);
    } catch (err) {
      setError('Failed to fetch market prices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin text-green-600" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <DollarSign className="mr-3 text-green-600" size={32} />
            Market Prices
          </h1>
          <button
            onClick={fetchPrices}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center"
          >
            <RefreshCw className="mr-2" size={16} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prices.map((item, index) => (
            <div key={index} className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <TrendingUp className="text-green-600" size={20} />
              </div>
              
              <div className="mb-3">
                <span className="text-2xl font-bold text-green-600">
                  ₹{item.price_per_kg || item.price_per_quintal}
                </span>
                <span className="text-gray-600 ml-2">{item.unit}</span>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>Market: {item.market}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-800 mb-3">Price Information</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <h3 className="font-semibold mb-2">Vegetables (Per KG)</h3>
              <p>• Prices shown are for retail markets</p>
              <p>• Prices may vary by location and season</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Grains (Per Quintal)</h3>
              <p>• Prices from APMC mandis</p>
              <p>• Updated regularly based on market trends</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPrices;
