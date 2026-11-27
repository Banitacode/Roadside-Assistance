import React from 'react'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ClipboardList,
  Clock,
  CheckCircle,
  CheckCheck,
  LayoutDashboard,
  Wrench,
  Users,
  LogOut
} from 'lucide-react'
export default function AdminBookings() {
  const [activeMenu,setactiveMenu] =useState('Bookings')
  const [mechanics,setMechanics]=useState([])
  const navigate =useNavigate();
  const[bookings,setBookings] =useState([])
  const[selectedMechanics,setSelectedMechanics] =useState({});
    useEffect (()=>{
    const fetchBookings = async () =>{
    try {
      const response = await fetch('https://roadside-assistance-il83.onrender.com/bookings');
      const data = await response.json();
      setBookings(data);
      console.log(data);
      console.log(data.map((booking) => booking.status));
    }catch(error){
      console.error('Error fetching bookings:',error)
    }
    }
    const fetMechanics = async ()=>{
      try{
        const response = await fetch(`https://roadside-assistance-il83.onrender.com/mechanics`)
        if(!response.ok){
          throw new Error('Unable to fetch mechanics')
        }
        const data = await response.json();
        setMechanics(
          data.filter((mechanic)=>
          mechanic.verification_status === 'verified' &&
          mechanic.availability === true
          )
        );
      }catch(error){
        console.error('Error fetching mechanic:',error)
      }
    }; 
    fetchBookings();
    fetMechanics();
  },[]// [] means 	Runs the effect on the component's initial mount.
    )
    const pendingCount = bookings.filter(
      (booking) => booking.status ==='pending'
    ).length;
    const confirmedCount = bookings.filter(
      (booking) => booking.status ==='confirmed'
    ).length; 
    const completedCount = bookings.filter(
      (booking) => booking.status ==='completed'
    ).length;
    const updateBookingStatus = async (id,newStatus) => {
      try{
        const response = await fetch(`https://roadside-assistance-il83.onrender.com/bookings/${id}`,
          {
            method:'PUT',
            headers:{
              'Content-Type':'application/json'
            },
            body:JSON.stringify({
              status:newStatus
            })
          }
        )
        const data = await response.json();
        if(!response.ok){
          alert(data.message);
          return;
        }
        setBookings((prevBookings)=>
          prevBookings.map((booking)=>
            booking.id === id ? data.booking:booking
        )
      )
      alert(data.message);
      }catch(error){
        console.error('Update Booking error:',error)
      }
    }
    const assignMechanic =async (bookingId) =>{
      const mechanicId = selectedMechanics[bookingId]
      if(!mechanicId){
        alert('Plz select a MechanicId;');
        return;
      }
      try {
      const response = await fetch(
        `https://roadside-assistance-il83.onrender.com/bookings/${bookingId}/assign`,
        {
        method:'PUT',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mechanic_id:Number(mechanicId)
        })
        }
      );
      const data =await response.json();
      if(!response.ok){
        alert(data.message);
        return;
      }
      setBookings((prevBookings)=>
      prevBookings.map((booking)=>
      booking.id ===bookingId ? data.booking :booking
      )
      );
      alert(data.message)
      }catch(error){
        console.error('Mechanic assigment error:',error)
      }
    };
  return (

      <div className='min-h-screen bg-gray-100 flex'>
        {/*sidebar */}
        <aside className='w-64 min-h-screen bg-blue-950 text-white flex flex-col shadow-xl p-5'>
          {/* Logo and Heading */ }
          <div className='flex items-center gap-3 mb-12'>
            <div className='bg-blue-500 p-2 rounded-lg'>
            <Wrench size={25} />
            </div>
            <h2 className='text-xl font-bold'>
                RoadSide Admin </h2>
          </div>
            {/*Navigation Menu*/}
            <nav className='flex-1'>
              <ul className='space-y-3'>
              <li>
                <button
                onClick={()=> navigate('/AdminDashboard')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition duration-200  ${activeMenu== 'Dashboard'
                  ?`bg-blue-600 text-white shadow-md`
                  :'text-blue-100 hover:bg-blue-800'
                }`}
                >
                  <LayoutDashboard size={20} />
                  <span>DashBoard</span>
                </button>
              </li>
              <li>
                <button
                onClick={()=> navigate('/AdminDashboard/AdminBookings')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition duration-200   ${
                  activeMenu== 'Bookings'
                  ?`bg-blue-600 text-white shadow-md`
                  :'text-blue-100 hover:bg-blue-800'
                }`}
                >
                <ClipboardList size = {20}/>
                <span>Bookings</span>
                </button>
              </li>
              <li >
                <button
                onClick={()=>navigate('/AdminMechanics')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition duration-200  ${
                  activeMenu =='Mechanics'
                  ?`bg-blue-600 text-white shadow-md`
                  :'text-blue-100 hover:bg-blue-800'
                }`}
                >
                <Wrench size= {20} />
                <span>Mechanics</span> 
                </button>
                </li>
                <li>
                  <button
                  onClick={()=>navigate('/AdminCustomer')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition duration-200  ${
                    activeMenu =='Customers'
                    ?`bg-blue-600 text-white shadow-md`
                    :'text-blue-100 hover:bg-blue-800'
                  }`}
                  >
                  <Users size={20} />
                  <span>Customers</span>
                  </button>
                </li>
              </ul>
            </nav>
            {/* LogOut */}
            <div className='border-t border-blue-800 pt-5'>
            <div className='flex items-center gap-3 p-3 text-blue-200'>
              <LogOut size ={20} />
              <span>LogOut</span> 
            </div>
            </div>
        </aside>
        {/* MAIN CONTENT*/ }
        <main className='flex-1 p-8'>
          {/* PAGE HEADING */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-800'>
              Manage Bookings
            </h1>
            <p className='text-gray-500 mt-2'>
              View and manage all customer service bookings
            </p>
          </div>
          {/*BOOKINGS AND STATISTICS */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white rounded-xl shadow-sm border p-6'>
         <p className='text-gray-500 text-sm'>Pending Bookings</p>
         <h2 className='text-3xl font-bold text-gray-800 mt-2'>{pendingCount}</h2>
         <Clock className='text-amber-500 mt-3' size={25} />
          </div>
          <div className='bg-white rounded-xl shadow-sm border p-6'>
          <p className='text-gray-500 text-sm'>Confirmed Bookings</p>
          <h2 className='text-3xl font-bold text-gray-800 mt-2'>{confirmedCount}</h2>
          <CheckCircle className='text-blue-600 mt-3' size={25}/>
          </div>
          <div className='bg-white rounded-xl shadow-sm  border p-6'>
            <p className='text-gray-500 text-sm'>Completed Bookings</p>
            <h2 className='text-3xl font-bold text-gray-800 mt-2'>{completedCount}</h2>
            <CheckCheck className='text-3xl font-bold text-gray-800 mt-3' size={25} />
          </div>
          </div>
         <span className='text-blue-700 font-semibold text-sm'>
            All Bookings</span>
          {/*Booking Table */}
          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
            <thead className='bg-gray-100 text-gray-600'>
                <tr>
                    <th className='p-4'>Customer</th>
                    <th className='p-4'>Phone</th>
                    <th className='p-4'>Vehicle</th>
                    <th className='p-4'>Service</th>
                    <th className='p-4'>Location</th>
                    <th className='p-4'>Status</th>
                    <th className='p-4'>Action</th>
                </tr>
            </thead>
            <tbody>
                {bookings.length ===0?(
                  <tr>
                <td colSpan="7" className='p-4 text-center  text-gray-500' >
                    No bookings available yet
                </td>
                </tr>
                ) :(
                  bookings.map((booking)=>(
                    <tr key ={booking.id}>
                      <td className='p-4 border-b'>{booking.customer_name}</td>
                      <td className='p-4 border-b'>{booking.phone_number}</td>
                      <td className='p-4 border-b'>{booking.vehicle}</td>
                      <td className='p-4 border-b'>{booking.service}</td>
                      <td className='p-4 border-b'>{booking.current_location}</td>
                      <td className='p-4 border-b'>{booking.status}</td>
                      <td className='p-4 border-b'>
                        {booking.status ==='pending' && booking.mechanic_id == null &&(
                          <>
                          <select
                          value={selectedMechanics[booking.id] || ''}
                          onChange={(e)=>
                            setSelectedMechanics((prev)=> ({
                              ...prev,
                              [booking.id]:e.target.value
                          }))
                        }
                        className='border border-gray-300 rounded-lg p-2'>
                          <option value=''>Selec Mechanic </option>
                          {mechanics.map((mechanic)=>(
                          <option key={mechanic.id} value={mechanic.id}>
                            {mechanic.name}
                          </option>
                          ))}
                        </select>
                  
                          <button
                          onClick ={()=>assignMechanic(booking.id)}
                          disabled ={!selectedMechanics[booking.id]}
                          className='bg-blue-600 text-white px-3 py-2 rounded-lg'
                          >
                            Assign
                          </button>
                        </>
                        )}
                      </td>
                    </tr>
                  )
                )
                )}
            </tbody>
            </table>
          </div> 
          </main>
         </div>
  )
}
