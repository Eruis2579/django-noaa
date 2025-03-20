import {BrowserRouter as Router, Routes,Route} from 'react-router-dom';
import CitiesList from "./components/CitiesList";
import CityForecast from "./components/CityForecast";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<CitiesList />} />
          <Route path="/forecast/:cityId" element={<CityForecast />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
