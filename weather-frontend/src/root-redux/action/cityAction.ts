import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api"; // Django API URL

// Define an interface for the City object
interface City {
    id: number;
    cityName: string;
    latitude: number;
    longitude: number;
}
interface DataType {
    cityName:string;
    date:Date;
    temperature:number;
  }
// Function using Promise with proper TypeScript typing
export const fetchCities = (): Promise<City[]> => {
    return new Promise((resolve, reject) => {
        axios.get<City[]>(`${API_BASE_URL}/city/`)
            .then(response => resolve(response.data))
            .catch(error => reject(error));
    });
};
export const fetchCityForecast = (cityId: string, tmpDate:string): Promise<DataType[]> => {
    return new Promise((resolve, reject) => {
        axios.get<DataType[]>(`${API_BASE_URL}/weather/`, {
            params:{
                city:cityId,
                date:tmpDate
            }
        })
            .then(response => resolve(response.data))
            .catch(error => reject(error));
    });
};
export const addCity = (values:any): Promise<string> => {
    return new Promise((resolve, reject) => {
        axios.post<string>(`${API_BASE_URL}/city_post/`,{...values})
            .then(response => resolve("ok"))
            .catch(error => reject(error));
    });
};
