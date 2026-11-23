import {BrowserRouter,Routes,Route} from 'react-router-dom'
import  Booking from './pages/Booking'
import Home from './pages/Home'
import AdminDashboard from './AdminDashboard'
import AdminBookings from './pages/AdminBookings'
import AdminMechanics from './pages/AdminMechanics'
import MechanicDashboard from './pages/MechanicDashboard'
import Register from './Register'
import Login from './Login'
import CustomerDashboard from'./CustomerDashboard'
import AdminCustomer from './pages/AdminCustomer'
import VehicleManagement from './VehicleManagement'
import AdminComplaints from './pages/AdminComplaints'
import AdminReport from './pages/AdminReport'
function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/Booking" element={<Booking />}/>
      <Route path="/AdminDashboard" element={<AdminDashboard/>}/>
      <Route path="/AdminDashboard/AdminBookings" element={<AdminBookings />} />
      <Route path="/AdminMechanics" element={<AdminMechanics/>}/>
      <Route path="/MechanicDashboard" element={<MechanicDashboard/>}/>
      <Route path="/Register" element={<Register />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/CustomerDashboard" element ={<CustomerDashboard />}/>
      <Route path="/AdminCustomer" element ={<AdminCustomer />} />
      <Route path="/VehicleManagement" element ={<VehicleManagement />} />
      <Route path="/AdminComplaints" element ={<AdminComplaints />} />
      <Route path="/AdminReport" element={<AdminReport />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
