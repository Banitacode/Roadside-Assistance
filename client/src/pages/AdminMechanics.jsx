
import React, { useState, useEffect } from "react";
import {
  Wrench,
  Users,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  IndianRupee,
  Pencil,
  Trash2,
  CheckCircle,
  Plus,
  X,
  RefreshCw,
  LoaderCircle,
  AlertCircle,
  CalendarDays,
  BriefcaseBusiness
} from "lucide-react";

export default function AdminMechanics() {
  const [mechanics, setMechanics] = useState([]);
  const [editingMechanic, setEditingMechanic] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newMechanic, setNewMechanic] = useState({
    name: "",
    phone_no: "",
    location: "",
    service: "",
    experience_years: "",
    price: ""
  });

  const fetchMechanics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:3001/mechanics");

      if (!response.ok) {
        throw new Error("Unable to fetch mechanic details");
      }

      const data = await response.json();
      setMechanics(data);
    } catch (error) {
      console.error("Error fetching mechanics:", error);
      setError("Unable to load mechanics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMechanics();
  }, []);

  const verifyMechanic = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/mechanics/${id}/verification`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            verification_status: "verified"
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setMechanics((prev) =>
        prev.map((mechanic) =>
          mechanic.id === id ? data.mechanic : mechanic
        )
      );

      alert(data.message);
    } catch (error) {
      console.error("Mechanic verification error:", error);
      alert("Unable to verify mechanic.");
    }
  };

  const saveMechanic = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/mechanics/${editingMechanic.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            phone_no: editingMechanic.phone_no,
            location: editingMechanic.location,
            service: editingMechanic.service,
            experience_years:
              editingMechanic.experience_years === ""
                ? null
                : Number(editingMechanic.experience_years),
            price:
              editingMechanic.price === ""
                ? null
                : Number(editingMechanic.price),
            availability: editingMechanic.availability
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setMechanics((prev) =>
        prev.map((mechanic) =>
          mechanic.id === editingMechanic.id
            ? data.mechanic
            : mechanic
        )
      );

      setEditingMechanic(null);
      alert(data.message);
    } catch (error) {
      console.error("Save mechanic error:", error);
      alert("Unable to save mechanic details.");
    }
  };

  const deleteMechanic = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this mechanic?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3001/mechanics/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setMechanics((prev) =>
        prev.filter((mechanic) => mechanic.id !== id)
      );

      alert(data.message);
    } catch (error) {
      console.error("Delete mechanic error:", error);
      alert("Unable to delete mechanic.");
    }
  };

  const addMechanic = async () => {
    if (
      !newMechanic.name.trim() ||
      !newMechanic.location.trim() ||
      !newMechanic.service.trim()
    ) {
      alert("Please enter all required fields.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3001/mechanics",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newMechanic)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setMechanics((prev) => [
        data.mechanic,
        ...prev
      ]);

      setNewMechanic({
        name: "",
        phone_no: "",
        location: "",
        service: "",
        experience_years: "",
        price: ""
      });

      setShowAddForm(false);
      alert(data.message);
    } catch (error) {
      console.error("Add mechanic error:", error);
      alert("Unable to add mechanic.");
    }
  };

  const verifiedCount = mechanics.filter(
    (mechanic) => mechanic.verification_status === "verified"
  ).length;

  const pendingCount = mechanics.filter(
    (mechanic) => mechanic.verification_status === "pending"
  ).length;

  const availableCount = mechanics.filter(
    (mechanic) => mechanic.availability === true
  ).length;

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const statusStyle = (status) => {
    if (status === "verified") {
      return "bg-green-100 text-green-700";
    }

    if (status === "pending") {
      return "bg-amber-100 text-amber-700";
    }

    return "bg-slate-100 text-slate-600";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
              <Wrench size={17} />
              Roadside Admin Panel
            </div>

            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Manage Mechanics
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Register, verify and manage roadside service partners.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchMechanics}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setEditingMechanic(null);
              }}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Mechanic
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Mechanics</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                  {mechanics.length}
                </h2>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Users size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Verified</p>
                <h2 className="mt-2 text-3xl font-bold text-green-600">
                  {verifiedCount}
                </h2>
              </div>
              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                <ShieldCheck size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending Verification</p>
                <h2 className="mt-2 text-3xl font-bold text-amber-600">
                  {pendingCount}
                </h2>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Clock size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Available</p>
                <h2 className="mt-2 text-3xl font-bold text-indigo-600">
                  {availableCount}
                </h2>
              </div>
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <CheckCircle size={23} />
              </div>
            </div>
          </div>
        </div>

        {/* Add Mechanic Form */}
        {showAddForm && (
          <div className="mb-8 rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Register New Mechanic
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the mechanic's details below.
                </p>
              </div>

              <button
                onClick={() => setShowAddForm(false)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                aria-label="Close form"
              >
                <X size={21} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <input
                className={inputClass}
                type="text"
                placeholder="Mechanic Name *"
                value={newMechanic.name}
                onChange={(e) =>
                  setNewMechanic({
                    ...newMechanic,
                    name: e.target.value
                  })
                }
              />

              <input
                className={inputClass}
                type="text"
                placeholder="Phone Number"
                value={newMechanic.phone_no}
                onChange={(e) =>
                  setNewMechanic({
                    ...newMechanic,
                    phone_no: e.target.value
                  })
                }
              />

              <input
                className={inputClass}
                type="text"
                placeholder="Location *"
                value={newMechanic.location}
                onChange={(e) =>
                  setNewMechanic({
                    ...newMechanic,
                    location: e.target.value
                  })
                }
              />

              <input
                className={inputClass}
                type="text"
                placeholder="Service *"
                value={newMechanic.service}
                onChange={(e) =>
                  setNewMechanic({
                    ...newMechanic,
                    service: e.target.value
                  })
                }
              />

              <input
                className={inputClass}
                type="number"
                placeholder="Experience (Years)"
                value={newMechanic.experience_years}
                onChange={(e) =>
                  setNewMechanic({
                    ...newMechanic,
                    experience_years: e.target.value
                  })
                }
              />

              <input
                className={inputClass}
                type="number"
                placeholder="Service Price (₹)"
                value={newMechanic.price}
                onChange={(e) =>
                  setNewMechanic({
                    ...newMechanic,
                    price: e.target.value
                  })
                }
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={addMechanic}
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Register Mechanic
              </button>

              <button
                onClick={() => setShowAddForm(false)}
                className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Edit Mechanic Form */}
        {editingMechanic && (
          <div className="mb-8 rounded-xl border border-blue-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Edit Mechanic Details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update {editingMechanic.name}'s information.
                </p>
              </div>

              <button
                onClick={() => setEditingMechanic(null)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                aria-label="Close edit form"
              >
                <X size={21} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Phone Number
                </label>
                <input
                  className={inputClass}
                  type="text"
                  value={editingMechanic.phone_no ?? ""}
                  onChange={(e) =>
                    setEditingMechanic({
                      ...editingMechanic,
                      phone_no: e.target.value
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Location
                </label>
                <input
                  className={inputClass}
                  type="text"
                  value={editingMechanic.location ?? ""}
                  onChange={(e) =>
                    setEditingMechanic({
                      ...editingMechanic,
                      location: e.target.value
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Service
                </label>
                <input
                  className={inputClass}
                  type="text"
                  value={editingMechanic.service ?? ""}
                  onChange={(e) =>
                    setEditingMechanic({
                      ...editingMechanic,
                      service: e.target.value
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Experience (Years)
                </label>
                <input
                  className={inputClass}
                  type="number"
                  value={editingMechanic.experience_years ?? ""}
                  onChange={(e) =>
                    setEditingMechanic({
                      ...editingMechanic,
                      experience_years: e.target.value
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Price (₹)
                </label>
                <input
                  className={inputClass}
                  type="number"
                  value={editingMechanic.price ?? ""}
                  onChange={(e) =>
                    setEditingMechanic({
                      ...editingMechanic,
                      price: e.target.value
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Availability
                </label>
                <select
                  className={inputClass}
                  value={String(editingMechanic.availability)}
                  onChange={(e) =>
                    setEditingMechanic({
                      ...editingMechanic,
                      availability: e.target.value === "true"
                    })
                  }
                >
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={saveMechanic}
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Save Changes
              </button>

              <button
                onClick={() => setEditingMechanic(null)}
                className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <LoaderCircle className="mx-auto animate-spin text-blue-600" size={32} />
            <p className="mt-3 text-sm text-slate-500">
              Loading mechanics...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
            <AlertCircle className="mx-auto text-red-500" size={28} />
            <p className="mt-3 font-medium text-red-700">{error}</p>
            <button
              onClick={fetchMechanics}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Mechanics List */}
        {!loading && !error && (
          <>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Registered Mechanics
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  View and manage your service partners.
                </p>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                {mechanics.length} Total
              </span>
            </div>

            {mechanics.length === 0 ? (
              <div className="rounded-xl border border-slate-100 bg-white p-12 text-center shadow-sm">
                <Wrench className="mx-auto text-slate-300" size={42} />
                <h3 className="mt-4 font-semibold text-slate-700">
                  No mechanics available
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Add a mechanic to get started.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {mechanics.map((mechanic) => (
                  <div
                    key={mechanic.id}
                    className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                          <Wrench size={23} />
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-slate-800">
                            {mechanic.name}
                          </h3>
                          <p className="text-xs text-slate-400">
                            Mechanic ID: {mechanic.id}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle(
                          mechanic.verification_status
                        )}`}
                      >
                        {mechanic.verification_status || "Not verified"}
                      </span>
                    </div>

                    <div className="my-5 grid grid-cols-1 gap-3 border-y border-slate-100 py-4 sm:grid-cols-2">
                      <p className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin size={16} className="text-blue-500" />
                        {mechanic.location || "Location not provided"}
                      </p>

                      <p className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone size={16} className="text-blue-500" />
                        {mechanic.phone_no || "Phone not provided"}
                      </p>

                      <p className="flex items-center gap-2 text-sm text-slate-600">
                        <BriefcaseBusiness size={16} className="text-blue-500" />
                        {mechanic.service || "Service not provided"}
                      </p>

                      <p className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock size={16} className="text-blue-500" />
                        {mechanic.experience_years ?? "Not provided"}
                        {mechanic.experience_years != null ? " years" : ""}
                      </p>

                      <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <IndianRupee size={16} className="text-green-600" />
                        {mechanic.price != null
                          ? `₹${mechanic.price}`
                          : "Price not provided"}
                      </p>

                      <p className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle size={16} className="text-green-600" />
                        {mechanic.availability
                          ? "Available"
                          : "Unavailable"}
                      </p>
                    </div>

                    {mechanic.created_at && (
                      <p className="mb-4 flex items-center gap-2 text-xs text-slate-400">
                        <CalendarDays size={14} />
                        Registered:{" "}
                        {new Date(mechanic.created_at).toLocaleDateString()}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingMechanic({ ...mechanic });
                        }}
                        className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      <button
                        onClick={() => deleteMechanic(mechanic.id)}
                        className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>

                      {mechanic.verification_status === "pending" && (
                        <button
                          onClick={() => verifyMechanic(mechanic.id)}
                          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                        >
                          <ShieldCheck size={15} />
                          Verify
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
