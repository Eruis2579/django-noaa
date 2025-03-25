from django.shortcuts import render
# Create your views here.
import json
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
            response_data = list(city_data.values('id','cityName', 'latitude', 'longitude'))

            return JsonResponse(response_data, safe=False)

        except ValueError:
            return JsonResponse({'message': 'Invalid date format. Please use YYYY-MM-DD.'}, status=400)

class WeatherDataView(View):
    def get(self, request, *args, **kwargs):
        # Get parameters from request
        print("asdasd")
        city_id = int(request.GET.get('city'))  # The city ID passed as a parameter
        date_str = request.GET.get('date')  # The date passed as a parameter (e.g., "2025-03-24")
        print(city_id, date_str)
        try:
            # Convert the date string to a datetime object
            date = datetime.strptime(date_str, "%Y-%m-%d").date()

            # Query the database to get the weather data for the given city and date
            weather_data = Forecast.objects.filter(city=city_id, date__date=date).select_related('city').values(
                'id',
                'temperature',
                'date',
                'cityName',
                'city__latitude',
                'city__longitude'
            )

            # If no data found
            if not weather_data.exists():
                weather_city_data = City.objects.filter(id=city_id).values(
                'cityName',
                'latitude',
                'longitude'
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
        city = int(request.POST.get("city"))
        cityName = request.POST.get("cityName")
        latitude =float(request.POST.get("latitude"))
        longitude =float(request.POST.get("longitude"))
        date_str = request.POST.get("date")
        forecast_tmp_time = request.POST.get("forecast_time")
        file_time = request.POST.get("file_time")

        during_time = int(forecast_tmp_time)
        try:
            date = datetime.strptime(date_str, "%Y-%m-%d")
            dir_date = date.date().strftime("%Y%m%d")
            # if date.hour ==0 and date.minute==0:
            #     oneDayAgoDate = date-timedelta(days=1)
            #     dir_date = oneDayAgoDate.date().strftime("%Y%m%d")
            #     file_time="18"
            # elif (date.hour==0 and date.minute>0) or (date.hour>0 and date.hour<6) or (date.hour==6 and date.minute==0):
            #     file_time = "00"
            # elif date.hour<12 or (date.hour==12 and date.minute==0):
            #     file_time="06"
            # elif date.hour<18 or (date.hour==18 and date.minute==0):
            #     file_time="12"
            # elif date.hour<24 :
            #     file_time="18"        
        except ValueError:
            return JsonResponse({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)
        
        for i in range(during_time+1):          
            if i<=100:
                forecast_time = f"{i}".zfill(3)
            elif i > 110:
                forecast_time = "110"
            else:
                forecast_time=f"{i}"

            # Fetch data from NOAA GFS 27km
            temperature= fetch_weather_data(latitude,longitude,forecast_time,dir_date,file_time)

            if temperature is None:
                return JsonResponse({"error": "No data available for the given parameters."}, status=404)
            
            x =f"{date.year}-{date.month}-{date.day} {file_time}:00:00"
            save_date = datetime.strptime(x, "%Y-%m-%d %H:%M:%S")
            # Store the fetched data in the database
            forecast_datetime = save_date + timedelta(hours=i)
            Forecast.objects.update_or_create(
                city=city,
                date=forecast_datetime,
                defaults={
                    "cityName":cityName,
                    "temperature":temperature
                }
            )
        return JsonResponse("The data has been updated correctly.",safe=False)
@csrf_exempt
def post_city_forecast(request):
    if request.method=='POST':
        data = json.loads(request.body)
        cityName = data.get("cityName")
        print("cityName")
        print(cityName)
        latitude =float(data.get("latitude"))
        longitude =float(data.get("longitude"))

        City.objects.update_or_create(
                latitude=latitude,
                longitude=longitude,
                defaults={
                    "cityName":cityName
                }
            )
            
        return JsonResponse("The control ran correctly..",safe=False)