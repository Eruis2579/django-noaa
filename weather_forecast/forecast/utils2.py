import requests
import pygrib
import numpy as np

def fetch_weather_data(latitude,longitude,forecast_time,dir_date,file_time,coast):
    url = "https://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_0p25_1hr.pl"
    waveUrl = "https://nomads.ncep.noaa.gov/cgi-bin/filter_wave.pl"

    file = f"gfs.t{file_time}z.pgrb2.0p25.f{forecast_time}"
    waveFile = f"multi_1.glo_30m.t{file_time}z.f{forecast_time}.grib2"

    dir = f"/gfs.{dir_date}/{file_time}/atmos"
    waveDir = f"/wave.{dir_date}/{file_time}/wave/grib2"
    print(file,"file")
    print(dir,"dir")
    print(waveFile,"wavefile")
    print(waveDir,"wavedir")
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
    waveParams = {
        "file": waveFile,
        "var_HTSGW": "on",   # Significant Wave Height
        "var_WVPER": "on",   # Mean Wave Period
        "var_WVDIR": "on",   # Mean Wave Direction
        "var_SWELL": "on",   # Swell Height
        "var_SWPER": "on",   # Swell Period
        "var_SWDIR": "on",   # Swell Direction
        "var_SWELL2": "on",  # 2nd Swell Height
        "var_SWPER2": "on",  # 2nd Swell Period
        "var_SWDIR2": "on",  # 2nd Swell Direction
        "var_WVHGT": "on",   # Wind Wave Height
        "var_WVPER": "on",   # Wind Wave Period
        "var_WVDIR": "on",   # Wind Wave Direction
        "var_TIDE": "on",    # Tide Height
        "subregion": '',
        "dir": waveDir,
        "leftlon": longitude - 0.25,
        "rightlon": longitude + 0.25,
        "toplat": latitude + 0.25,
        "bottomlat": latitude - 0.25
    }
    totalData,gfsdata,wavedata = None,None,None
    # Fetch the GRIB data
    response = requests.get(url, params=params)
    if coast :
        waveResponse = requests.get(waveUrl, params=waveParams)
        if waveResponse.status_code == 200:
            with open('wave_data.grib2', 'wb') as f:
                f.write(waveResponse.content)
            print("Wave GRIB file saved successfully.")

            grib_data = pygrib.open("wave_data.grib2")

            wave_height, wave_period, wave_direction = None, None, None
            swell_height, swell_period, swell_direction = None, None, None
            swell2_height, swell2_period, swell2_direction = None, None, None
            wind_wave_height, wind_wave_period, wind_wave_direction = None, None, None
            tide_height = None

            for grb in grib_data:
                print(grb.shortName, "-++-++---")
                if grb.shortName == "htsgw":
                    wave_height = np.mean(grb.values)  # meters
                elif grb.shortName == "wvper":
                    wave_period = np.mean(grb.values)  # seconds
                elif grb.shortName == "wvdir":
                    wave_direction = np.mean(grb.values)  # degrees
                elif grb.shortName == "swh":
                    swell_height = np.mean(grb.values)  # meters
                elif grb.shortName == "swper":
                    swell_period = np.mean(grb.values)  # seconds
                elif grb.shortName == "swdir":
                    swell_direction = np.mean(grb.values)  # degrees
                elif grb.shortName == "swh2":
                    swell2_height = np.mean(grb.values)  # meters
                elif grb.shortName == "swper2":
                    swell2_period = np.mean(grb.values)  # seconds
                elif grb.shortName == "swdir2":
                    swell2_direction = np.mean(grb.values)  # degrees
                elif grb.shortName == "wvhgt":
                    wind_wave_height = np.mean(grb.values)  # meters
                elif grb.shortName == "wvper":
                    wind_wave_period = np.mean(grb.values)  # seconds
                elif grb.shortName == "wvdir":
                    wind_wave_direction = np.mean(grb.values)  # degrees
                elif grb.shortName == "tide":
                    tide_height = np.mean(grb.values)  # meters

            wavedata= {
                "wave_height": wave_height,
                "wave_period": wave_period,
                "wave_direction": wave_direction,
                "swell_height": swell_height,
                "swell_period": swell_period,
                "swell_direction": swell_direction,
                "swell2_height": swell2_height,
                "swell2_period": swell2_period,
                "swell2_direction": swell2_direction,
                "wind_wave_height": wind_wave_height,
                "wind_wave_period": wind_wave_period,
                "wind_wave_direction": wind_wave_direction,
                "tide_height": tide_height
            }
        else:
            print("Failed to fetch data.")
            return None
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
        gfsdata= {
                "temperature": average_temperature,
                "wind_speed": wind_speed,
                "wind_gusts": wind_gust,
                "wind_direction": wind_direction,
                "cloud_cover": cloud_cover,
                "precipitation": precipitation
            }
    else:
        return None

    totalData = {**gfsdata,**wavedata}
    return totalData