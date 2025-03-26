import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Empty, InputNumber, Select, Table, Tooltip } from 'antd';
import { useParams } from 'react-router-dom';
import MainLayout from '../../Customs/MainLayout';
import { fetchCityForecast,addCityForecast } from '../../../root-redux/action/cityAction';
import { SyncOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
interface DataType {
  cityName:string;
  id?:number;
  temperature?:number;
  date?:Date;
  city__latitude?:number;
  city__longitude?:number;
  latitude?:number;
  longitude?:number;
}

interface SelectOptionType {
  label: string;
  value: string;
}

const columns = [
  {
    title: 'No',
    key: 'no',
    render: (a: any, b: any, c: any) => c + 1,
  },
  {
    title: 'Time',
    dataIndex: 'date',
    key: 'date',
    render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
  },
  {
    title: 'Temperature (°C)',
    dataIndex: 'temperature',
    key: 'temperature',
  }
];

const App: React.FC = () => {
  const [forecastTime, setForecastTime] = useState<number | null>(1);
  const [forecast, setForecast] = useState<DataType[]>([]);
  const [cityData, setCitydata] = useState<DataType[]>([]);
  const [tmpDate, setTmpDate] = useState<string>(dayjs().utc().format('YYYY-MM-DD'));
  const [initTime, setInitTime] = useState<string>();
  const [options, setOptions] = useState<SelectOptionType[]>([]);
  const { cityId } = useParams<{ cityId: string }>();


  const utcFile = () => {
    const hour = dayjs().utc().hour();
    const minute = dayjs().utc().minute();
    console.log(hour, minute, dayjs().utc().format(),dayjs().utc().format('YYYY-MM-DD'));

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

  const handleChange = ()=>{
    if(!tmpDate || !initTime || !forecastTime){
      window.SM.error("Please input fields","Input Error")
    }else{
      const values = {
        cityId:cityId,
        cityName:`${forecast.length>0?forecast[0].cityName:cityData[0].cityName}`,
        longitude:`${forecast.length>0?forecast[0].city__longitude:cityData[0].longitude}`,
        latitude:`${forecast.length>0?forecast[0].city__longitude:cityData[0].latitude}`,
        date:tmpDate,
        initTime:initTime,
        forecastTime:forecastTime
      }

      console.log(values);
      
      addCityForecast(values)
        .then(res=>{
          window.SM.success("Weather Data has been updated successful", "Weather Update");

        })
        .catch(err=>window.SM.error("Server failed","Server error"))
    }
  }
  // Handle Date Selection

  const onChange = (date: any, dateString: string) => {
    setInitTime("")
    setTmpDate(dateString)
    const currentUtcTime = dayjs().utc().format("YYYY-MM-DD");
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
      fetchCityForecast(cityId, tmpDate)
        .then((data) => {
          if(data[0]?.id){
            const formattedData = data.map((item: any) => ({
              ...item,
              date: dayjs(item.date).format('YYYY-MM-DD HH:mm'),
              key: `${item.cityName}-${item.date}`,
            }));
            setForecast(formattedData);
            window.SM.success("Weather Data has been loaded correctly","Weather Data")
          }else{
            setCitydata(data)
            setForecast([])
          }
        })
        .catch(() => window.SM.error("Server failed", "Server Error"));
    }
  }, [cityId, tmpDate]);

  return (
    <MainLayout>
      <div className='p-4'>
        <div className='mx-auto flex justify-center mb-3'>
          <span className='text-2xl text-blue-400'>{`${forecast.length>0?forecast[0].cityName:(cityData.length>0?cityData[0].cityName:"")}`}</span>
        </div>
        <div className='flex justify-end gap-7 mb-4 mr-[130px]'>
          <DatePicker defaultValue={dayjs().utc()} onChange={onChange} format="YYYY-MM-DD" />
          <Select options={options} value={initTime} style={{ width: "100px" }} onSelect={setInitTime} />
          <InputNumber onChange={e => setForecastTime(e)} value={forecastTime} min={1} max={384} />
          <Tooltip title="Update Weather" placement="top">
            <Button
              type='primary'
              icon={<SyncOutlined rotate={90} />}
              onClick={() => handleChange()}
            />
          </Tooltip>
        </div>
        {forecast.length > 0 ? (
          <Table columns={columns} dataSource={forecast} />
        ) : (
          <Empty />
        )}
      </div>
    </MainLayout>
  );
};

export default App;
