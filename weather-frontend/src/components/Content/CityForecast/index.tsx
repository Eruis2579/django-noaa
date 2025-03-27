import React, { useEffect, useState } from 'react';
import { Button, DatePicker, InputNumber, Select, Spin, Tabs, Tooltip } from 'antd';
import { useParams } from 'react-router-dom';
import MainLayout from '../../Customs/MainLayout';
import { fetchCityForecast, addCityForecast } from '../../../root-redux/action/cityAction';
import { AndroidOutlined, AppleOutlined, ArrowUpOutlined, LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import dayjs,{ Dayjs }  from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Forecast from './table';

dayjs.extend(utc);
interface DataType {
  cityName: string;
  id?: number;
  temperature?: number;
  date?: Date;
  city__coast?: boolean;
  coast?: boolean;
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

interface SelectOptionType {
  label: string;
  value: string;
}



const App: React.FC = () => {
  const [forecastTime, setForecastTime] = useState<number | null>(1);
  const [forecast, setForecast] = useState<DataType[]>([]);
  const [cityData, setCitydata] = useState<DataType[]>([]);
  const [tmpDate, setTmpDate] = useState<string|string[]>(dayjs().utc().format('YYYY-MM-DD'));
  const [initTime, setInitTime] = useState<string>();
  const [wave, setWave] = useState(false);
  const [options, setOptions] = useState<SelectOptionType[]>([]);
  const { cityId } = useParams<{ cityId: string }>();
  const [loading, setLoading] = useState(false)


  const spin = (degree: number) => {
    return (
      <>
        <ArrowUpOutlined rotate={degree} />
      </>
    )
  }
  const columns = [
    {
      title: 'No',
      key: 'no',
      width: 50,
      render: (a:any,b:any,c: any) =>{
        console.log(a,b);
        return c+1
        
      },
    },
    {
      title: 'Time',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Wind speed (knots)',
      dataIndex: 'wind_speed',
      key: 'wind_speed',
      width: 250,
      render: (text: number) => <>{Math.round(text)}</>
    },
    {
      title: 'Wind gusts (knots)',
      dataIndex: 'wind_gusts',
      key: 'wind_gusts',
      width: 250,
      render: (text: number) => <>{Math.round(text)}</>
    },
    {
      title: 'Wind direction (→)',
      dataIndex: 'wind_direction',
      key: 'wind_direction',
      width: 250,
      render: (text: number) => <>{spin(text)}</>
    },
    {
      title: 'Temperature (°C)',
      dataIndex: 'temperature',
      key: 'temperature',
      width: 250,
      render: (text: number) => <>{Math.round(text * 10) / 10}</>
    },
    {
      title: 'Cloud cover (%)',
      dataIndex: 'cloud_cover',
      key: 'cloud_cover',
      width: 250,
      render: (text: number) => <>{Math.round(text)}</>
    },
    {
      title: '*Precip. (mm/1h)',
      dataIndex: 'precipitation',
      key: 'precipitation',
      width: 250,
      render: (text: number) => <>{Math.round(text * 100) / 100}</>
    },
  ];
  const wavecolumns = [
    {
      title: 'No',
      key: 'no',
      width: 50,
      render: (a:any,b:any,c: any) =>{
        console.log(a,b);
        return c+1
        
      },
    },
    {
      title: 'Time',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Wave (m)',
      dataIndex: 'wave_height',
      key: 'wave_height',
      width: 100,
      render: (text: number) => <>{Math.round(text * 10) / 10}</>
    },
    {
      title: '*Wave period (s)',
      dataIndex: 'wave_period',
      key: 'wave_period',
      width: 150,
      render: (text: number) => <>{Math.round(text * 10) / 10}</>
    },
    {
      title: 'Wave direction (→)',
      dataIndex: 'wave_direction',
      key: 'wave_direction',
      width: 150,
      render: (text: number) => <>{spin(text)}</>
    },
    {
      title: 'Swell Height (m)',
      dataIndex: 'swell_height',
      key: 'swell_height',
      width: 150,
      render: (text: number) => <>{Math.round(text * 100) / 100}</>
    },
    {
      title: 'Swell Period (s)',
      dataIndex: 'swell_period',
      key: 'swell_period',
      width: 150,
      render: (text: number) => <>{Math.round(text * 10) / 10}</>
    },
    {
      title: 'Swell Direction (→)',
      dataIndex: 'swell_direction',
      key: 'swell_direction',
      width: 150,
      render: (text: number) => <>{spin(text)}</>
    },
    {
      title: '2.Swell Height (m)',
      dataIndex: 'swell2_height',
      key: 'swell2_height',
      width: 150,
      render: (text: number) => <>{Math.round(text * 100) / 100}</>
    },
    {
      title: '2.Swell Period (s)',
      dataIndex: 'swell2_period',
      key: 'swell2_period',
      width: 150,
      render: (text: number) => <>{Math.round(text * 10) / 10}</>
    },
    {
      title: '2.Swell Direction (→)',
      dataIndex: 'swell2_direction',
      key: 'swell2_direction',
      width: 150,
      render: (text: number) => <>{spin(text)}</>
    },
    {
      title: 'Wind Wave Height (m)',
      dataIndex: 'wind_wave_height',
      key: 'wind_wave_height',
      width: 180,
      render: (text: number) => <>{Math.round(text * 10) / 10}</>
    },
    {
      title: 'Wind Wave Period (s)',
      dataIndex: 'wind_wave_period',
      key: 'wind_wave_period',
      width: 180,
      render: (text: number) => <>{Math.round(text * 10) / 10}</>
    },
    {
      title: 'Wind Wave Direction (→)',
      dataIndex: 'wind_wave_direction',
      key: 'wind_wave_direction',
      width: 180,
      render: (text: number) => <>{spin(text)}</>
    },
    {
      title: 'Wind_speed (knots)',
      dataIndex: 'wind_speed2',
      key: 'wind_speed2',
      width: 150,
      render: (text: number) => <>{Math.round(text)}</>
    },
    {
      title: 'Wind_direction (→)',
      dataIndex: 'wind_direction2',
      key: 'wind_direction2',
      width: 150,
      render: (text: number) => <>{spin(text)}</>
    }
  ]



  const getForecasts = (cityId: any, tmpDate: any) => {
    setLoading(true);
    fetchCityForecast(cityId, tmpDate)
      .then((data) => {
        if (data[0]?.id) {
          const formattedData = data.map((item: any) => ({
            ...item,
            date: dayjs(item.date).format('YYYY-MM-DD HH:mm'),
            key: `${item.cityName}-${item.date}`,
          }));
          setForecast(formattedData);
          if (data[0]?.city__coast) {
            setWave(true);
          } else {
            setWave(false)
          }
        } else {
          setCitydata(data)
          setForecast([]);
          if (data[0]?.coast) {
            setWave(true);
          } else {
            setWave(false)
          }
        }
        setLoading(false);
      })
      .catch(() => {
        window.SM.error("El servidor ha fallado.", "Error del servidor")
        setForecast([]);
        setLoading(false)
      });
  }
  const utcFile = () => {
    const hour = dayjs().utc().hour();
    const minute = dayjs().utc().minute();
    console.log(hour, minute, dayjs().utc().format(), dayjs().utc().format('YYYY-MM-DD'));

    if (hour === 0 && minute === 0) {
      setOptions([]);
    } else if ((hour === 0 && minute > 0) || (hour > 0 && hour < 6) || (hour === 6 && minute === 0)) {
      setOptions(["00"].map(item => ({
        value: item,
        label: `${item}z`
      })));
    } else if (hour < 12 || (hour === 12 && minute === 0)) {
      setOptions(["00", "06"].map(item => ({
        value: item,
        label: `${item}z`
      })));
    } else if (hour < 18 || (hour === 18 && minute === 0)) {
      setOptions(["00", "06", "12"].map(item => ({
        value: item,
        label: `${item}z`
      })));
    } else if (hour < 24) {
      setOptions(["00", "06", "12", "18"].map(item => ({
        value: item,
        label: `${item}z`
      })));
    }
  }

  const handleChange = () => {
    if (!tmpDate || !initTime || !forecastTime) {
      window.SM.error("Campos de entrada", "Error de entrada")
    } else {
      setLoading(true)
      const values = {
        cityId: cityId,
        cityName: `${forecast.length > 0 ? forecast[0].cityName : cityData[0].cityName}`,
        coast: `${forecast.length > 0 ? forecast[0]?.city__coast : cityData[0]?.coast}`,
        longitude: `${forecast.length > 0 ? forecast[0].city__longitude : cityData[0].longitude}`,
        latitude: `${forecast.length > 0 ? forecast[0].city__latitude : cityData[0].latitude}`,
        date: tmpDate,
        initTime: initTime,
        forecastTime: forecastTime
      }

      console.log(values);

      addCityForecast(values)
        .then(() => {
          window.SM.success("Los datos meteorológicos se han actualizado correctamente", "Novedades meteorológicas");
          getForecasts(cityId, tmpDate)
          setLoading(false)
        })
        .catch(()=> window.SM.error("El servidor ha fallado.", "Error del servidor"))
    }
  }
  // Handle Date Selection

  const onChange = (date: Dayjs | null, dateString: string|string[]) => {
    console.log(date);
    
    setInitTime("")
    setTmpDate(dateString)
    const currentUtcTime = dayjs().utc().format("YYYY-MM-DD");
    if(Array.isArray(dateString))
      return;
    if (dayjs(dateString).isBefore(dayjs(currentUtcTime))) {
      // Past date: Allow all time options
      setOptions(["00", "06", "12", "18"].map(item => ({
        value: item,
        label: `${item}z`
      })));
    } else if (dayjs(dateString).isSame(dayjs(currentUtcTime))) {
      utcFile();
    } else {
      setOptions([])
    }
  };

  useEffect(() => {
    utcFile()
  }, [])
  // Fetch Weather Data when cityId or date changes
  useEffect(() => {
    if (cityId) {
      getForecasts(cityId, tmpDate);
    }
  }, [cityId, tmpDate]);

  return (
    <MainLayout>
      <div className='p-4'>
        <Spin indicator={<LoadingOutlined spin />} spinning={loading}>
          <div className='mx-auto flex justify-center mb-3'>
            <span className='text-2xl text-blue-400'>{`${forecast.length > 0 ? forecast[0].cityName : (cityData.length > 0 ? cityData[0].cityName : "")}`}</span>
          </div>
          <div className='flex justify-end gap-7 mb-4 mr-[130px]'>
            {/* <DatePicker defaultValue={dayjs().utc()} onChange={(x,y)=>onChange(y)} format="YYYY-MM-DD" /> */}
            <DatePicker defaultValue={dayjs().utc()} onChange={(date, dateString) => onChange(date,dateString)} format="YYYY-MM-DD" />
            <Select options={options} value={initTime} style={{ width: "100px" }} onSelect={setInitTime} />
            <InputNumber onChange={e => setForecastTime(e)} value={forecastTime} min={1} max={384} />
            <Tooltip title="Novedades meteorológicas" placement="top">
              <Button
                disabled={loading}
                type='primary'
                icon={<SyncOutlined rotate={90} />}
                onClick={() => handleChange()}
              />
            </Tooltip>
          </div>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: "GFS 13km",
                children: <Forecast columns={columns} forecast={forecast} props={{ scroll: { x: 1800 } }} />,
                icon: <AndroidOutlined />
              },
              ...(wave ? [
                {
                  key: "2",
                  label: "GFS-WAVE 25km",
                  children: <Forecast columns={wavecolumns} forecast={forecast} props={{ scroll: { x: 2380 } }} />,
                  icon: <AppleOutlined />
                }
              ] : [])
            ]}
          />
        </Spin>
      </div>
    </MainLayout>
  );
};

export default App;
