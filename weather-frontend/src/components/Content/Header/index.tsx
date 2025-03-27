import { CloudSun } from 'lucide-react';
import { Menus } from './Menus';
import { Link } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';

interface Props {
  title?: string;
  selectedMenuKey?: any;
}
const Header: React.FC<Props> = ({
  title = "Pronóstico del tiempo en Argentina",
  selectedMenuKey = 'all',
}) => {
  const times = useRef<NodeJS.Timeout | null>(null);
  const [time, setTime] = useState(dayjs().utc().format("YYYY-MM-DD HH:mm:ss"))
  useEffect(() => {

    times.current = setInterval(() => {
      setTime(dayjs().utc().format("YYYY-MM-DD HH:mm:ss"))
    }, 1000);
    return () => {
      if (times.current) clearInterval(times.current);
    }
  }, [])
  return (
    <>
      <div className="min-h-[40px] border-b-3">
        <div className="container mx-auto px-4 pt-5 ">
          <div className="flex justify-between items-center pb-5">
            <Link to={'/'}>
              <div className='flex gap-3'>
                <CloudSun className="text-blue-500" size={32} />
                <h3 className="text-3xl font-bold text-blue-500">
                  {title}
                </h3>

              </div>
            </Link>
            <div className='flex gap-10 items-center'>
              <h4 className="text-1xl font-bold text-blue-500">
                {time}
              </h4>
              <Menus
                selectedMenuKey={selectedMenuKey}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
