from django.core.management.base import BaseCommand
from forecasts.models import City  # Ensure this is your correct app name

class Command(BaseCommand):
    help = 'Fetches cities and stores them in the database'

    def handle(self, *args, **kwargs):
        cities = [
            {"name": "Necochea", "latitude": -38.5545, "longitude": -58.73961},
            {"name": "Mar del Plata", "latitude": -38.00042, "longitude":  -57.5562},
            {"name": "Mar del Sur", "latitude": -38.34288, "longitude": -57.9908},
            {"name": "Miramar", "latitude": -38.27161, "longitude": -57.8389},
            {"name": "Reta", "latitude": -38.89483, "longitude": -60.34496},
            {"name": "Balneario Los Ángeles", "latitude": -38.66756, "longitude": -59.00221},
            {"name": "Balneario San Cayetano", "latitude": -38.74811, "longitude": -59.43047},
            {"name": "Azul", "latitude": -36.75, "longitude": -59.66667},
            {"name": "Partido de Balcarce", "latitude": -37.75, "longitude":  -58.25},
            {"name": "Benito Juárez", "latitude": -37.5, "longitude":  -59.91667},
            {"name": "Partido de Adolfo González Chaves", "latitude": -38, "longitude":  -60.25},
            {"name": "Partido de Laprida ", "latitude": -37.5, "longitude":  -60.75},
            {"name": "Partido de Lobería", "latitude": -38.08333, "longitude":  -58.75},
            {"name": "Partido de Rauch", "latitude": -36.58333, "longitude":  -58.83333},
            {"name": "Partido de Tandil", "latitude": -37.33333, "longitude":  -59.25},
            {"name": "Partido de Tres Arroyos", "latitude": -38.5, "longitude":  -60.25},
            {"name": "Partido de Olavarría", "latitude": -36.75, "longitude":  -60.75}   
        ]
        for city in cities:
            City.objects.update_or_create(
                name=city["name"],
                defaults={"latitude": city["latitude"], "longitude": city["longitude"]}
            )

        self.stdout.write(self.style.SUCCESS("Successfully added cities"))
