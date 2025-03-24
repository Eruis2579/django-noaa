from django.db import models

# Create your models here.
class Forecast(models.Model):
    city = models.IntegerField()
    cityName = models.CharField(max_length=100)
    date = models.DateTimeField()
    temperature = models.FloatField()

    class Meta:
        # Ensure that each combination of `city` and `date` is unique
        unique_together = ('city', 'date')
    def __str__(self):
        return f"{self.cityName} - {self.date}"

class City(models.Model):
    cityName = models.CharField(max_length=100)
    longitude = models.FloatField()
    latitude = models.FloatField()
    class Meta:
        # Ensure that each combination of `city` and `date` is unique
        unique_together = ('latitude', 'longitude')
    def __str__(self):
        return f"{self.cityName}"