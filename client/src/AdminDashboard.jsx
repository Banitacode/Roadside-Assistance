
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  CheckCheck,
  LayoutDashboard,
  Wrench,
  Users,
  LogOut,
  MessageSquareWarning,
  BarChart3,
  RefreshCw,
  MapPin,
  Phone,
  Car,
  AlertCircle
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:3001/bookings");

      if (!response.ok) {
        throw new Error("Unable to fetch bookings");
      }

      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Unable to load bookings. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const pendingCount = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/AdminDashboard" },
    { name: "Bookings", icon: ClipboardList, path: "/AdminDashboard/AdminBookings" },
    { name: "Mechanics", icon: Wrench, path: "/AdminMechanics" },
    { name: "Customers", icon: Users, path: "/AdminCustomer" },
    { name: "Complaints", icon: MessageSquareWarning, path: "/AdminComplaints" },
    { name: "Reports", icon: BarChart3, path: "/AdminReport" }
  ];

  const handleNavigation = (item) => {
    setActiveMenu(item.name);
    navigate(item.path);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const statCards = [
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: ClipboardList,
      color: "blue"
    },
    {
      title: "Pending Bookings",
      value: pendingCount,
      icon: Clock,
      color: "amber"
    },
    {
      title: "Confirmed Bookings",
      value: confirmedCount,
      icon: CheckCircle,
      color: "green"
    },
    {
      title: "Completed Bookings",
      value: completedCount,
      icon: CheckCheck,
      color: "purple"
    }
  ];

  const colorStyles = {
    blue: "bg-blue-100 text-blue-600 border-blue-500",
    amber: "bg-amber-100 text-amber-600 border-amber-500",
    green: "bg-green-100 text-green-600 border-green-500",
    purple: "bg-purple-100 text-purple-600 border-purple-500"
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 text-white flex flex-col shadow-xl shrink-0">

        <div className="flex items-center gap-3 px-6 py-7 border-b border-slate-800">
          <div className="bg-blue-600 p-3 rounded-xl">
            <Wrench size={25} />
          </div>

          <div>
            <h2 className="text-xl font-bold">RoadSide Admin</h2>
            <p className="text-xs text-slate-400 mt-1">
              Management Panel
            </p>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-3 mb-4">
            Main Menu
          </p>

          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 ${
                      activeMenu === item.name
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        
<div className="p-5 border-t border-slate-800">
  <button
    type="button"
    onClick={() => navigate("/Login", {
      replace: true,
      state: null
    })}
    className="w-full flex items-center gap-3 text-slate-300 hover:bg-slate-800 hover:text-white p-3 rounded-xl transition duration-200"
  >
    <div className="bg-slate-800 p-2 rounded-lg">
      <LogOut size={19} />
    </div>

    <div className="text-left">
      <p className="text-sm font-semibold">Logout</p>
      <p className="text-xs text-slate-500">
        Return to Login
      </p>
    </div>
  </button>
</div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-blue-600 font-semibold mb-2">
              OVERVIEW
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Admin Dashboard
            </h1>

            <p className="text-slate-500 mt-2">
              Welcome back! Here's your booking overview.
            </p>
          </div>

          <button
            onClick={fetchBookings}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-slate-50 shadow-sm transition disabled:opacity-60"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${colorStyles[card.color]} hover:shadow-md transition`}
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-slate-500">
                    {card.title}
                  </p>

                  <div className={`p-3 rounded-xl ${colorStyles[card.color].split(" ").slice(0, 2).join(" ")}`}>
                    <Icon size={23} />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-slate-800 mt-4">
                  {loading ? "..." : card.value}
                </h2>

                <p className="text-xs text-slate-400 mt-2">
                  Booking overview
                </p>
              </div>
            );
          })}
        </div>

        {/* Recent Bookings */}
        <section className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

          <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Recent Bookings
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                View all customer roadside assistance requests
              </p>
            </div>

            <button
              onClick={() => {
                setActiveMenu("Bookings");
                navigate("/AdminDashboard/AdminBookings");
              }}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
            >
              Manage All Bookings
            </button>
          </div>

          {error && (
            <div className="m-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[850px]">

              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Vehicle</th>
                  <th className="px-5 py-4">Service</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-500">
                      Loading bookings...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-slate-500">
                      Booking information could not be loaded.
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-500">
                      No bookings available yet.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-slate-50 transition"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">
                          {booking.customer_name}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Booking #{booking.id}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        <span className="flex items-center gap-2">
                          <Phone size={14} />
                          {booking.phone_number}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        <span className="flex items-center gap-2">
                          <Car size={15} />
                          {booking.vehicle}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {booking.service}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        <span className="flex items-center gap-2">
                          <MapPin size={15} />
                          {booking.current_location}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>

          {!loading && !error && bookings.length > 0 && (
            <div className="px-5 py-4 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                Showing all {bookings.length} bookings
              </p>
            </div>
          )}

        </section>

        <p className="text-center text-xs text-slate-400 mt-8">
          RoadSide Assistance Admin Dashboard
        </p>

      </main>
    </div>
  );
}
