import { useEffect, useState } from "react";
import { fetchCities } from "../../root-redux/action/cityAction";
import { useNavigate } from "react-router-dom";

interface City {
  id: number;
  name: string;
}

const CitiesList = () => {
  const [cities, setCities] = useState<City[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCities().then(setCities);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Cities</h1>
      <ul>
        {cities.map((city) => (
          <li
            key={city.id}
            className="cursor-pointer text-blue-600 hover:underline"
            onClick={() => navigate(`/forecast/${city.id}`)}
          >
            {city.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CitiesList;
