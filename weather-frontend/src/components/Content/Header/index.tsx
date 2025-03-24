import { CloudSun } from 'lucide-react';
import { Menus } from './Menus';
import { Link } from 'react-router';

interface Props {
  title?: string;
  selectedMenuKey?: any;
}
const Header: React.FC<Props> = ({
  title = "Argentina Forecast Weather",
  selectedMenuKey = 'all',
}) => {

  return (
    <>
      <div className="min-h-[40px] border-b-3">
        <div className="container mx-auto px-4 pt-5 ">
          <div className="flex justify-between items-center pb-5">
            <Link to={'/'}>
              <div className='flex gap-3'>
                <CloudSun className="text-blue-500" size={32} />
                <h3 className="text-3xl font-bold text-gray-800">
                  {title}
                </h3>
              </div>
            </Link>
            <Menus
              selectedMenuKey={selectedMenuKey}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
