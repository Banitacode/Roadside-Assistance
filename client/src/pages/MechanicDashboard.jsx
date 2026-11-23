
import React, { useState, useEffect } from "react";
import {
  Wrench,
  ClipboardList,
  CheckCircle2,
  IndianRupee,
  User,
  Phone,
  MapPin,
  Car,
  Clock,
  Check,
  X,
  History,
  Wallet,
  LoaderCircle,
  AlertCircle
} from "lucide-react";

export default function MechanicDashboard() {
  const [bookings, setBookings] = useState([]);
  const [mechanicId, setMechanicId] = useState(1);
  const [mechanicPrice, setMechanicPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:3001/mechanics/${mechanicId}/bookings`
        );

        if (!response.ok) {
          throw new Error("Unable to fetch bookings");
        }

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Fetch booking error:", error);
        setError("Unable to load bookings. Please check your backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [mechanicId]);

  useEffect(() => {
    const fetchMechanicPrice = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/mechanics"
        );

        if (!response.ok) {
          throw new Error("Unable to fetch mechanic details");
        }

        const data = await response.json();

        const selectedMechanic = data.find(
          mechanic => Number(mechanic.id) === mechanicId
        );

        setMechanicPrice(selectedMechanic?.price ?? null);
      } catch (error) {
        console.error("Mechanic details error:", error);
        setMechanicPrice(null);
      }
    };

    fetchMechanicPrice();
  }, [mechanicId]);

  const updateBooking = async (bookingId, action) => {
    const actionUrls = {
      accept: "accept",
      reject: "reject",
      complete: "complete"
    };

    try {
      setProcessingId(bookingId);

      const response = await fetch(
        `http://localhost:3001/bookings/${bookingId}/${actionUrls[action]}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mechanic_id: mechanicId })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to update booking");
        return;
      }

      if (action === "reject") {
        setBookings(prev =>
          prev.filter(booking => booking.id !== bookingId)
        );
      } else {
        setBookings(prev =>
          prev.map(booking =>
            booking.id === bookingId ? data.booking : booking
          )
        );
      }

      alert(data.message);
    } catch (error) {
      console.error(`${action} booking error:`, error);
      alert("Unable to update booking. Please check your backend.");
    } finally {
      setProcessingId(null);
    }
  };

  const activeBookings = bookings.filter(
    booking =>
      booking.status === "pending" ||
      booking.status === "confirmed"
  );

  const completedBookings = bookings.filter(
    booking => booking.status === "completed"
  );

  const estimatedEarnings =
    mechanicPrice != null
      ? Number(mechanicPrice) * completedBookings.length
      : null;

  const formatCurrency = value =>
    `₹${Number(value).toLocaleString("en-IN")}`;

  const statCards = [
    {
      title: "Total Assigned Bookings",
      value: bookings.length,
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Active Bookings",
      value: activeBookings.length,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      title: "Completed Jobs",
      value: completedBookings.length,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      title: "Estimated Earnings",
      value: estimatedEarnings != null
        ? formatCurrency(estimatedEarnings)
        : "Not available",
      icon: Wallet,
      color: "text-purple-600",
      bg: "bg-purple-50"
    }
  ];

  const statusStyle = status => {
    if (status === "pending") {
      return "bg-amber-100 text-amber-700";
    }
    if (status === "confirmed") {
      return "bg-blue-100 text-blue-700";
    }
    return "bg-emerald-100 text-emerald-700";
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-slate-900 px-5 py-7 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-blue-300">
              <Wrench size={20} />
              <span className="text-sm font-semibold tracking-wider">
                ROADSIDE ASSISTANCE
              </span>
            </div>

            <h1 className="text-3xl font-bold">
              Mechanic Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-300">
              Manage your service requests, jobs and earnings.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 p-3">
            <div className="rounded-lg bg-blue-600 p-2">
              <User size={22} />
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Selected Mechanic
              </p>
              <p className="font-semibold">
                {mechanicId === 1 ? "Ravi" : "Sagar Ratha"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8">

        {/* Mechanic selector */}
        <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-800">
              Mechanic Account
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Select the mechanic whose bookings you want to view.
            </p>
          </div>

          <select
            value={mechanicId}
            onChange={e => setMechanicId(Number(e.target.value))}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value={1}>Ravi</option>
            <option value={5}>Sagar Ratha</option>
          </select>
        </section>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>
                    <h2 className="mt-3 text-2xl font-bold text-slate-800">
                      {stat.value}
                    </h2>
                  </div>

                  <div className={`rounded-xl p-3 ${stat.bg} ${stat.color}`}>
                    <Icon size={25} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Active bookings */}
        <section>
          <div className="mb-5">
            <div className="flex items-center gap-2 text-blue-600">
              <ClipboardList size={20} />
              <span className="text-sm font-bold tracking-wide">
                SERVICE MANAGEMENT
              </span>
            </div>

            <h2 className="mt-2 text-2xl font-bold text-slate-800">
              My Assigned Bookings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review requests and update their service status.
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-3 rounded-2xl bg-white p-10 shadow-sm">
              <LoaderCircle className="animate-spin text-blue-600" />
              <p className="text-slate-600">Loading bookings...</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
              <AlertCircle size={22} />
              {error}
            </div>
          )}

          {!loading && !error && activeBookings.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <ClipboardList className="mx-auto text-slate-300" size={42} />
              <h3 className="mt-3 font-bold text-slate-700">
                No Active Bookings
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                New assigned service requests will appear here.
              </p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {activeBookings.map(booking => (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Booking Reference
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-slate-800">
                        #{booking.id}
                      </h3>
                    </div>

                    <span className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyle(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="space-y-4 border-t border-slate-100 pt-5">
                    <div className="flex items-start gap-3">
                      <User className="mt-0.5 text-blue-600" size={18} />
                      <div>
                        <p className="text-xs text-slate-400">Customer</p>
                        <p className="font-semibold text-slate-800">
                          {booking.customer_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 text-blue-600" size={18} />
                      <div>
                        <p className="text-xs text-slate-400">Phone</p>
                        <p className="font-medium text-slate-700">
                          {booking.phone_number}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Car className="mt-0.5 text-blue-600" size={18} />
                      <div>
                        <p className="text-xs text-slate-400">Vehicle</p>
                        <p className="font-medium text-slate-700">
                          {booking.vehicle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Wrench className="mt-0.5 text-blue-600" size={18} />
                      <div>
                        <p className="text-xs text-slate-400">Required Service</p>
                        <p className="font-medium text-slate-700">
                          {booking.service}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 text-blue-600" size={18} />
                      <div>
                        <p className="text-xs text-slate-400">Location</p>
                        <p className="font-medium text-slate-700">
                          {booking.current_location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                    {booking.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateBooking(booking.id, "accept")}
                          disabled={processingId === booking.id}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {processingId === booking.id ? (
                            <LoaderCircle size={17} className="animate-spin" />
                          ) : (
                            <Check size={18} />
                          )}
                          Accept
                        </button>

                        <button
                          onClick={() => updateBooking(booking.id, "reject")}
                          disabled={processingId === booking.id}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          <X size={18} />
                          Reject
                        </button>
                      </>
                    )}

                    {booking.status === "confirmed" && (
                      <button
                        onClick={() => updateBooking(booking.id, "complete")}
                        disabled={processingId === booking.id}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                      >
                        {processingId === booking.id ? (
                          <LoaderCircle size={18} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={18} />
                        )}
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Job history */}
        <section>
          <div className="mb-5">
            <div className="flex items-center gap-2 text-emerald-600">
              <History size={20} />
              <span className="text-sm font-bold tracking-wide">
                COMPLETED WORK
              </span>
            </div>

            <h2 className="mt-2 text-2xl font-bold text-slate-800">
              My Job History
            </h2>
          </div>

          {!loading && completedBookings.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <History className="mx-auto text-slate-300" size={38} />
              <p className="mt-3 font-semibold text-slate-600">
                No completed jobs available yet.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {completedBookings.map(booking => (
              <div
                key={booking.id}
                className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">
                    Booking #{booking.id}
                  </h3>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    Completed
                  </span>
                </div>

                <p className="text-sm text-slate-600">
                  Customer: <strong>{booking.customer_name}</strong>
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Vehicle: {booking.vehicle}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Service: {booking.service}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Location: {booking.current_location}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Earnings */}
        <section className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/20 p-3 text-emerald-300">
              <Wallet size={26} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">My Earnings</h2>
              <p className="text-sm text-slate-300">
                Your estimated earnings summary
              </p>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-sm text-slate-400">Completed Jobs</p>
              <p className="mt-2 text-2xl font-bold">
                {completedBookings.length}
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-sm text-slate-400">Listed Price Per Job</p>
              <p className="mt-2 text-2xl font-bold">
                {mechanicPrice != null
                  ? formatCurrency(mechanicPrice)
                  : "Not available"}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-600 p-4">
              <p className="text-sm text-emerald-100">
                Total Estimated Earnings
              </p>
              <p className="mt-2 text-2xl font-bold">
                {estimatedEarnings != null
                  ? formatCurrency(estimatedEarnings)
                  : "Not available"}
              </p>
            </div>
          </div>

          <p className="mt-5 text-xs text-slate-400">
            Demo calculation based on the mechanic's listed price and completed jobs.
            This is an estimate, not an actual payment record.
          </p>
        </section>
      </main>
    </div>
  );
}
