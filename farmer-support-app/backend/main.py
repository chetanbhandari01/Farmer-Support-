from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from PIL import Image
import requests
import os
import json
from typing import List, Optional
import uuid
from datetime import datetime
import io

app = FastAPI(title="Farmer Support System API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Weather API configuration
WEATHER_API_KEY = "your_openweather_api_key"  # Get from openweathermap.org

# Sample crop database
CROP_DATABASE = {
    "wheat": {
        "name": "Wheat",
        "description": "Cereal grain crop",
        "advice": "Water regularly, apply nitrogen fertilizer during tillering stage",
        "diseases": ["Rust", "Blight"],
        "harvest_time": "90-120 days",
        "suitable_season": "Rabi (Winter)"
    },
    "rice": {
        "name": "Rice",
        "description": "Staple food crop",
        "advice": "Maintain water level 2-5 cm, transplant after 25-30 days",
        "diseases": ["Blast", "Bacterial Leaf Blight"],
        "harvest_time": "110-140 days",
        "suitable_season": "Kharif (Monsoon)"
    },
    "tomato": {
        "name": "Tomato",
        "description": "Fruit vegetable crop",
        "advice": "Provide support, prune suckers, regular watering",
        "diseases": ["Late Blight", "Early Blight"],
        "harvest_time": "60-90 days",
        "suitable_season": "All seasons with proper care"
    }
}

# Sample market prices
MARKET_PRICES = [
    {"name": "Tomato", "price_per_kg": 25, "unit": "Rs/kg", "market": "Local Mandi"},
    {"name": "Potato", "price_per_kg": 18, "unit": "Rs/kg", "market": "Local Mandi"},
    {"name": "Onion", "price_per_kg": 30, "unit": "Rs/kg", "market": "Local Mandi"},
    {"name": "Wheat", "price_per_quintal": 2100, "unit": "Rs/quintal", "market": "APMC"},
    {"name": "Rice", "price_per_quintal": 2800, "unit": "Rs/quintal", "market": "APMC"},
    {"name": "Carrot", "price_per_kg": 22, "unit": "Rs/kg", "market": "Local Mandi"},
    {"name": "Cabbage", "price_per_kg": 15, "unit": "Rs/kg", "market": "Local Mandi"},
]

# Agricultural videos database
AGRICULTURAL_VIDEOS = [
    {
        "id": 1,
        "title": "Modern Wheat Farming Techniques",
        "description": "Learn about latest wheat cultivation methods",
        "url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "category": "Crop Management",
        "duration": "15:30"
    },
    {
        "id": 2,
        "title": "Organic Farming Basics",
        "description": "Introduction to organic farming practices",
        "url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "category": "Organic Farming",
        "duration": "12:45"
    },
    {
        "id": 3,
        "title": "Pest Management in Vegetables",
        "description": "Effective pest control strategies for vegetable crops",
        "url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "category": "Pest Control",
        "duration": "18:20"
    },
    {
        "id": 4,
        "title": "Water Management in Agriculture",
        "description": "Efficient irrigation techniques for farmers",
        "url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "category": "Irrigation",
        "duration": "20:15"
    }
]

def simple_crop_identification(image):
    """Simple crop identification based on image characteristics"""
    # This is a simplified version - in reality, you'd use a trained ML model
    # For demo purposes, we'll return a random crop from our database
    import random
    crop_key = random.choice(list(CROP_DATABASE.keys()))
    return crop_key

@app.get("/")
async def root():
    return {"message": "Farmer Support System API is running!"}

@app.post("/analyze-crop")
async def analyze_crop(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and process image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Save uploaded image
        filename = f"{uuid.uuid4()}.jpg"
        filepath = f"uploads/{filename}"
        image.save(filepath)
        
        # Identify crop (simplified - replace with actual ML model)
        identified_crop = simple_crop_identification(image)
        crop_info = CROP_DATABASE.get(identified_crop, CROP_DATABASE["wheat"])
        
        return {
            "success": True,
            "crop": crop_info,
            "image_url": f"/uploads/{filename}",
            "analysis_date": datetime.now().isoformat()
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.get("/weather")
async def get_weather(lat: float, lon: float):
    try:
        if not WEATHER_API_KEY or WEATHER_API_KEY == "":
            # Return mock data if API key not set
            return {
                "success": True,
                "location": {"lat": lat, "lon": lon},
                "weather": {
                    "temperature": 28,
                    "humidity": 65,
                    "description": "Partly cloudy",
                    "wind_speed": 12,
                    "pressure": 1013
                },
                "forecast": [
                    {"day": "Tomorrow", "temp_max": 30, "temp_min": 22, "description": "Sunny"},
                    {"day": "Day 2", "temp_max": 29, "temp_min": 21, "description": "Cloudy"},
                    {"day": "Day 3", "temp_max": 27, "temp_min": 20, "description": "Light rain"}
                ]
            }
        
        # Real API call
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}&units=metric"

        response = requests.get(url)
        data = response.json()
        
        return {
            "success": True,
            "location": {"lat": lat, "lon": lon},
            "weather": {
                "temperature": data["main"]["temp"],
                "humidity": data["main"]["humidity"],
                "description": data["weather"][0]["description"],
                "wind_speed": data["wind"]["speed"],
                "pressure": data["main"]["pressure"]
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching weather: {str(e)}")

@app.get("/market-prices")
async def get_market_prices():
    return {
        "success": True,
        "prices": MARKET_PRICES,
        "last_updated": datetime.now().isoformat()
    }

@app.get("/videos")
async def get_videos(category: Optional[str] = None):
    videos = AGRICULTURAL_VIDEOS
    if category:
        videos = [v for v in videos if v["category"].lower() == category.lower()]
    
    return {
        "success": True,
        "videos": videos,
        "categories": list(set([v["category"] for v in AGRICULTURAL_VIDEOS]))
    }

@app.post("/ask-query")
async def ask_query(query: str = Form(...)):
    # Simple query processing - in reality, you'd use NLP/AI
    query_lower = query.lower()
    
    if "weather" in query_lower:
        response = "For weather information, please share your location and I'll provide current weather conditions."
    elif "price" in query_lower or "market" in query_lower:
        response = "Check the market prices section for current vegetable and crop prices in your area."
    elif "disease" in query_lower or "pest" in query_lower:
        response = "Please upload a photo of your crop for disease identification and treatment suggestions."
    elif "fertilizer" in query_lower:
        response = "The fertilizer requirement depends on your crop type and soil condition. Upload a crop photo for specific recommendations."
    else:
        response = "I'm here to help with crop identification, weather information, market prices, and farming advice. Please be more specific about your query."
    
    return {
        "success": True,
        "query": query,
        "response": response,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

