import React, { useEffect, useState } from "react";
import { AlignJustify, Building2 } from "lucide-react";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import { fetchCities } from "../../../root-redux/action/cityAction";
import { Link } from "react-router";

interface CitySelectorProps {
  selectedMenuKey: any;
}

interface City {
  id: number;
  cityName: string;
  latitude: number;
  longitude: number;
  coast:boolean;
}

export const Menus: React.FC<CitySelectorProps> = () => {
  const [menuItems, setMenuItems] = useState<City[]>([]);

  useEffect(() => {
    fetchCities()
      .then(setMenuItems)
      .catch(err=>{console.log(err);
      });
  }, []);

  const items: MenuProps["items"] = menuItems.map((city) => ({
    key: city.id.toString(), 
    label: (
      <Link to={`/forecast/${city.id}`}>
        <div className={`${city.coast?"text-blue-500":"text-brown-500"} flex items-center gap-3`}><Building2 size={12} strokeWidth={1.5} absoluteStrokeWidth />{city.cityName}</div>
      </Link>
    ),
  }));

  return (
      <Dropdown menu={{ items }} placement="bottomLeft">
        <AlignJustify className="text-blue-500 cursor-pointer" size={32} />
      </Dropdown>
  );
};
