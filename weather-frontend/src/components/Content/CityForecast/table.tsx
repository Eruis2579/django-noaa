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
  }

interface Props {
    columns: any;
    forecast: DataType[];
}
const App: React.FC<Props> = ({ columns, forecast}) => {
    return (
        <>
            {forecast.length > 0 ? (
                <Table columns={columns} dataSource={forecast} />
            ) : (
                <Empty />
            )}
        </>
    );
};

export default App;
