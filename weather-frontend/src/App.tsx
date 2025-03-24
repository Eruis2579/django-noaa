import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CityForecast from "./components/Content/CityForecast";
import CityDashBoard from "./components/Content/CityDashBoard";
import { notification } from "antd";

interface Message {
  success: (msg:string,title:string)=>void,
  error: (msg:string,title:string)=>void,
  warning: (msg:string,title:string)=>void
}
declare global {
  interface Window {
    SM: Message;
  }
}
function App() {
  const [api, contextHolder] = notification.useNotification();

  window.SM = {
    success: (msg: string,title:string) => api.success({
      message: `${title}`,
      description:`${msg}`,
      showProgress: true,
      pauseOnHover:false,
      duration:1.5
    }),
    error: (msg: string,title:string) => api.error({
      message: `${title}`,
      description:`${msg}`,
      showProgress: true,
      pauseOnHover:false,
      duration:1.5
    }),
    warning: (msg: string,title:string) => api.warning({
      message: `${title}`,
      description:`${msg}`,
      showProgress: true,
      pauseOnHover:false,
      duration:1.5
    }),
  }
  return (
    <>
    {contextHolder}
      <Router>
        <Routes>
          <Route path="/" element={<CityDashBoard />} />
          <Route path="/forecast/:cityId" element={<CityForecast />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
