from rest_framework import serializers
from .models import City, Forecast

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'

class ForecastSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)  # Include city details

    class Meta:
        model = Forecast
        fields = '__all__'
