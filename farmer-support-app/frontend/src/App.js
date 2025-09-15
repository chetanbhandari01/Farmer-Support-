import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CropAnalysis from './pages/CropAnalysis';
import Weather from './pages/Weather';
import MarketPrices from './pages/MarketPrices';
import Videos from './pages/Videos';
import Query from './pages/Query';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/crop-analysis" element={<CropAnalysis />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/market-prices" element={<MarketPrices />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/query" element={<Query />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
