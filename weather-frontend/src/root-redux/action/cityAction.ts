import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api"; // Django API URL

// Define an interface for the City object
interface City {
    id: number;
    cityName: string;
    latitude: number;
    longitude: number;
    coast:boolean;
}
interface DataType {
    cityName: string;
    id?: number;
    temperature?: number;
    coast?:boolean;
    date?: Date;
    city__latitude?: number;
    city__longitude?: number;
    city__coast?:boolean
    latitude?: number;
    longitude?: number;
    wind_speed?:number;
    wind_gusts?:number;
    wind_direction?:number;
    cloud_cover?:number;
    precipitation?:number;
  }
// Function using Promise with proper TypeScript typing
export const fetchCities = (): Promise<City[]> => {
    return new Promise((resolve, reject) => {
        axios.get<City[]>(`${API_BASE_URL}/city/`)
            .then(response => resolve(response.data))
            .catch(error => reject(error));
    });
};
export const deleteCity = (values:any): Promise<string> => {
    return new Promise((resolve, reject) => {
        axios.post<string>(`${API_BASE_URL}/deleteCity/`,{cityId:values})
            .then(response => resolve(response.data))
            .catch(error => reject(error));
    });
};
export const addCity = (values:any): Promise<string> => {
    return new Promise((resolve, reject) => {
        axios.post<string>(`${API_BASE_URL}/city_post/`,{
            ...values,
            coast:values.coast?values.coast:false
        })
            .then(() => resolve("ok"))
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
export const addCityForecast = (values:any): Promise<string> => {
    return new Promise((resolve, reject) => {
        axios.post<string>(`${API_BASE_URL}/weather_post/`, {
            ...values
        })
            .then(response => resolve(response.data))
            .catch(error => reject(error));
    });
};
