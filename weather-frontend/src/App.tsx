import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CityForecast from "./components/Content/CityForecast";
import CityDashBoard from "./components/Content/CityDashBoard";
import { notification } from "antd";

interface Message {
  success: (msg:string)=>void,
  error: (msg:string)=>void,
  warning: (msg:string)=>void
}
declare global {
  interface Window {
    SM: Message;
  }
}
function App() {
  const [api, contextHolder] = notification.useNotification();

  window.SM = {
    success: (msg: string) => api.success({
      message: 'Notification Title',
      description:`${msg}`,
      showProgress: true,
      pauseOnHover:true,
    }),
    error: (msg: string) => api.error({
      message: 'Notification Title',
      description:`${msg}`,
      showProgress: true,
      pauseOnHover:true,
    }),
    warning: (msg: string) => api.warning({
      message: 'Notification Title',
      description:`${msg}`,
      showProgress: true,
      pauseOnHover:true,
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
