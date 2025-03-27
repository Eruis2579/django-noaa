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
    wave_height = models.FloatField(null=True)
    wave_period = models.FloatField(null=True)
    wave_direction = models.FloatField(null=True)
    swell_height = models.FloatField(null=True)
    swell_period = models.FloatField(null=True)
    swell_direction = models.FloatField(null=True)
    swell2_height = models.FloatField(null=True)
    swell2_period = models.FloatField(null=True)
    swell2_direction = models.FloatField(null=True)
    wind_wave_height = models.FloatField(null=True)
    wind_wave_period = models.FloatField(null=True)
    wind_wave_direction = models.FloatField(null=True)
    wind_speed2= models.FloatField(null=True)
    wind_direction2= models.FloatField(null=True)

    class Meta:
        # Ensure that each combination of `city` and `date` is unique
        unique_together = ('city', 'date')
    def __str__(self):
        return f"{self.cityName} - {self.date}"
