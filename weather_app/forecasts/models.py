from django.db import models

class City(models.Model):
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.name

class Forecast(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    temperature = models.FloatField()
    humidity = models.FloatField(null=True, blank=True)
    wind_speed = models.FloatField()
    timestamp = models.DateTimeField()

    def __str__(self):
        return f"{self.city.name} - {self.timestamp}"
