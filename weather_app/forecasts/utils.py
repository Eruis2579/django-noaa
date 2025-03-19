import requests
from .models import City, Forecast
from django.conf import settings
from geopy.geocoders import Nominatim
import time
from datetime import datetime


GEONAMES_USERNAME = "eruis0818"  # Replace with your Geonames username
NOAA_BASE_URL = "https://api.weather.gov"

# def fetch_buenos_aires_cities():
#     url = f"http://api.geonames.org/searchJSON?country=AR&adminCode1=B&featureClass=P&maxRows=50&username={GEONAMES_USERNAME}"
#     response = requests.get(url)
    
#     if response.status_code == 200:
#         cities_data = response.json().get("geonames", [])
#         for city in cities_data:
#             name = city.get("name")
#             latitude = city.get("lat")
#             longitude = city.get("lng")

#             if not City.objects.filter(name=name).exists():
#                 City.objects.create(name=name, latitude=latitude, longitude=longitude)
#                 print(f"Added city: {name}")

#     else:
#         print("Failed to fetch cities")


def fetch_buenos_aires_cities():
    geolocator = Nominatim(user_agent="weather_app")
    cities = ["La Plata", "Mar del Plata", "Bahía Blanca", "Tandil", "San Nicolás de los Arroyos"]  # Add more if needed

    for city in cities:
        location = geolocator.geocode(city + ", Buenos Aires, Argentina")
        if location:
            City.objects.get_or_create(name=city, latitude=location.latitude, longitude=location.longitude)
            print(f"Added city: {city}")

        time.sleep(1)  # Avoid request limit


def fetch_weather_for_city(city):
    """
    Fetch weather forecast for a given city from NOAA API.
    """
    url = f"{NOAA_BASE_URL}/points/{city.latitude},{city.longitude}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        grid_id = data["properties"]["gridId"]
        grid_x = data["properties"]["gridX"]
        grid_y = data["properties"]["gridY"]

        forecast_url = f"{NOAA_BASE_URL}/gridpoints/{grid_id}/{grid_x},{grid_y}/forecast"
        forecast_response = requests.get(forecast_url)

        if forecast_response.status_code == 200:
            forecast_data = forecast_response.json()["properties"]["periods"]
            for entry in forecast_data:
                Forecast.objects.update_or_create(
                    city=city,
                    timestamp=datetime.fromisoformat(entry["startTime"]),
                    defaults={
                        "temperature": entry["temperature"],
                        "humidity": entry.get("relativeHumidity", {}).get("value"),
                        "wind_speed": float(entry["windSpeed"].split(" ")[0]),
                    },
                )
            print(f"Weather data updated for {city.name}")
        else:
            print(f"Failed to fetch forecast for {city.name}")

    else:
        print(f"Failed to fetch grid info for {city.name}")