import React, { useState } from 'react';
import axios from 'axios';
import { MessageSquare, Send, Bot, User } from 'lucide-react';

const Query = () => {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { type: 'user', message: query, timestamp: new Date() };
    setConversation(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('query', query);
      
      const response = await axios.post('http://localhost:8000/ask-query', formData);
      
      const botMessage = { 
        type: 'bot', 
        message: response.data.response, 
        timestamp: new Date() 
      };
      
      setConversation(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { 
        type: 'bot', 
        message: 'Sorry, I encountered an error. Please try again.', 
        timestamp: new Date() 
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <MessageSquare className="mr-3 text-purple-600" size={32} />
          Ask Your Query
        </h1>

        {/* Conversation Area */}
        <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto mb-6">
          {conversation.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <Bot size={48} className="mx-auto mb-4 text-gray-400" />
              <p>Hello! I'm your AI farming assistant.</p>
              <p>Ask me anything about crops, weather, prices, or farming techniques.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                      msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        msg.type === 'user' ? 'bg-blue-600' : 'bg-green-600'
                      }`}
                    >
                      {msg.type === 'user' ? (
                        <User className="text-white" size={16} />
                      ) : (
                        <Bot className="text-white" size={16} />
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                      <Bot className="text-white" size={16} />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about crops, weather, prices, or farming techniques..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center"
          >
            <Send size={16} className="mr-2" />
            Send
          </button>
        </form>

        {/* Suggested Questions */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Suggested Questions:</h3>
          <div className="grid md:grid-cols-2 gap-2">
            {[
              "What's the best time to plant wheat?",
              "How can I protect my crops from pests?",
              "What fertilizer should I use for tomatoes?",
              "When should I harvest my rice crop?"
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setQuery(suggestion)}
                className="text-left p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Query;
