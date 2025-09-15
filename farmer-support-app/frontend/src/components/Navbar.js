import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Camera, Cloud, DollarSign, Video, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/crop-analysis', label: 'Crop Analysis', icon: Camera },
    { path: '/weather', label: 'Weather', icon: Cloud },
    { path: '/market-prices', label: 'Market Prices', icon: DollarSign },
    { path: '/videos', label: 'Videos', icon: Video },
    { path: '/query', label: 'Ask Query', icon: MessageSquare },
  ];

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-xl font-bold">Farmer Support App</div>
          <div className="flex space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded transition ${
                    isActive 
                      ? 'bg-green-700 text-white' 
                      : 'text-green-100 hover:bg-green-500'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden md:block">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
