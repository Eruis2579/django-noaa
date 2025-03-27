import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState} from "react";
import { fetchCities, addCity} from "../../../root-redux/action/cityAction";
import { Link } from "react-router-dom";
import L from "leaflet";
import css from './index.module.css'
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { EyeIcon} from "lucide-react";
import { Button, Checkbox, Col, FloatButton, Form, Input, InputNumber, Modal, Row, Tooltip } from "antd";
import { PlusOutlined } from '@ant-design/icons';


// const ReachableContext = createContext<string | null>(null);
// const UnreachableContext = createContext<string | null>(null);
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
    coast:boolean;
}

interface Target {
    latitude: number;
    longitude: number;
}
// const config = {
//     title: 'Use Hook!',
//     content: (
//       <>
//         <ReachableContext.Consumer>{(name) => `Reachable: ${name}!`}</ReachableContext.Consumer>
//         <br />
//         <UnreachableContext.Consumer>{(name) => `Unreachable: ${name}!`}</UnreachableContext.Consumer>
//       </>
//     ),
//   };
const CityMap = () => {
    const [cities, setCities] = useState<City[]>([]);
    const [openModal, setOpenModal] = useState(false)
    const [target, setTarget] = useState<Target>({
        latitude: -37.33333,
        longitude: -59.25
    })
    const getCities = ()=>{
        fetchCities()
            .then(res => {
                setCities(res)
            })
            .catch(error => {
                window.SM.error("El servidor ha fallado.", "Error del servidor")
                console.log(error);
                
            })
    }
    function ChangeView({ center }: { center: [number, number] }) {
        const map = useMap();
        map.setView(center, map.getZoom());
        return null;
    }
    const onFinish = (values:any) =>{
        console.log(values);
        
        addCity(values)
            .then(()=>{
                window.SM.success("La ciudad se ha añadido correctamente.","AÑADIR CIUDAD")
                setOpenModal(false)
                getCities();
            })
            .catch(()=>window.SM.success("El servidor ha fallado.", "Error del servidor"))
    }
    // const handleDelete = (values:any) =>{
    //     Modal.confirm ({
    //         title: "Delete City",
    //         content: "Are you sure you want to delete this city?",
    //         okText: "Yes",
    //         cancelText: "No",
    //         onOk: () => {
    //             deleteCity(values)
    //                 .then(() => window.SM.success("City has been deleted successfully", "Delete"))
    //                 .catch(() => window.SM.error("Server Failed", "Error"));
    //         },
    //     });
    //     console.log("Asd");
        
    // }
    
    useEffect(() => {
        getCities()
    }, []);

    return (
        <>
            <Tooltip placement="top" title="Añadir una ciudad"><FloatButton type="primary" icon={<PlusOutlined />} onClick={() => setOpenModal(true)} /></Tooltip>
            <MapContainer center={[target.latitude, target.longitude]} zoom={8} style={{ height: "calc(100vh - 79px)", width: "100%" }}>
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
                            <div className="flex justify-center mt-1 gap-3">
                                <Link to={`/forecast/${city.id}`}><EyeIcon size={15} /></Link>
                                {/* <div onClick={()=>handleDelete(city.id)} className="hover:cursor-pointer"><TrashIcon size={15} color="red" /></div> */}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            <Modal
                width={900}
                title="añada una ciudad"
                open={openModal}
                footer={false}
                onClose={() => setOpenModal(false)}
                destroyOnClose
                onCancel={()=>setOpenModal(false)}
            >
                <Form
                    onFinish={onFinish}
                >
                    <Form.Item
                        name={"cityName"}
                        label="Nombre de la ciudad"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Row justify={"space-between"}>
                        <Col span={9}>
                            <Form.Item
                                name={"latitude"}
                                label="latitud"
                                rules={[{ required: true }]}
                            >
                                <InputNumber style={{width:"100%"}} />
                            </Form.Item>
                        </Col>
                        <Col span={9}>
                            <Form.Item
                                name={"longitude"}
                                label="longitud"
                                rules={[{ required: true }]}
                            >
                                <InputNumber style={{width:"100%"}} />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item
                                label="Ciudad costera"
                                valuePropName="checked"
                                name={"coast"}
                            >
                                <Checkbox  />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div className="flex gap-3 justify-end">
                        <Button style={{ width: "120px" }} htmlType="submit" type="primary">Ok</Button>
                        <Button style={{ width: "120px" }} onClick={()=>setOpenModal(false)} >Cancelar</Button>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default CityMap;
