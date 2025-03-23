import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCityForecast } from "../../../root-redux/action/cityAction";

interface Forecast {
  timestamp: string;
  temperature: number;
  humidity?: number;
  wind_speed: number;
}

const CityForecast = () => {
  const { cityId } = useParams<{ cityId: string }>();
  const [forecast, setForecast] = useState<Forecast[]>([]);

  useEffect(() => {
    if (cityId) {
      fetchCityForecast(parseInt(cityId))
        .then(setForecast)
        .catch(console.log)
    }
  }, [cityId]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Weather Forecast</h1>
      {forecast.length > 0 ? (
        <ul>
          {forecast.map((f, index) => (
            <li key={index} className="mb-2">
              <strong>{new Date(f.timestamp).toLocaleString()}:</strong> {f.temperature}°C,
              Humidity: {f.humidity}%, Wind: {f.wind_speed} km/h
            </li>
          ))}
        </ul>
      ) : (
        <p>No forecast data available.</p>
      )}
    </div>
  );
};

export default CityForecast;
