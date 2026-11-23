
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  Car,
  CalendarCheck,
  Clock,
  CheckCircle2,
  Wrench,
  MapPin,
  IndianRupee,
  Star,
  MessageSquare,
  AlertCircle,
  ClipboardList,
  PlusCircle,
  LoaderCircle,
  ShieldCheck
} from 'lucide-react';

export default function CustomerDashboard() {
  const location = useLocation();
  const user = location.state?.user;

  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingError, setBookingError] = useState('');

  const [feedbackInputs, setFeedbackInputs] = useState({});
  const [submittingFeedback, setSubmittingFeedback] = useState(null);

  const [complaintInputs, setComplaintInputs] = useState({});
  const [submittingComplaint, setSubmittingComplaint] = useState(null);
  const [submittedComplaints, setSubmittedComplaints] = useState({});

  useEffect(() => {
    fetch('http://localhost:3001/mechanics')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to fetch mechanics');
        }
        return response.json();
      })
      .then((data) => {
        const availableMechanics = data.filter(
          (mechanic) =>
            mechanic.verification_status === 'verified' &&
            mechanic.availability === true
        );

        setMechanics(availableMechanics);
      })
      .catch((error) => {
        console.log('Mechanic fetch error:', error);
        setError('Unable to load mechanics.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user?.phone) {
      setBookingError(
        'Customer phone number is not available. Please log in again.'
      );
      setLoadingBookings(false);
      return;
    }

    fetch('http://localhost:3001/bookings')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to fetch bookings');
        }
        return response.json();
      })
      .then((data) => {
        const customerBookings = data.filter(
          (booking) =>
            String(booking.phone_number) === String(user.phone)
        );

        setBookings(customerBookings);
      })
      .catch((error) => {
        console.log('Booking history error:', error);
        setBookingError('Unable to load booking history.');
      })
      .finally(() => {
        setLoadingBookings(false);
      });
  }, [user?.phone]);

  const handleFeedbackChange = (bookingId, field, value) => {
    setFeedbackInputs((previous) => ({
      ...previous,
      [bookingId]: {
        ...previous[bookingId],
        [field]: value
      }
    }));
  };

  const submitFeedback = async (event, booking) => {
    event.preventDefault();

    const feedbackData = feedbackInputs[booking.id] || {};
    const rating = Number(feedbackData.rating);
    const feedback = feedbackData.feedback || '';

    if (!rating || rating < 1 || rating > 5) {
      alert('Please select a rating between 1 and 5.');
      return;
    }

    if (!feedback.trim()) {
      alert('Please enter your feedback.');
      return;
    }

    try {
      setSubmittingFeedback(booking.id);

      const response = await fetch(
        `http://localhost:3001/bookings/${booking.id}/feedback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            rating,
            feedback,
            phone_number: user.phone
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to submit feedback');
      }

      setBookings((previous) =>
        previous.map((item) =>
          item.id === booking.id ? data.booking : item
        )
      );

      alert(data.message);
    } catch (error) {
      console.log('Feedback submission error:', error);
      alert(error.message || 'Unable to submit feedback.');
    } finally {
      setSubmittingFeedback(null);
    }
  };

  const handleComplaintChange = (bookingId, value) => {
    setComplaintInputs((previous) => ({
      ...previous,
      [bookingId]: value
    }));
  };

  const submitComplaint = async (event, booking) => {
    event.preventDefault();

    const complaint = complaintInputs[booking.id] || '';

    if (!complaint.trim()) {
      alert('Please enter your complaint.');
      return;
    }

    try {
      setSubmittingComplaint(booking.id);

      const response = await fetch(
        'http://localhost:3001/complaints',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            booking_id: booking.id,
            customer_name: user.fullName,
            phone_number: user.phone,
            complaint: complaint.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to submit complaint');
      }

      setSubmittedComplaints((previous) => ({
        ...previous,
        [booking.id]: true
      }));

      setComplaintInputs((previous) => ({
        ...previous,
        [booking.id]: ''
      }));

      alert(data.message);
    } catch (error) {
      console.log('Complaint submission error:', error);
      alert(error.message || 'Unable to submit complaint.');
    } finally {
      setSubmittingComplaint(null);
    }
  };

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(
    (booking) => booking.status === 'pending'
  ).length;
  const completedBookings = bookings.filter(
    (booking) => booking.status === 'completed'
  ).length;

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-5 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Wrench className="text-blue-400" size={25} />
              <h1 className="text-2xl font-bold">RoadAssistant</h1>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              Customer Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800 rounded-full p-2">
              <User size={21} className="text-blue-300" />
            </div>
            <div>
              <p className="font-semibold">
                {user?.fullName || 'Customer'}
              </p>
              <p className="text-xs text-slate-300">
                Welcome back
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 py-8">

        {/* Welcome Section */}
        <div className="mb-8">
          <p className="text-blue-600 font-semibold text-sm mb-2">
            CUSTOMER PORTAL
          </p>
          <h2 className="text-3xl font-bold text-slate-900">
            Welcome, {user?.fullName || 'Customer'}!
          </h2>
          <p className="text-slate-500 mt-2">
            Manage your vehicles, track your bookings and get roadside assistance.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-500">Total Bookings</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">
                  {loadingBookings ? '...' : totalBookings}
                </h3>
              </div>
              <div className="bg-blue-100 text-blue-700 p-3 rounded-xl">
                <ClipboardList size={25} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-500">Pending Bookings</p>
                <h3 className="text-3xl font-bold text-amber-600 mt-2">
                  {loadingBookings ? '...' : pendingBookings}
                </h3>
              </div>
              <div className="bg-amber-100 text-amber-700 p-3 rounded-xl">
                <Clock size={25} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-500">Completed Services</p>
                <h3 className="text-3xl font-bold text-green-600 mt-2">
                  {loadingBookings ? '...' : completedBookings}
                </h3>
              </div>
              <div className="bg-green-100 text-green-700 p-3 rounded-xl">
                <CheckCircle2 size={25} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-500">Available Mechanics</p>
                <h3 className="text-3xl font-bold text-indigo-600 mt-2">
                  {loading ? '...' : mechanics.length}
                </h3>
              </div>
              <div className="bg-indigo-100 text-indigo-700 p-3 rounded-xl">
                <Wrench size={25} />
              </div>
            </div>
          </div>

        </div>

        {/* Quick Actions and Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

          <div className="lg:col-span-2 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl p-7 text-white shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div>
                <p className="text-blue-100 text-sm font-semibold mb-2">
                  NEED ROAD ASSISTANCE?
                </p>
                <h3 className="text-2xl font-bold mb-2">
                  Help is just a booking away.
                </h3>
                <p className="text-blue-100 text-sm max-w-lg">
                  Book a verified mechanic for breakdown repair, towing,
                  battery assistance and more.
                </p>
              </div>

              <Link
                to="/Booking"
                state={{ user }}
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-bold px-5 py-3 rounded-xl hover:bg-blue-50 transition whitespace-nowrap"
              >
                <PlusCircle size={19} />
                Book Now
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-blue-600" size={21} />
              <h3 className="text-lg font-bold text-slate-900">
                My Profile
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-600">
                <User size={17} className="text-slate-400" />
                <span>{user?.fullName || 'Not available'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 break-all">
                <Mail size={17} className="text-slate-400 shrink-0" />
                <span>{user?.email || 'Not available'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Phone size={17} className="text-slate-400" />
                <span>{user?.phone || 'Not available'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* My Vehicles */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 text-blue-700 p-3 rounded-xl">
              <Car size={25} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                My Vehicles
              </h3>
              <p className="text-sm text-slate-500">
                Add and manage your registered vehicles.
              </p>
            </div>
          </div>

          <Link
            to="/VehicleManagement"
            state={{ user }}
            className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-slate-700 transition"
          >
            <Car size={18} />
            Manage My Vehicles
          </Link>
        </div>

        {/* Booking History */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
              <CalendarCheck size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                My Booking History
              </h2>
              <p className="text-sm text-slate-500">
                View your roadside assistance requests and service updates.
              </p>
            </div>
          </div>

          {loadingBookings && (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
              <LoaderCircle className="animate-spin mx-auto text-blue-600 mb-2" size={28} />
              <p className="text-slate-500">Loading your bookings...</p>
            </div>
          )}

          {bookingError && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4">
              {bookingError}
            </div>
          )}

          {!loadingBookings && !bookingError && bookings.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <ClipboardList className="mx-auto text-slate-300 mb-3" size={42} />
              <h3 className="font-bold text-slate-800 text-lg">
                No bookings yet
              </h3>
              <p className="text-slate-500 text-sm mt-1 mb-5">
                Your roadside assistance bookings will appear here.
              </p>
              <Link
                to="/Booking"
                state={{ user }}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700"
              >
                <PlusCircle size={18} />
                Create Your First Booking
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">
                      Booking Reference
                    </p>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      Booking #{booking.id}
                    </h3>
                  </div>

                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${getStatusStyle(booking.status)}`}>
                    {booking.status || 'Pending'}
                  </span>
                </div>

                <div className="p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400 mb-1">Customer</p>
                      <p className="font-semibold text-slate-800">
                        {booking.customer_name}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400 mb-1">Vehicle</p>
                      <p className="font-semibold text-slate-800 flex items-center gap-2">
                        <Car size={16} className="text-blue-600" />
                        {booking.vehicle}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400 mb-1">Service</p>
                      <p className="font-semibold text-slate-800">
                        {booking.service}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400 mb-1">Phone Number</p>
                      <p className="font-semibold text-slate-800">
                        {booking.phone_number}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-slate-400 mb-1">Current Location</p>
                      <p className="font-semibold text-slate-800 flex items-start gap-2">
                        <MapPin size={16} className="text-red-500 shrink-0 mt-0.5" />
                        {booking.current_location}
                      </p>
                    </div>
                  </div>

                  {/* Feedback */}
                  {booking.status === 'completed' && (
                    <div className="border-t border-slate-100 mt-5 pt-5">
                      <div className="flex items-center gap-2 mb-4">
                        <Star className="text-amber-500" size={20} />
                        <h4 className="font-bold text-slate-900">
                          Rate Your Service
                        </h4>
                      </div>

                      {booking.rating != null ? (
                        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                          <p className="text-green-800 font-semibold flex items-center gap-2 mb-2">
                            <CheckCircle2 size={17} />
                            Feedback Submitted
                          </p>
                          <p className="text-sm text-slate-700 mb-2">
                            Your Rating: <span className="font-bold">{booking.rating}/5 ★</span>
                          </p>
                          <p className="text-sm text-slate-600">
                            {booking.feedback}
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={(event) => submitFeedback(event, booking)}>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Select Rating
                          </label>

                          <select
                            value={feedbackInputs[booking.id]?.rating || ''}
                            onChange={(event) =>
                              handleFeedbackChange(
                                booking.id,
                                'rating',
                                event.target.value
                              )
                            }
                            className="w-full border border-slate-300 p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="">Select Rating</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                          </select>

                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Your Feedback
                          </label>

                          <textarea
                            value={feedbackInputs[booking.id]?.feedback || ''}
                            onChange={(event) =>
                              handleFeedbackChange(
                                booking.id,
                                'feedback',
                                event.target.value
                              )
                            }
                            placeholder="Share your service experience..."
                            className="w-full border border-slate-300 p-3 rounded-xl mb-3 outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            required
                          />

                          <button
                            type="submit"
                            disabled={submittingFeedback === booking.id}
                            className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-slate-400 transition"
                          >
                            {submittingFeedback === booking.id
                              ? 'Submitting...'
                              : 'Submit Feedback'}
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {booking.status !== 'completed' && (
                    <div className="mt-5 bg-slate-50 rounded-xl p-3 text-sm text-slate-500 flex items-center gap-2">
                      <Clock size={17} />
                      Feedback will be available after the service is completed.
                    </div>
                  )}

                  {/* Complaint */}
                  <div className="border-t border-slate-100 mt-5 pt-5">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="text-red-500" size={20} />
                      <h4 className="font-bold text-slate-900">
                        Report a Problem
                      </h4>
                    </div>

                    {submittedComplaints[booking.id] ? (
                      <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-green-700 text-sm font-semibold flex items-center gap-2">
                        <CheckCircle2 size={18} />
                        Your complaint has been submitted successfully.
                      </div>
                    ) : (
                      <form onSubmit={(event) => submitComplaint(event, booking)}>
                        <textarea
                          value={complaintInputs[booking.id] || ''}
                          onChange={(event) =>
                            handleComplaintChange(
                              booking.id,
                              event.target.value
                            )
                          }
                          placeholder="Describe the problem with this booking..."
                          className="w-full border border-slate-300 p-3 rounded-xl mb-3 outline-none focus:ring-2 focus:ring-red-400"
                          rows="3"
                          required
                        />

                        <button
                          type="submit"
                          disabled={submittingComplaint === booking.id}
                          className="w-full sm:w-auto bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-red-700 disabled:bg-slate-400 transition"
                        >
                          {submittingComplaint === booking.id
                            ? 'Submitting...'
                            : 'Submit Complaint'}
                        </button>
                      </form>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Available Mechanics */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg">
              <Wrench size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Available Verified Mechanics
              </h2>
              <p className="text-sm text-slate-500">
                Explore mechanics currently available for assistance.
              </p>
            </div>
          </div>

          {loading && (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
              <LoaderCircle className="animate-spin mx-auto text-blue-600 mb-2" size={28} />
              <p className="text-slate-500">Loading mechanics...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4">
              {error}
            </div>
          )}

          {!loading && !error && mechanics.length === 0 && (
            <div className="bg-white rounded-xl p-6 border border-slate-200 text-slate-500">
              No verified mechanics are currently available.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mechanics.map((mechanic) => (
              <div
                key={mechanic.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-indigo-100 text-indigo-700 p-3 rounded-xl">
                    <Wrench size={24} />
                  </div>

                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                    <ShieldCheck size={14} />
                    Verified
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {mechanic.name}
                </h3>

                <div className="space-y-3 text-sm">
                  <p className="flex items-center gap-2 text-slate-600">
                    <MapPin size={16} className="text-slate-400" />
                    {mechanic.location}
                  </p>

                  <p className="flex items-center gap-2 text-slate-600">
                    <Wrench size={16} className="text-slate-400" />
                    {mechanic.service}
                  </p>

                  <p className="flex items-center gap-2 text-slate-600">
                    <User size={16} className="text-slate-400" />
                    {mechanic.experience_years ?? 'Not available'} years experience
                  </p>

                  <p className="flex items-center gap-2 text-green-700 font-bold text-base pt-2 border-t border-slate-100">
                    <IndianRupee size={17} />
                    {mechanic.price != null
                      ? mechanic.price
                      : 'Not available'}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2 text-green-700 text-sm font-semibold">
                  <CheckCircle2 size={17} />
                  Available for service
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 pt-6 pb-3 text-center text-sm text-slate-500">
          RoadAssistant Customer Portal · Roadside help when you need it.
        </footer>

      </main>
    </div>
  );
}
