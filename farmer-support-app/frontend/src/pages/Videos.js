import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Video, Play, Clock, Filter } from 'lucide-react';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideos = async (category = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/videos${category ? `?category=${category}` : ''}`);
      setVideos(response.data.videos);
      setCategories(response.data.categories);
      setError(null);
    } catch (err) {
      setError('Failed to fetch videos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchVideos(category);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Video className="animate-pulse text-red-600" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <Video className="mr-3 text-red-600" size={32} />
          Agricultural Videos
        </h1>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Filter className="mr-2 text-gray-600" size={20} />
            <span className="font-semibold">Filter by Category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-4 py-2 rounded-lg transition ${
                selectedCategory === '' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Categories
            </button>
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedCategory === category 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Videos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <iframe
                  src={video.url}
                  title={video.title}
                  className="w-full h-48"
                  allowFullScreen
                ></iframe>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                    {video.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-xs">
                    <Clock className="mr-1" size={12} />
                    {video.duration}
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">{video.description}</p>
              </div>
            </div>
          ))}
        </div>

        {videos.length === 0 && !loading && (
          <div className="text-center py-8">
            <Video className="mx-auto mb-4 text-gray-400" size={64} />
            <p className="text-gray-600">No videos found for the selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Videos;
