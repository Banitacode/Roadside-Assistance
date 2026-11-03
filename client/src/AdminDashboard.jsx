import React from 'react'
import {ClipboardList,Clock,CheckCircle,CheckCheck} from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className='min-h-screen bg-gray-100 flex'>
        {/*sidebar */}
        <div className='w-64 bg-blue-900 text-white p-5'>
            <h2 className='text-2xl font-bold mb-10'>
                RoadSide Admin </h2>
                <ul className='space-y-6'>
                    <li>Dashboard</li>
                    <li>Bookings</li>
                    <li>Mechanics</li>
                    <li>Customers</li>
                    <li>Logout</li>
                </ul>
        </div>
        {/*Main Content */}
        <div className='flex-1 p-8'>
        <h1 className='text-3xl font-bold text-gray-800'>
            Admin Dashboard
        </h1>
        <p className='text-gray-500 mt-2 mb-8'>
            Welcome back! Here's your booking overview
        </p>
        {/* STATICS CARDS */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
         {/* TOTAL BOOKING */}
         <div className='bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition duration-300'>
            <div className='flex justify-between items-center'>
         <h3 className='text-gray-500 font-medium'>Total Bookings</h3>
         <div className='bg-blue-100 p-3 rounded-lg'>
            <ClipboardList size={26} className='text-blue-600'/>
         </div>
         </div>
         <p className='text-3xl font-bold text-gray-800 mt-3'>0</p>
         </div>
         {/*Pending Booking */}
         <div className='bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500 hover:shadow-lg transition duration-300'>
            <div className='flex justify-between items-center'>
            <h3 className='text-gray-500 font-medium'>Pending Bookings</h3>
            <div className='bg-yellow-100 p-3 rounded-lg'>
            <Clock size={26} className='text-yellow-600' />
            </div>
            </div>
            <p className='text-3xl font-bold text-gray-800 mt-3'>0</p>
         </div>
         {/* Confirmed Boookings */}
          <div className='bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition duration-300'>{/*border-l-4  means---Adds a left-side border. */}
            <div className='flex justify-between items-center'>
            <h3 className='text-gray-500 font-medium'>Confirmed Bookings</h3>
            <div className='bg-green-100 p-3 rounded-lg'>
            <CheckCircle size={26} className='text-green-600'/>
            </div>
         </div>

            <p className='text-3xl font-bold text-gray-800 mt-3'>0</p>
         </div>
         {/*Completed Booking */}
          <div className='bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-lg transition duration-300'>
            <div className='flex justify-between items-center'>
          <h3 className='text-gray-500 font-medium'>Completed Bookings</h3>
          <div className='bg-purple-100 p-3 rounded-lg'>
            <CheckCheck size={26} className='text-purple-600'/>
          </div>
          </div>
          <p className='text-3xl font-bold text-gray-800 mt-3'>0</p>
         </div>
        </div>
         {/*Recent Booking Section */}
         <div className='mt-10 bg-white rounded-xl shadow-md p-6'>
          <div className='flex justify-between items-center mb-6'>
          <div className=''>
            <h2 className='text-2xl font-bold text-gray-800'>Recent Bookings</h2>
            <p className='text-sm text-gray-500 mt-1'>
            Manage and monitor customer service requests
            </p>
          </div>
          <span className='text-blue-700 font-semibold text-sm'>
            All Bookings</span>
          </div>
          {/*Booking Table */}
          <div className='overflow-x-auto'>{/* overflow-x-auto-- means  Allows horizontal scrolling on smaller screens.*/}
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
                <tr className='border-b border-gray-100'>
                <td colSpan="7" className='text-center p-10 text-gray-400'>
                    No bookings available yet
                </td>
                </tr>
            </tbody>
            </table>
          </div> 
         </div>
        </div>
    </div>
  )
}
