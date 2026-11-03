import {BrowserRouter,Routes,Route} from 'react-router-dom'
import  Booking from './pages/Booking'
import Home from './pages/Home'
import AdminDashboard from './AdminDashboard'
function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/Booking" element={<Booking />}/>
      <Route path="/AdminDashboard" element={<AdminDashboard/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
