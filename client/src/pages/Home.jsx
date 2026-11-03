import { useNavigate } from "react-router-dom"
export default function Home() {
   const navigate =useNavigate()
  return (
       
        <div className="min-h-screen bg-gray-100 px-6 py-10 font-sans">
      <header className="mx-auto max-w-5xl text-center">
        <h1 className="text-4xl font-extrabold text-blue-700">
          Road Assistant
        </h1>

        <p className="mt-3 text-lg text-gray-600">
          Your roadside help, just a click away!
        </p>
      </header>

      <main className="mx-auto mt-12 max-w-5xl">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          Our Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
            <h3 className="text-xl font-bold text-blue-700">
              Bike Repair
            </h3>
            <p className="my-4 text-gray-600">
              Get help with your bike breakdown.
            </p>
            <button 
            onClick={()=>navigate("/Booking",{
              state:{service:"Bike Repair"}
            })}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-800">
              Book Now
            </button>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
            <h3 className="text-xl font-bold text-blue-700">
              Car Repair
            </h3>
            <p className="my-4 text-gray-600">
              Find assistance for your car.
            </p>
            <button
            onClick={()=>navigate("/Booking",{
              state:{service:"Car Repair"}
            })}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-800">
              Book Now
            </button>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
            <h3 className="text-xl font-bold text-blue-700">
              Towing Service
            </h3>
            <p className="my-4 text-gray-600">
              Get help moving your broken vehicle.
            </p>
            <button 
            onClick={()=>navigate("/Booking",{
              state:{service:"Towing Service"}
            })}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-800">
              Book Now
            </button>
          </div>
        </div>
      </main>
    </div>
    
  )
}


