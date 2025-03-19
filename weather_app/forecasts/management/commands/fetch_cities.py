from django.core.management.base import BaseCommand
from forecasts.models import City  # Ensure this is your correct app name

class Command(BaseCommand):
    help = 'Fetches cities and stores them in the database'

    def handle(self, *args, **kwargs):
        cities = [
            {"name": "Buenos Aires", "latitude": 39.7456, "longitude": -97.0892},
            {"name": "La Plata", "latitude": 39.7456, "longitude": -97.0892},
            {"name": "Mar del Plata", "latitude": 39.7456, "longitude": -97.0892},
        ]

        for city in cities:
            City.objects.update_or_create(
                name=city["name"],
                defaults={"latitude": city["latitude"], "longitude": city["longitude"]}
            )

        self.stdout.write(self.style.SUCCESS("Successfully added cities"))
