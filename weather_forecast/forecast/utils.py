import requests
import pygrib
import numpy as np

def fetch_weather_data(latitude,longitude,forecast_time,dir_date,file_time):
    url = "https://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_0p25_1hr.pl"
    file = f"gfs.t{file_time}z.pgrb2.0p25.f{forecast_time}"
    dir = f"/gfs.{dir_date}/{file_time}/atmos"
    print(file,"file")
    print(dir,"dir")
    params = {
        "file": file,  # Adjust as needed for your forecast
        "lev_10_m_above_ground": "on",
        "lev_2_m_above_ground": "on",
        "lev_surface": "on",
        "subregion":'',
        "var_TMP": "on",  # Temperature
        "var_UGRD": "on",  # U-component of wind (east-west)
        "var_VGRD": "on",  # V-component of wind (north-south)
        "var_GUST": "on",  # Wind Gusts
        "var_TCDC": "on",  # Total Cloud Cover
        "var_PRATE": "on",  # Precipitation Rate

        "dir":dir,
        "leftlon":longitude-0.25,
        "rightlon":longitude+0.25,
        "toplat":latitude+0.25,
        "bottomlat":latitude-0.25
    }

    # Fetch the GRIB data
    response = requests.get(url, params=params)
    if response.status_code == 200:
        with open('grib_file.grib', 'wb') as f:
            f.write(response.content)
        print("GRIB file saved successfully.")
        
        grib_data = pygrib.open("grib_file.grib")

        temperature, wind_speed, wind_gust, wind_direction,average_temperature = None, None, None, None,None
        cloud_cover, precipitation = None, None
        u_wind=None
        v_wind=None

        # Extract the required data from the GRIB file
        for grb in grib_data:
            print(grb.shortName,"-----")
            if grb.shortName == '2t':
                temperature = grb.values
                temperature_celsius = temperature - 273.15

                # Calculate the average temperature of the area
                average_temperature = np.mean(temperature_celsius)
            elif grb.shortName == "10u":  # UGRD (East-West Wind)
                u_wind = np.mean(grb.values)
            elif grb.shortName == "10v":  # VGRD (North-South Wind)
                v_wind = np.mean(grb.values)
            elif grb.shortName == "gust":  # Wind Gusts
                wind_gust = np.mean(grb.values* 1.94384)
            elif grb.shortName == "tcdc":  # Total Cloud Cover
                cloud_cover = np.mean(grb.values)
            elif grb.shortName == "prate":  # Precipitation Rate
                precipitation = np.mean(grb.values*3600)
        if u_wind is not None and v_wind is not None:
            wind_speed = np.sqrt(u_wind**2 + v_wind**2) * 1.94384  # Convert m/s to knots
            wind_direction = (np.arctan2(v_wind, u_wind) * 180 / np.pi) % 360
            print(wind_speed, "-----")
            print(wind_direction, "+++++")
        else:
            wind_speed = None
            wind_direction = None
        # return average_temperature
        return {
                "temperature": average_temperature,
                "wind_speed": wind_speed,
                "wind_gusts": wind_gust,
                "wind_direction": wind_direction,
                "cloud_cover": cloud_cover,
                "precipitation": precipitation
            }
    else:
        return None
