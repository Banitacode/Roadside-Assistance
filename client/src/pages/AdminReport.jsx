
import React, { useEffect, useState } from "react";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  CheckCheck,
  IndianRupee,
  Users,
  Wrench,
  MessageSquareWarning,
  RefreshCw,
  LoaderCircle,
  AlertCircle,
  TrendingUp,
  ShieldCheck
} from "lucide-react";

export default function AdminReport() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("https://roadside-assistance-il83.onrender.com/admin/reports");

      if (!response.ok) {
        throw new Error("Unable to fetch reports. Please try again.");
      }

      const data = await response.json();
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex items-center gap-3 rounded-xl bg-white p-6 shadow-sm">
          <LoaderCircle className="animate-spin text-blue-600" size={25} />
          <p className="font-medium text-slate-600">Loading admin reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-5">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-3 text-red-500" size={42} />
          <h2 className="text-xl font-bold text-slate-800">
            Unable to Load Reports
          </h2>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
          <button
            onClick={fetchReports}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!reports) return null;

  const cards = [
    {
      title: "Total Bookings",
      value: Number(reports.bookings.total_bookings),
      icon: ClipboardList,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Pending Bookings",
      value: Number(reports.bookings.pending_bookings),
      icon: Clock,
      color: "bg-amber-50 text-amber-600"
    },
    {
      title: "Confirmed Bookings",
      value: Number(reports.bookings.confirmed_bookings),
      icon: CheckCircle,
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      title: "Completed Bookings",
      value: Number(reports.bookings.completed_bookings),
      icon: CheckCheck,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "Estimated Revenue",
      value: `₹${Number(reports.estimated_revenue).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "bg-green-50 text-green-700"
    },
    {
      title: "Total Customers",
      value: Number(reports.customers.total_customers),
      icon: Users,
      color: "bg-purple-50 text-purple-600"
    },
    {
      title: "Total Mechanics",
      value: Number(reports.mechanics.total_mechanics),
      icon: Wrench,
      color: "bg-orange-50 text-orange-600"
    },
    {
      title: "Total Complaints",
      value: Number(reports.complaints.total_complaints),
      icon: MessageSquareWarning,
      color: "bg-rose-50 text-rose-600"
    }
  ];

  const complaintStatuses = [
    {
      title: "Open",
      value: Number(reports.complaints.open_complaints),
      color: "text-red-600",
      background: "bg-red-50",
      dot: "bg-red-500"
    },
    {
      title: "In Progress",
      value: Number(reports.complaints.in_progress_complaints),
      color: "text-amber-600",
      background: "bg-amber-50",
      dot: "bg-amber-500"
    },
    {
      title: "Resolved",
      value: Number(reports.complaints.resolved_complaints),
      color: "text-emerald-600",
      background: "bg-emerald-50",
      dot: "bg-emerald-500"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
              <ShieldCheck size={18} />
              ADMIN MANAGEMENT
            </div>

            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Reports & Analytics
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Overview of bookings, customers, mechanics and complaints.
            </p>
          </div>

          <button
            onClick={fetchReports}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw size={17} />
            Refresh Reports
          </button>
        </div>

        {/* Summary heading */}
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-600" />
          <h2 className="text-lg font-bold text-slate-800">
            Project Overview
          </h2>
        </div>

        {/* Report cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>
                    <h3 className="mt-3 text-2xl font-bold text-slate-800">
                      {card.value}
                    </h3>
                  </div>

                  <div className={`rounded-xl p-3 ${card.color}`}>
                    <Icon size={25} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Complaint summary */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <MessageSquareWarning size={23} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Complaint Status Summary
              </h2>
              <p className="text-sm text-slate-500">
                Current status of customer complaints
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {complaintStatuses.map((item) => (
              <div
                key={item.title}
                className={`rounded-xl p-5 ${item.background}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
                  <p className="text-sm font-semibold text-slate-600">
                    {item.title}
                  </p>
                </div>

                <h3 className={`mt-3 text-3xl font-bold ${item.color}`}>
                  {item.value}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue note */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <IndianRupee className="mt-0.5 shrink-0 text-blue-600" size={20} />
          <p className="text-sm leading-6 text-slate-600">
            <span className="font-semibold text-slate-800">
              Revenue Information:{" "}
            </span>
            Estimated revenue is calculated from completed bookings and
            mechanic prices. Online payments are not processed by this
            project.
          </p>
        </div>

      </div>
    </div>
  );
}
