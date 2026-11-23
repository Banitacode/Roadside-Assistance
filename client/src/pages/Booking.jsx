
import  React,{ useState, useEffect } from "react";
import  { useLocation } from "react-router-dom";

import {
  MapPin,
  Navigation,
  Car,
  Bike,
  Wrench,
  User,
  Phone,
  ClipboardList,
  PlusCircle,
  LocateFixed,
  LoaderCircle,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Route,
  AlertCircle
} from "lucide-react";

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRadians = value => (value * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function Booking() {
  const location = useLocation();
  const user = location.state?.user;
  const selectedService = location.state?.service || "";

  // Match Home page services with Booking dropdown options
  const serviceAliases = {
    "Bike Repair": "Breakdown Repair",
    "Car Repair": "Breakdown Repair",
    "Towing Service": "Towing"
  };

  const initialService =
    serviceAliases[selectedService] || selectedService;

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");

  const [customerName, setCustomerName] = useState(user?.fullName || "");
  const [phonenumber, setPhoneNumber] = useState(user?.phone || "");
  const [currentlocation, setCurrentLocation] = useState("");
  const [service, setService] = useState(initialService);
  const [gpsLoading, setGpsLoading] = useState(false);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [nearbyMechanics, setNearbyMechanics] = useState([]);
  const [loadingMechanics, setLoadingMechanics] = useState(false);

  const [vehicleType, setVehicleType] = useState("Car");
  const [vehicleModel, setVehicleModel] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:3001/users/${userId}/vehicles`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Unable to fetch vehicles");
        }
        return response.json();
      })
      .then(data => setVehicles(data))
      .catch(error => console.log("Fetch vehicles error:", error));
  }, [userId]);

  const getGPSLocation = () => {
    if (!navigator.geolocation) {
      alert("GPS location is not supported by this browser.");
      return;
    }

    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      position => {
        const customerLatitude = position.coords.latitude;
        const customerLongitude = position.coords.longitude;

        setLatitude(String(customerLatitude));
        setLongitude(String(customerLongitude));

        setCurrentLocation(
          `Latitude: ${customerLatitude}, Longitude: ${customerLongitude}`
        );

        setGpsLoading(false);
        alert("GPS location captured successfully!");
      },
      error => {
        setGpsLoading(false);
        alert(
          "Unable to get GPS location. Please allow location access or enter it manually."
        );
        console.log("GPS error:", error.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const findNearbyMechanics = async () => {
    if (latitude === "" || longitude === "") {
      setNearbyMechanics([]);
      return;
    }

    const customerLat = Number(latitude);
    const customerLon = Number(longitude);

    if (
      !Number.isFinite(customerLat) ||
      !Number.isFinite(customerLon) ||
      customerLat < -90 ||
      customerLat > 90 ||
      customerLon < -180 ||
      customerLon > 180
    ) {
      alert("Please enter valid latitude and longitude.");
      return;
    }

    setLoadingMechanics(true);

    try {
      const response = await fetch("http://localhost:3001/mechanics");

      if (!response.ok) {
        throw new Error("Unable to fetch mechanics");
      }

      const mechanics = await response.json();

      const nearby = mechanics
        .filter(
          mechanic =>
            mechanic.verification_status === "verified" &&
            mechanic.availability === true &&
            mechanic.latitude !== null &&
            mechanic.longitude !== null &&
            mechanic.latitude !== undefined &&
            mechanic.longitude !== undefined &&
            Number.isFinite(Number(mechanic.latitude)) &&
            Number.isFinite(Number(mechanic.longitude))
        )
        .map(mechanic => {
          const distance = calculateDistance(
            customerLat,
            customerLon,
            Number(mechanic.latitude),
            Number(mechanic.longitude)
          );

          // Demo ETA: assumed average speed 30 km/h + 5 minutes
          const etaMinutes = Math.ceil((distance / 30) * 60) + 5;

          return {
            ...mechanic,
            distance,
            etaMinutes
          };
        })
        .sort((a, b) => a.distance - b.distance);

      setNearbyMechanics(nearby);
    } catch (error) {
      console.log("Nearby mechanics error:", error.message);
      alert("Booking saved, but mechanics could not be loaded.");
    } finally {
      setLoadingMechanics(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (submitting) return;

    setSubmitting(true);

    try {
      let vehicleDetails = "";

      if (selectedVehicle === "new") {
        const vehicleResponse = await fetch(
          "http://localhost:3001/vehicles",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: userId,
              vehicle_type: vehicleType,
              vehicle_model: vehicleModel,
              registration_number: registrationNumber
            })
          }
        );

        const vehicleData = await vehicleResponse.json();

        if (!vehicleResponse.ok) {
          alert(vehicleData.message);
          return;
        }

        const savedVehicle = vehicleData.vehicle;
        setVehicles(prev => [savedVehicle, ...prev]);

        vehicleDetails = `${savedVehicle.vehicle_type} - ${savedVehicle.vehicle_model} (${savedVehicle.registration_number || "No registration"})`;
      } else {
        const vehicle = vehicles.find(
          item => String(item.id) === selectedVehicle
        );

        if (!vehicle) {
          alert("Please select a vehicle");
          return;
        }

        vehicleDetails = `${vehicle.vehicle_type} - ${vehicle.vehicle_model} (${vehicle.registration_number || "No registration"})`;
      }

      const bookingData = {
        customerName,
        phoneNo: phonenumber,
        vehicle: vehicleDetails,
        Location: currentlocation,
        service,
        latitude,
        longitude
      };

      const response = await fetch("http://localhost:3001/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (response.ok) {
        alert("Success: " + result.message);
        await findNearbyMechanics();
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.log("Booking error:", error.message);
      alert("Unable to submit booking. Please check your backend.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-5">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-3 text-amber-500" size={40} />
          <h2 className="text-xl font-bold text-slate-800">
            Login Required
          </h2>
          <p className="mt-2 text-slate-500">
            Please log in again to book roadside assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:py-10">
      <div className="mx-auto max-w-4xl">

        {/* Page heading */}
        <div className="mb-7">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-600">
            <Wrench size={18} />
            ROADSIDE ASSISTANCE
          </div>

          <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
            Book Roadside Assistance
          </h1>

          <p className="mt-2 text-slate-500">
            Tell us what help you need and find available mechanics nearby.
          </p>
        </div>

        {/* Booking form */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                <ClipboardList size={23} />
              </div>

              <div>
                <h2 className="font-bold text-slate-800">
                  Booking Details
                </h2>
                <p className="text-sm text-slate-500">
                  Complete the details below
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">

            {/* Customer details */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                <User size={19} className="text-blue-600" />
                Customer Information
              </h3>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Customer Name
                  </label>
                  <input
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Phone size={15} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phonenumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* Vehicle details */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                <Car size={19} className="text-blue-600" />
                Vehicle Information
              </h3>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Choose Vehicle
                </label>

                <select
                  value={selectedVehicle}
                  onChange={e => setSelectedVehicle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                >
                  <option value="">Select your vehicle</option>

                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={String(vehicle.id)}>
                      {vehicle.vehicle_type} - {vehicle.vehicle_model} - {vehicle.registration_number || "No registration"}
                    </option>
                  ))}

                  <option value="new">+ Add a New Vehicle</option>
                </select>
              </div>

              {selectedVehicle === "new" && (
                <div className="mt-5 space-y-4 rounded-xl border border-blue-100 bg-blue-50/50 p-5">
                  <h4 className="flex items-center gap-2 font-semibold text-slate-800">
                    <PlusCircle size={18} className="text-blue-600" />
                    Add New Vehicle
                  </h4>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Vehicle Type
                    </label>
                    <select
                      value={vehicleType}
                      onChange={e => setVehicleType(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                    >
                      <option value="Car">Car</option>
                      <option value="Bike">Bike</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Vehicle Model
                    </label>
                    <input
                      value={vehicleModel}
                      onChange={e => setVehicleModel(e.target.value)}
                      placeholder="Enter vehicle model"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Registration Number
                    </label>
                    <input
                      value={registrationNumber}
                      onChange={e => setRegistrationNumber(e.target.value)}
                      placeholder="Enter registration number"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100" />

            {/* Location */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                <MapPin size={19} className="text-blue-600" />
                Current Location
              </h3>

              <button
                type="button"
                onClick={getGPSLocation}
                disabled={gpsLoading}
                className="mb-3 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {gpsLoading ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <LocateFixed size={18} />
                )}
                {gpsLoading ? "Getting GPS Location..." : "Use My Current GPS Location"}
              </button>

              <input
                value={currentlocation}
                onChange={e => setCurrentLocation(e.target.value)}
                placeholder="Enter your location or capture GPS"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />

              <p className="mt-2 text-xs text-slate-500">
                Allow location access in your browser to capture your GPS coordinates.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Customer Latitude (optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={e => setLatitude(e.target.value)}
                    placeholder="Enter latitude"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Customer Longitude (optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={e => setLongitude(e.target.value)}
                    placeholder="Enter longitude"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* Service */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                <Wrench size={19} className="text-blue-600" />
                Required Service
              </h3>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Select a Service
              </label>

              <select
                value={service}
                onChange={e => setService(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              >
                <option value="">Select a service</option>
                <option value="Breakdown Repair">Breakdown Repair</option>
                <option value="Towing">Towing</option>
                <option value="Battery Jump-start">Battery Jump-start</option>
                <option value="Flat Tire Repair">Flat Tire Repair</option>
                <option value="Fuel Delivery">Fuel Delivery</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <LoaderCircle size={20} className="animate-spin" />
                  Submitting Booking...
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Submit Booking
                </>
              )}
            </button>
          </form>
        </div>

        {/* Nearby mechanics */}
        {loadingMechanics && (
          <div className="mt-7 flex items-center gap-3 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <LoaderCircle className="animate-spin text-blue-600" size={23} />
            <p className="font-medium text-slate-600">
              Finding nearby verified mechanics...
            </p>
          </div>
        )}

        {nearbyMechanics.length > 0 && (
          <div className="mt-8">
            <div className="mb-5">
              <div className="mb-2 flex items-center gap-2 text-blue-600">
                <Navigation size={19} />
                <span className="text-sm font-semibold">
                  MECHANIC MATCHING
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-800">
                Nearby Available Mechanics
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Verified mechanics sorted by approximate distance.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {nearbyMechanics.map(mechanic => (
                <div
                  key={mechanic.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                        <Wrench size={22} />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-800">
                          {mechanic.name}
                        </h3>
                        <p className="text-xs text-emerald-600">
                          Verified mechanic
                        </p>
                      </div>
                    </div>

                    <CheckCircle2 className="text-emerald-600" size={22} />
                  </div>

                  <div className="space-y-3 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <MapPin size={16} className="text-slate-400" />
                      {mechanic.location}
                    </p>

                    <p className="flex items-center gap-2">
                      <Wrench size={16} className="text-slate-400" />
                      {mechanic.service}
                    </p>

                    <p className="flex items-center gap-2">
                      <IndianRupee size={16} className="text-slate-400" />
                      Price: ₹{mechanic.price}
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="rounded-xl bg-blue-50 p-3">
                        <p className="flex items-center gap-1 text-xs text-slate-500">
                          <Route size={14} />
                          Approx. Distance
                        </p>
                        <p className="mt-1 font-bold text-blue-700">
                          {mechanic.distance.toFixed(2)} km
                        </p>
                      </div>

                      <div className="rounded-xl bg-emerald-50 p-3">
                        <p className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock3 size={14} />
                          Demo ETA
                        </p>
                        <p className="mt-1 font-bold text-emerald-700">
                          {mechanic.etaMinutes} minutes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loadingMechanics &&
          nearbyMechanics.length === 0 &&
          latitude !== "" &&
          longitude !== "" && (
            <div className="mt-7 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5">
              <AlertCircle className="mt-0.5 text-amber-600" size={21} />
              <p className="text-sm text-slate-700">
                No verified and available mechanics with coordinates were found.
              </p>
            </div>
          )}

      </div>
    </div>
  );
}

export default Booking;
