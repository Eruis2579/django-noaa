from django.urls import path
from . import views
from .views import WeatherDataView,CityView

urlpatterns = [
    path('weather/', WeatherDataView.as_view(), name='weather_data'),
    path('weather_post/', views.post_weather_forecast, name='post_weather_forecast'),
    path('city/', views.CityView.as_view(), name='get_city_forecast'),
    path('city_post/', views.post_city_forecast, name='post_city_forecast'),
]
