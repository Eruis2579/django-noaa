from django.shortcuts import render
# Create your views here.
import json
import time
from django.http import JsonResponse
from .models import Forecast, City
from .utils import fetch_weather_data
from datetime import datetime, timedelta
from django.views.decorators.csrf import csrf_exempt
from django.views import View

class CityView(View):
    def get(self, request, *args, **kwargs):
        try:
            # Query the database to get the weather data for the given city and date
            city_data = City.objects.all()

            # If no data found
            if not city_data.exists():
                return JsonResponse({'message': 'No data found for the given city and date'}, status=404)

            # Prepare the response data
            response_data = list(city_data.values('id','cityName', 'latitude', 'longitude','coast'))

            return JsonResponse(response_data, safe=False)

        except ValueError:
            return JsonResponse({'message': 'Invalid date format. Please use YYYY-MM-DD.'}, status=400)

class WeatherDataView(View):
    def get(self, request, *args, **kwargs):
        # Get parameters from request
        city_id = int(request.GET.get('city'))  # The city ID passed as a parameter
        date_str = request.GET.get('date')  # The date passed as a parameter (e.g., "2025-03-24")
        try:
            # Convert the date string to a datetime object
            date = datetime.strptime(date_str, "%Y-%m-%d").date()
            # Query the database to get the weather data for the given city and date
            weather_data = Forecast.objects.filter(city=city_id, date__date=date).select_related('city').values(
                'id',
                'temperature',
                "wind_speed",
                "wind_gusts",
                "wind_direction",
                "cloud_cover",
                "precipitation",
                "wave_height",
                "wave_period",
                "wave_direction",
                "swell_height",
                "swell_period",
                "swell_direction",
                "swell2_height",
                "swell2_period",
                "swell2_direction",
                "wind_wave_height",
                "wind_wave_period",
                "wind_wave_direction",
                "wind_speed2",
                "wind_direction2",
                'date',
                'cityName',
                'city__latitude',
                'city__longitude',
                'city__coast',
            ).order_by('date')
            # If no data found
            if not weather_data.exists():
                weather_city_data = City.objects.filter(id=city_id).values(
                'cityName',
                'latitude',
                'longitude',
                'coast'
            )
                response_data = list(weather_city_data)

                return JsonResponse(response_data, safe=False)

            # Prepare the response data
            response_data = list(weather_data)

            return JsonResponse(response_data, safe=False)

        except ValueError:
            return JsonResponse({'message': 'Invalid date format. Please use YYYY-MM-DD.'}, status=400)

@csrf_exempt
def post_weather_forecast(request):
    if request.method=='POST':
        data = json.loads(request.body)
        print(data,"data")
        city_id = int(data.get("cityId"))                      #2
        cityName = data.get("cityName")                     #argen
        latitude =float(data.get("latitude"))               #-23.43
        longitude =float(data.get("longitude"))             #-45.23
        date_str = data.get("date")                         #2025-03-23
        forecast_tmp_time = data.get("forecastTime")        #124
        file_time = data.get("initTime")                    #06
        coast = data.get("coast")

        city = City.objects.get(id=city_id)
        during_time = int(forecast_tmp_time)
        try:
            date = datetime.strptime(date_str, "%Y-%m-%d")
            dir_date = date.date().strftime("%Y%m%d")
        except ValueError:
            return JsonResponse({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)
        
        for i in range(during_time+1):          
            if i<=100:
                forecast_time = f"{i}".zfill(3)
            elif i > 110:
                forecast_time = "110"
            else:
                forecast_time=f"{i}"

            # Fetch data from NOAA GFS 13km
            weather_data = fetch_weather_data(latitude, longitude, forecast_time, dir_date, file_time,coast)
            if weather_data is not None:
                x =f"{date.year}-{date.month}-{date.day} {file_time}:00:00"
                save_date = datetime.strptime(x, "%Y-%m-%d %H:%M:%S")
                # Store the fetched data in the database
                forecast_datetime = save_date + timedelta(hours=i)
                Forecast.objects.update_or_create(
                    city=city,
                    date=forecast_datetime,
                    defaults={**weather_data,"cityName":cityName}
                )
                time.sleep(3)
            else:
                return JsonResponse("No data.",safe=False,status=400)
        return JsonResponse("The data has been updated correctly.",safe=False)
@csrf_exempt
def post_city_forecast(request):
    if request.method=='POST':
        data = json.loads(request.body)
        cityName = data.get("cityName")
        coast = data.get("coast")
        latitude =float(data.get("latitude"))
        longitude =float(data.get("longitude"))

        City.objects.update_or_create(
                latitude=latitude,
                longitude=longitude,
                defaults={
                    "cityName":cityName,
                    "coast":coast
                }
            )
            
        return JsonResponse("The control ran correctly..",safe=False)
@csrf_exempt
def delete_city_forecast(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            city_id = data.get("cityId")

            if city_id is None:
                return JsonResponse({"error": "cityId is required"}, status=400)

            deleted_count, _ = City.objects.filter(id=city_id).delete()

            if deleted_count == 0:
                return JsonResponse({"error": "City not found"}, status=404)

            return JsonResponse({"message": "City deleted successfully"}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)