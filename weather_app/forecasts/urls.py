from django.urls import path
from .views import CityListView, CityForecastView

urlpatterns = [
    path('cities/', CityListView.as_view(), name='city-list'),
    path('forecasts/<int:city_id>/', CityForecastView.as_view(), name='city-forecast'),
]
