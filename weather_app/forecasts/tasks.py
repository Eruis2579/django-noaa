from celery import shared_task
from .models import City
from .utils import fetch_weather_for_city

@shared_task
def update_weather_data():
    cities = City.objects.all()
    for city in cities:
        fetch_weather_for_city(city)
