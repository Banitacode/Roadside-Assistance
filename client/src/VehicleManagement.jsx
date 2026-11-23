
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Car,
  Bike,
  Plus,
  MapPin,
  ClipboardList,
  Hash,
  ArrowLeft,
  LoaderCircle,
  CheckCircle2,
  CarFront
} from 'lucide-react';

export default function VehicleManagement() {
  const location = useLocation();
  const user = location.state?.user;
  const userId = user?.id;

  const [vehicleType, setVehicleType] = useState('Bike');
  const [vehicleModel, setVehicleModel] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3001/users/${userId}/vehicles`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Unable to load vehicles.');
        }
        return response.json();
      })
      .then(data => {
        setVehicles(data);
        setError('');
      })
      .catch(error => {
        console.log('Fetch vehicles error:', error);
        setError('Unable to load your saved vehicles. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vehicleModel.trim()) {
      alert('Please enter the vehicle model.');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('http://localhost:3001/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          vehicle_type: vehicleType,
          vehicle_model: vehicleModel.trim(),
          registration_number: registrationNumber.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Unable to add vehicle.');
        return;
      }

      alert(data.message || 'Vehicle added successfully!');
      setVehicles(prev => [data.vehicle, ...prev]);
      setVehicleModel('');
      setRegistrationNumber('');
      setVehicleType('Bike');

    } catch (error) {
      console.log('Add vehicle error:', error.message);
      alert('Unable to add vehicle. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
          <CarFront size={45} className="mx-auto text-blue-600 mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Login Required
          </h2>
          <p className="text-slate-500 mb-5">
            Please log in again to manage your vehicles.
          </p>
          <Link to="/Login" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-5 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <CarFront size={25} />
            </div>
            <div>
              <h1 className="text-xl font-bold">RoadAssistant</h1>
              <p className="text-xs text-slate-400">Vehicle Management</p>
            </div>
          </Link>
          <Link
            to="/CustomerDashboard"
            state={{ user }}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-10">
        <div className="mb-8">
          <p className="text-blue-600 font-semibold text-sm mb-2">
            CUSTOMER SERVICES
          </p>
          <h2 className="text-3xl font-bold text-slate-900">
            My Vehicles
          </h2>
          <p className="text-slate-500 mt-2">
            Add and manage the vehicles you use for roadside assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <section className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                  <Plus size={23} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Add a Vehicle
                  </h3>
                  <p className="text-sm text-slate-500">
                    Enter your vehicle details
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Vehicle Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setVehicleType('Bike')}
                      className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 font-semibold transition ${
                        vehicleType === 'Bike'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:border-blue-300'
                      }`}
                    >
                      <Bike size={22} /> Bike
                    </button>

                    <button
                      type="button"
                      onClick={() => setVehicleType('Car')}
                      className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 font-semibold transition ${
                        vehicleType === 'Car'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:border-blue-300'
                      }`}
                    >
                      <Car size={22} /> Car
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Vehicle Model
                  </label>
                  <div className="relative">
                    <CarFront className="absolute left-3 top-3.5 text-slate-400" size={19} />
                    <input
                      type="text"
                      value={vehicleModel}
                      onChange={e => setVehicleModel(e.target.value)}
                      placeholder="e.g. Honda Activa, Hyundai i20"
                      className="w-full border border-slate-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Registration Number
                    <span className="text-slate-400 font-normal"> (Optional)</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3.5 text-slate-400" size={19} />
                    <input
                      type="text"
                      value={registrationNumber}
                      onChange={e => setRegistrationNumber(e.target.value)}
                      placeholder="e.g. TS09AB1234"
                      className="w-full border border-slate-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 rounded-xl transition shadow-md"
                >
                  {saving ? (
                    <>
                      <LoaderCircle size={19} className="animate-spin" />
                      Adding Vehicle...
                    </>
                  ) : (
                    <>
                      <Plus size={19} />
                      Add Vehicle
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>

          <section className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    Saved Vehicles
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Your registered vehicles
                  </p>
                </div>
                <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
                  {vehicles.length} Vehicles
                </span>
              </div>

              {loading ? (
                <div className="py-12 text-center">
                  <LoaderCircle className="animate-spin text-blue-600 mx-auto mb-3" size={32} />
                  <p className="text-slate-500">Loading your vehicles...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 text-red-700 rounded-xl p-5 text-center">
                  {error}
                  <button
                    onClick={() => window.location.reload()}
                    className="block mx-auto mt-3 font-semibold underline"
                  >
                    Reload page
                  </button>
                </div>
              ) : vehicles.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="bg-slate-100 rounded-full p-5 inline-flex mb-4">
                    <Car size={35} className="text-slate-400" />
                  </div>
                  <h4 className="font-bold text-slate-700">
                    No vehicles added yet
                  </h4>
                  <p className="text-sm text-slate-500 mt-2">
                    Add your first vehicle using the form.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {vehicles.map(vehicle => (
                    <div
                      key={vehicle.id}
                      className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                            {vehicle.vehicle_type?.toLowerCase() === 'bike'
                              ? <Bike size={27} />
                              : <Car size={27} />}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-lg">
                              {vehicle.vehicle_model}
                            </h4>
                            <p className="text-sm text-slate-500">
                              {vehicle.vehicle_type}
                            </p>
                          </div>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
                          <CheckCircle2 size={14} />
                          Saved
                        </span>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-600">
                        <Hash size={16} className="text-slate-400" />
                        <span className="font-medium">Registration:</span>
                        <span>
                          {vehicle.registration_number || 'Not provided'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-3">
              <MapPin className="text-blue-600 shrink-0" size={22} />
              <div>
                <h4 className="font-semibold text-blue-900">
                  Quick Assistance
                </h4>
                <p className="text-sm text-blue-800 mt-1">
                  Keeping your vehicle details saved makes it easier to provide accurate information when booking roadside assistance.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
