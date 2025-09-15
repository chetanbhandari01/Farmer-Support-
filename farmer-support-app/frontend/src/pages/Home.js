import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Cloud, DollarSign, Video, MessageSquare, Leaf } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Camera,
      title: 'Crop Analysis',
      description: 'Upload crop photos for AI-powered identification and advice',
      link: '/crop-analysis',
      color: 'bg-blue-500'
    },
    {
      icon: Cloud,
      title: 'Weather Info',
      description: 'Get real-time weather data for your location',
      link: '/weather',
      color: 'bg-indigo-500'
    },
    {
      icon: DollarSign,
      title: 'Market Prices',
      description: 'Check current vegetable and crop prices',
      link: '/market-prices',
      color: 'bg-green-500'
    },
    {
      icon: Video,
      title: 'Learning Videos',
      description: 'Watch educational agricultural videos',
      link: '/videos',
      color: 'bg-red-500'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-16 px-6 rounded-lg mb-8">
        <div className="text-center">
          <Leaf className="mx-auto mb-4" size={64} />
          <h1 className="text-4xl font-bold mb-4">Welcome to Farmer Support System</h1>
          <p className="text-xl mb-8">Your AI-powered agricultural assistant</p>
          <Link
            to="/crop-analysis"
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Link
              key={index}
              to={feature.link}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/query"
            className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
          >
            <MessageSquare className="text-blue-600" size={24} />
            <div>
              <h3 className="font-semibold">Ask a Question</h3>
              <p className="text-gray-600">Get instant farming advice</p>
            </div>
          </Link>
          <Link
            to="/crop-analysis"
            className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
          >
            <Camera className="text-green-600" size={24} />
            <div>
              <h3 className="font-semibold">Analyze Crop Photo</h3>
              <p className="text-gray-600">Upload and get instant analysis</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
