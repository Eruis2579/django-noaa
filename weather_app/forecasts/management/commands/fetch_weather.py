from django.core.management.base import BaseCommand
from forecasts.models import City
from forecasts.utils import fetch_weather_for_city

class Command(BaseCommand):
    help = "Fetch weather data from NOAA for all cities"

    def handle(self, *args, **kwargs):
        cities = City.objects.all()
        for city in cities:
            fetch_weather_for_city(city)
        self.stdout.write(self.style.SUCCESS("Weather data updated!"))
