from django.shortcuts import render
from rest_framework import generics
from .models import City, Forecast
from .serializers import CitySerializer, ForecastSerializer

# List all cities
class CityListView(generics.ListAPIView):
    queryset = City.objects.all()
    serializer_class = CitySerializer

# Get forecasts for a specific city
class CityForecastView(generics.ListAPIView):
    serializer_class = ForecastSerializer

    def get_queryset(self):
        city_id = self.kwargs['city_id']
        return Forecast.objects.filter(city_id=city_id).order_by('-timestamp')[:10]  # Last 10 forecasts

