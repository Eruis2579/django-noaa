import { Empty, Table } from "antd";


interface DataType {
    cityName: string;
    id?: number;
    temperature?: number;
    date?: Date;
    city__latitude?: number;
    city__longitude?: number;
    latitude?: number;
    longitude?: number;
    wind_speed?: number;
    wind_gusts?: number;
    wind_direction?: number;
    cloud_cover?: number;
    precipitation?: number;
    wave?: number;
    wave_period?: number;
    wave_direction?: number;
    swell_height?: number;
    swell_period?: number;
    swell_direction?: number;
    swell2_height?: number;
    swell2_period?: number;
    swell2_direction?: number;
    wind_wave_height?: number;
    wind_wave_period?: number;
    wind_wave_direction?: number;
    wind_speed2?: number;
    wind_direction2?: number;
}

interface Props {
    columns: any;
    forecast: DataType[];
    props: any;
}
const App: React.FC<Props> = ({ columns, forecast, props }) => {
    return (
        <>
            {forecast.length > 0 ? (
                <Table
                    columns={columns}
                    dataSource={forecast}
                    bordered
                    size="small"
                    pagination={false}
                    {...props}
                />
            ) : (
                <Empty description={"Sin datos"} />
            )}
        </>
    );
};

export default App;
