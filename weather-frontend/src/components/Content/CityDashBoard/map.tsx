import { MapContainer, TileLayer, Marker, Popup, useMap,Tooltip } from "react-leaflet";
import { useEffect, useState } from "react";
import { fetchCities } from "../../../root-redux/action/cityAction";
import { Link, useNavigate } from "react-router-dom";
import L from "leaflet";
import css from './index.module.css'
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { EyeIcon, } from "lucide-react";

const customIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

interface City {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
}

interface Target {
    latitude: number;
    longitude: number;
}

const CityMap = () => {
    const [cities, setCities] = useState<City[]>([]);
    const [target, setTarget] = useState<Target>({
        latitude: -37.33333,
        longitude: -59.25
    })
    const navigate = useNavigate();

    function ChangeView({ center }: { center: [number, number] }) {
        const map = useMap();
        map.setView(center, map.getZoom());
        return null;
    }
    useEffect(() => {
        fetchCities()
            .then(res => {
                setCities(res)
            })
            .catch(error => window.SM.success("Not fount cities"))
    }, []);

    return (
        <MapContainer center={[target.latitude, target.longitude]} zoom={9} style={{ height: "calc(100vh - 79px)", width: "100%" }}>
            <ChangeView center={[target.latitude, target.longitude]} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {cities.map((city) => (
                    <Marker
                        key={city.id}
                        position={[city.latitude, city.longitude]}
                        icon={customIcon}
                        eventHandlers={{
                            click: () => setTarget({
                                latitude: city.latitude,
                                longitude: city.longitude
                            }),
                        }}
                    >
                        <Popup className={css.popup}>
                            <strong className="flex justify-center">{city.name}</strong>
                            <div className="flex justify-center mt-1"><Link to={`/forecast/${city.id}`}><EyeIcon size={15} /></Link></div>
                        </Popup>
                    </Marker>
            ))}
        </MapContainer>
    );
};

export default CityMap;
