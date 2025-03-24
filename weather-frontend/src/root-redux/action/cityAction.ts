import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api"; // Django API URL

// Define an interface for the City object
interface City {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
}
interface Forecast {
    timestamp: string;
    temperature: number;
    humidity?: number;
    wind_speed: number;
}

// Function using Promise with proper TypeScript typing
export const fetchCities = (): Promise<City[]> => {
    return new Promise((resolve, reject) => {
        axios.get<City[]>(`${API_BASE_URL}/cities/`)
            .then(response => resolve(response.data))
            .catch(error => reject(error));
    });
};
export const fetchCityForecast = (cityId: number): Promise<Forecast[]> => {
    return new Promise((resolve, reject) => {
        axios.get<Forecast[]>(`${API_BASE_URL}/forecasts/${cityId}/`)
            .then(response => resolve(response.data))
            .catch(error => reject(error));
    });
};
export const fetchTest = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        axios.get<string>(`${API_BASE_URL}/test`)
            .then(response => resolve(response.data))
            .catch(error => reject(error));
    });
};
