from django.db import models

# Create your models here.

class City(models.Model):
    cityName = models.CharField(max_length=100)
    longitude = models.FloatField()
    latitude = models.FloatField()
    coast = models.BooleanField(default=False)
    class Meta:
        # Ensure that each combination of `city` and `date` is unique
        unique_together = ('latitude', 'longitude')
    def __str__(self):
        return f"{self.cityName}"

class Forecast(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='forecasts')
    cityName = models.CharField(max_length=100)
    date = models.DateTimeField()
    temperature = models.FloatField()
    wind_speed = models.FloatField()
    wind_gusts = models.FloatField()
    wind_direction = models.FloatField()
    cloud_cover = models.FloatField(null=True)
    precipitation = models.FloatField()

    class Meta:
        # Ensure that each combination of `city` and `date` is unique
        unique_together = ('city', 'date')
    def __str__(self):
        return f"{self.cityName} - {self.date}"
