import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { fetchCities } from "../../../root-redux/action/cityAction";
import { Link, useNavigate } from "react-router-dom";
import L from "leaflet";
import css from './index.module.css'
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { EyeIcon } from "lucide-react";
import { FloatButton, Modal } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import type { TooltipProps } from 'antd';
import { Tooltip } from "antd";

const customIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

interface City {
    id: number;
    cityName: string;
    latitude: number;
    longitude: number;
}

interface Target {
    latitude: number;
    longitude: number;
}

const CityMap = () => {
    const [cities, setCities] = useState<City[]>([]);
    const [openModal, setOpenModal] = useState(false)
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
                window.SM.success("The city data has been loaded correctly.", "City data Load")
            })
            .catch(error => window.SM.error("The city data hasn't been loaded correctly.", "City data Load"))
    }, []);

    return (
        <>
            <Tooltip placement="top" title="ADD CITY"><FloatButton type="primary" icon={<PlusOutlined />} onClick={() => setOpenModal(true)} /></Tooltip>
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
                            <strong className="flex justify-center">{city.cityName}</strong>
                            <div className="flex justify-center mt-1"><Link to={`/forecast/${city.id}`}><EyeIcon size={15} /></Link></div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            <Modal
                title="Modal"
                open={openModal}
                onOk={()=>setOpenModal(false)}
                onCancel={()=>setOpenModal(false)}
                okText="确认"
                cancelText="取消"
            >
                <p>Bla bla ...</p>
                <p>Bla bla ...</p>
                <p>Bla bla ...</p>
            </Modal>
        </>
    );
};

export default CityMap;
