import { useLocation } from "react-router-dom"
import { useState } from "react"
function Booking() {
  const location = useLocation();
  const selectedService = location.state?.service ||"" 
  const [customerName,setCustomerName] = useState("");
  const [phonenumber,setPhoneNumber] = useState("");
  const [vehicletype,setVehicleType] = useState("");
  const [currentlocation,setCurrentLocation] = useState("")
  const [service,setService] = useState("")
  const handleSubmit = async(e) =>{
   e.preventDefault();
   const bookingData ={
    customerName : customerName,
    phoneNo :phonenumber,
    vehicle :vehicletype,
    Location :currentlocation,
    service :service
   }
    //alert `customer:${customerName},
    //phoneNo:${phonenumber},
    //vehicle:${vehicletype},
    //Location:${currentlocation},
    //service:${selectedService}`
    try {
      const response = await fetch("http://localhost:3001/booking",{
        method :"POST",
        headers :{
        "Content-Type":"application/json"
        },
       body :JSON.stringify(bookingData)
      });
      const result =await response.json();
      console.log("Backend response:", response.status, result);
      if(response.ok){
       alert("sucess :" + result.message) 
      }
      else
        {
       alert("Error ("+ response.status +"):" +result.message)
        }
    
    }
    catch(error){
      console.error("Booking error:", error)
      alert("Unable to submit booking. Plz check your backend")
    }
  }
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-lg shadow-blue-200/100">
        <h1 className="text-3xl font-bold text-blue-700">
          Book Roadside Assistance
        </h1>

        <p className="mt-3 text-gray-600">
          Tell us what help you need for your vehicle.
        </p>
        <p className="mt-4 font-semibold text-gray-800">
          Selected service:{selectedService || "Plz select a service"}
        </p>
        <form className=" mt-6 space-y-4 "  onSubmit={handleSubmit}>
          <div>
         <label className="block font-medium text-gray-700 ">Customer Name:</label>
         <input
          type="text"
             placeholder="Plz enter your  name"
             value={customerName}
             onChange={(e)=>setCustomerName(e.target.value)}
             className="rounded-lg border border-2 w-full p-3 mt-1 "/>
          </div>
          <div>
            <label className="block font-medium text-gray-700 ">Phone No:</label>
            <input
             type="tel"
             placeholder="Plz enter the phone number"
             value={phonenumber}
             onChange={(e)=>setPhoneNumber(e.target.value)}
             className="rounded-lg border border-2 w-full p-3 mt-1 "/>
          </div>
          <div>
            <label className="block font-medium text-gray-700 ">Vehicle Type</label>
            <input 
             type="text"
             placeholder="Plz enter the your vehicle type"
             value={vehicletype}
             onChange={(e)=>setVehicleType(e.target.value)}
             className="rounded-lg border border-2 w-full p-3 mt-1 "/>
          </div>
          <div>
            <label className="block font-medium text-gray-700 ">Current Location</label>
            <input
             type="text"
             placeholder="Plz enter your current location"
             value={currentlocation}
             onChange={(e)=>setCurrentLocation(e.target.value)}
             className="rounded-lg border border-2 w-full p-3 mt-1 "/>
          </div>
          <div>
            <label className="block font-medium text-gray-700 ">Service</label>
            <input
             type="text"
             placeholder="Plz enter your current location"
             value={service}
             onChange={(e)=>setService(e.target.value)}
             className="rounded-lg border border-2 w-full p-3 mt-1 "/>
          </div>
          <button className="w-full rounded-lg px-3 py-3 bg-blue-600 hover:bg-blue-800 text-white font-semibold mt-6">Submit Booking</button>
        </form>
      </div>
    </div>
  )
}

export default Booking
