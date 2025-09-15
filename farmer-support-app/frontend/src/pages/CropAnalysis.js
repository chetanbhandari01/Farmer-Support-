import React, { useState } from 'react';
import axios from 'axios';
import { Camera, Upload, Loader, CheckCircle, AlertCircle } from 'lucide-react';

const CropAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:8000/analyze-crop', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (err) {
      setError('Failed to analyze crop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <Camera className="mr-3 text-green-600" size={32} />
          Crop Analysis
        </h1>

        {/* Upload Section */}
        <div className="mb-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            {previewUrl ? (
              <div>
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="mx-auto mb-4 max-h-64 rounded-lg shadow-md"
                />
                <button
                  onClick={() => {
                    setPreviewUrl(null);
                    setSelectedFile(null);
                    setResult(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div>
                <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600 mb-4">Click to upload or drag and drop</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition"
                >
                  Choose File
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Analyze Button */}
        {selectedFile && (
          <div className="text-center mb-8">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center mx-auto"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin mr-2" size={20} />
                  Analyzing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2" size={20} />
                  Analyze Crop
                </>
              )}
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="text-red-600 mr-3" size={20} />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && result.success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Analysis Results</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Crop Information</h3>
                <p><strong>Name:</strong> {result.crop.name}</p>
                <p><strong>Description:</strong> {result.crop.description}</p>
                <p><strong>Suitable Season:</strong> {result.crop.suitable_season}</p>
                <p><strong>Harvest Time:</strong> {result.crop.harvest_time}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                <p className="mb-3">{result.crop.advice}</p>
                <div>
                  <strong>Common Diseases:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {result.crop.diseases.map((disease, index) => (
                      <li key={index} className="text-gray-700">{disease}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropAnalysis;
