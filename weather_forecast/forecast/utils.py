import requests
import pygrib
import numpy as np

def fetch_weather_data(latitude, longitude, forecast_time, dir_date, file_time, coast):
    url = "https://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_0p25_1hr.pl"
    waveUrl = "https://nomads.ncep.noaa.gov/cgi-bin/filter_gfswave.pl"

    file = f"gfs.t{file_time}z.pgrb2.0p25.f{forecast_time}"
    waveFile = f"gfswave.t{file_time}z.arctic.9km.f{forecast_time}.grib2"

    dir = f"/gfs.{dir_date}/{file_time}/atmos"
    waveDir = f"/gfs.{dir_date}/{file_time}/wave/gridded"

    params = {
        "file": file,
        "lev_10_m_above_ground": "on",
        "lev_2_m_above_ground": "on",
        "lev_surface": "on",
        "subregion": "",
        "var_TMP": "on",
        "var_UGRD": "on",
        "var_VGRD": "on",
        "var_GUST": "on",
        "var_TCDC": "on",
        "var_PRATE": "on",
        "dir": dir,
        "leftlon": longitude - 0.25,
        "rightlon": longitude + 0.25,
        "toplat": latitude + 0.25,
        "bottomlat": latitude - 0.25
    }

    waveParams = {
        "file": waveFile,
        "var_HTSGW": "on",#wave height
        "var_PERPW": "on",#wave period
        "var_DIRPW":"on",#wave direction
        "var_SWELL": "on",
        "var_SWPER": "on",
        "var_SWDIR": "on",
        "var_WVHGT": "on",
        "var_WVPER": "on",
        "var_WVDIR": "on",
        "var_WIND": "on",
        "var_WDIR": "on",
        "all_lev": "on",
        "subregion": "",
        "dir": waveDir,  # Corrected directory
        "leftlon": longitude - 0.25,
        "rightlon": longitude + 0.25,
        "toplat": latitude + 0.25,
        "bottomlat": latitude - 0.25
    }

    totalData, gfsdata, wavedata = {}, {}, {}

    # Fetch GFS Data
    response = requests.get(url, params=params)
    if response.status_code == 200:
        with open('grib_file.grib', 'wb') as f:
            f.write(response.content)
        print("GRIB file saved successfully.")

        grib_data = pygrib.open("grib_file.grib")

        temperature, wind_speed, wind_gust, wind_direction = None, None, None, None
        cloud_cover, precipitation, u_wind, v_wind = None, None, None, None

        for grb in grib_data:
            print(grb.shortName, "-----")  # Debugging
            if grb.shortName == '2t':
                temperature_celsius = grb.values - 273.15
                temperature = np.mean(temperature_celsius)
            elif grb.shortName == "10u":
                u_wind = np.mean(grb.values)
            elif grb.shortName == "10v":
                v_wind = np.mean(grb.values)
            elif grb.shortName == "gust":
                wind_gust = np.mean(grb.values * 1.94384)
            elif grb.shortName == "tcdc":
                cloud_cover = np.mean(grb.values)
            elif grb.shortName == "prate":
                precipitation = np.mean(grb.values * 3600)

        if u_wind is not None and v_wind is not None:
            wind_speed = np.sqrt(u_wind**2 + v_wind**2) * 1.94384
            wind_direction = (np.arctan2(v_wind, u_wind) * 180 / np.pi) % 360

        gfsdata = {
            "temperature": temperature,
            "wind_speed": wind_speed,
            "wind_gusts": wind_gust,
            "wind_direction": wind_direction,
            "cloud_cover": cloud_cover,
            "precipitation": precipitation
        }
    else:
        print("error gfsdata")
        return None
    # Fetch Wave Data if Coastline Data is Needed
    print("coast", coast)
    if coast:
        print("coast", coast)
        print("waveUrl", waveUrl)
        print("waveFile", waveFile)
        print("waveDir", waveDir)
        waveResponse = requests.get(waveUrl, params=waveParams)
        if waveResponse.status_code == 200:
            with open('wave_data.grib2', 'wb') as f:
                f.write(waveResponse.content)
            print("Wave GRIB file saved successfully.")

            grib_data = pygrib.open("wave_data.grib2")

            wave_height, wave_period, wave_direction = None, None, None
            swell_height, swell_period, swell_direction = None, None, None
            swell2_height, swell2_period, swell2_direction = None, None, None
            swell3_height, swell3_period, swell3_direction = None, None, None
            wind_wave_height, wind_wave_period, wind_wave_direction = None, None, None
            wind_direction2,wind_speed2 = None, None 

            for grb in grib_data:
                print(grb.shortName, "-++-++---")  # Debugging
                if grb.shortName == "swh":
                    wave_height = np.mean(grb.values)
                elif grb.shortName == "perpw":
                    wave_period = np.mean(grb.values)
                elif grb.shortName == "dirpw":
                    wave_direction = np.mean(grb.values)
                elif grb.shortName == "shts":
                    if swell_height is not None and swell2_height is not None:
                        swell3_height = np.mean(grb.values)
                    elif swell_height is not None and swell2_height is None:
                        swell2_height = np.mean(grb.values)
                    else:
                        swell_height = np.mean(grb.values)
                elif grb.shortName == "mpts":
                    if swell_period is not None and swell2_period is not None:
                        swell3_period = np.mean(grb.values)
                    elif swell_period is not None and swell2_period is None:
                        swell2_period = np.mean(grb.values)
                    else:
                        swell_period = np.mean(grb.values)
                elif grb.shortName == "swdir":
                    if swell_direction is not None and swell2_direction is not None:
                        swell3_direction = np.mean(grb.values)
                    elif swell_direction is not None and swell2_direction is None:
                        swell2_direction = np.mean(grb.values)
                    else:
                        swell_direction = np.mean(grb.values)
                elif grb.shortName == "shww":
                    wind_wave_height = np.mean(grb.values)
                elif grb.shortName == "mpww":
                    wind_wave_period = np.mean(grb.values)
                elif grb.shortName == "wvdir":
                    wind_wave_direction = np.mean(grb.values)
                elif grb.shortName == "wdir":
                    wind_direction2 = np.mean(grb.values)
                elif grb.shortName == "ws":
                    wind_speed2 = np.mean(grb.values)*1.94384

            wavedata = {
                "wave_height": wave_height-swell_height,
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
                "wind_speed2":wind_speed2,
                "wind_direction2":wind_direction2
            }
        else:
            print("error wavedata")
            return None
    # Combine Data
    totalData = {**gfsdata, **wavedata}
    return totalData if totalData else None
