
import React, { useState, useEffect } from "react";
import {
  Users,
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  RefreshCw,
  LoaderCircle,
  AlertCircle,
  ShieldCheck
} from "lucide-react";

export default function AdminCustomer() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:3001/users");

      if (!response.ok) {
        throw new Error("Unable to fetch customers");
      }

      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Fetch customers error:", error);
      setError("Unable to load customers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
              <ShieldCheck size={17} />
              ADMIN MANAGEMENT
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Manage Customers
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              View and manage registered customer information.
            </p>
          </div>

          <button
            onClick={fetchCustomers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* CUSTOMER STATISTIC */}
        <div className="mb-7 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Registered Customers
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {customers.length}
              </h2>

              <p className="mt-2 text-xs font-medium text-blue-600">
                Customer records in the database
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-4 text-blue-700">
              <Users size={30} />
            </div>
          </div>
        </div>

        {/* CUSTOMER TABLE */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
                <UserRound size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Registered Customers
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Customer contact and registration details
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center">
              <LoaderCircle
                className="mx-auto animate-spin text-blue-600"
                size={35}
              />
              <p className="mt-4 text-sm font-medium text-slate-600">
                Loading customers...
              </p>
            </div>

          ) : error ? (
            <div className="px-6 py-14 text-center">
              <AlertCircle
                className="mx-auto text-red-500"
                size={35}
              />
              <p className="mt-3 font-semibold text-slate-800">
                {error}
              </p>
              <button
                onClick={fetchCustomers}
                className="mt-5 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Try Again
              </button>
            </div>

          ) : customers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Users className="mx-auto text-slate-400" size={35} />
              <h3 className="mt-4 font-bold text-slate-800">
                No Customers Found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Registered customers will appear here.
              </p>
            </div>

          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left">
                <thead>
                  <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-4 font-semibold">ID</th>
                    <th className="px-5 py-4 font-semibold">Customer</th>
                    <th className="px-5 py-4 font-semibold">Email Address</th>
                    <th className="px-5 py-4 font-semibold">Phone Number</th>
                    <th className="px-5 py-4 font-semibold">Registered Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="transition hover:bg-blue-50/40"
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-slate-500">
                        #{customer.id}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                            {customer.full_name?.charAt(0)?.toUpperCase() || "U"}
                          </div>

                          <span className="font-semibold text-slate-800">
                            {customer.full_name}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-slate-400" />
                          {customer.email}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-slate-400" />
                          {customer.phone}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={16} className="text-slate-400" />
                          {customer.created_at
                            ? new Date(customer.created_at).toLocaleDateString()
                            : "Not available"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && customers.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
              <p className="text-xs font-medium text-slate-500">
                Showing {customers.length} registered customers
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
