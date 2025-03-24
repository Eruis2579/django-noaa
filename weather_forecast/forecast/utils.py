import requests
import pygrib
from io import BytesIO
from datetime import datetime
import numpy as np

def fetch_weather_data(latitude,longitude,forecast_time,dir_date,file_time):
    url = "https://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_0p25_1hr.pl"
    file = f"gfs.t{file_time}z.pgrb2.0p25.f{forecast_time}"
    dir = f"/gfs.{dir_date}/{file_time}/atmos"
    print(file,"file")
    print(dir,"dir")
    params = {
        "file": file,  # Adjust as needed for your forecast
        "lev_2_m_above_ground": "on",
        "subregion":'',
        "var_TMP": "on",  # Temperature
        # "var_WIND": "on",  # Wind
        # "var_RH": "on",  # Relative Humidity
        # "latlon": "1",  # Latitude/Longitude grid
        # "bbox": f"{latitude-0.5},{longitude-0.5},{latitude+0.5},{longitude+0.5}",
        # "dir": "/gfs.{date}".format(date=date),
        "dir":dir,
        "leftlon":longitude-0.25,
        "rightlon":longitude+0.25,
        "toplat":latitude+0.25,
        "bottomlat":latitude-0.25
    }

    # Fetch the GRIB data
    response = requests.get(url, params=params)
    # response = requests.get(url)
    # print(response)
    if response.status_code == 200:
        with open('grib_file.grib', 'wb') as f:
            f.write(response.content)
        print("GRIB file saved successfully.")
        print("szljklj")
        grib_data = pygrib.open("grib_file.grib")
        temperature = None
        wind_speed = None
        humidity = None
        wave_height = None

        # Extract the required data from the GRIB file
        for grb in grib_data:
            if grb.shortName == '2t':
                temperature = grb.values
                temperature_celsius = temperature - 273.15

                # Calculate the average temperature of the area
                average_temperature = np.mean(temperature_celsius)
                print("Temperature data extracted successfully.")
                print(average_temperature)
                # return temperature
        #     if "Temperature" in grb.name:
        #         temperature = grb.values[0][0]
        #     elif "Wind" in grb.name:
        #         wind_speed = grb.values[0][0]
        #     elif "Relative humidity" in grb.name:
        #         humidity = grb.values[0][0]
        #     # Add more conditions for other data

        return average_temperature
    else:
        return None
