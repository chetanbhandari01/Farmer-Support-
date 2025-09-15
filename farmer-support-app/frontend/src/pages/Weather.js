import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cloud, Thermometer, Droplets, Wind, Eye } from 'lucide-react';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          await fetchWeather(latitude, longitude);
        },
        (error) => {
          setError('Unable to get your location. Please enable location services.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  const fetchWeather = async (lat, lon) => {
    try {
      const response = await axios.get(`http://localhost:8000/weather?lat=${lat}&lon=${lon}`);
      setWeather(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <Cloud className="mr-3 text-blue-600" size={32} />
          Weather Information
        </h1>

        {!weather && (
          <div className="text-center py-8">
            <Cloud className="mx-auto mb-4 text-gray-400" size={64} />
            <p className="text-gray-600 mb-6">Get weather information for your location</p>
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Getting Location...' : 'Get Weather'}
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {weather && weather.success && (
          <div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Thermometer className="text-blue-600 mr-2" size={20} />
                  <h3 className="font-semibold">Temperature</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">{weather.weather.temperature}°C</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Droplets className="text-green-600 mr-2" size={20} />
                  <h3 className="font-semibold">Humidity</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">{weather.weather.humidity}%</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Wind className="text-purple-600 mr-2" size={20} />
                  <h3 className="font-semibold">Wind Speed</h3>
                </div>
                <p className="text-2xl font-bold text-purple-600">{weather.weather.wind_speed} m/s</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Eye className="text-yellow-600 mr-2" size={20} />
                  <h3 className="font-semibold">Condition</h3>
                </div>
                <p className="text-lg font-semibold text-yellow-600 capitalize">
                  {weather.weather.description}
                </p>
              </div>
            </div>

            {weather.forecast && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">3-Day Forecast</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {weather.forecast.map((day, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">{day.day}</h3>
                      <p className="text-gray-600">{day.description}</p>
                      <div className="flex justify-between mt-2">
                        <span className="font-semibold">{day.temp_max}°</span>
                        <span className="text-gray-500">{day.temp_min}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={getCurrentLocation}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Refresh Weather
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
