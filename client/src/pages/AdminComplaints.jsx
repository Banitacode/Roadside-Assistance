
import React, { useEffect, useState } from "react";
import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  AlertCircle,
  UserRound,
  Phone,
  CalendarDays,
  Hash,
  MessageSquareText,
  RefreshCw,
  ShieldCheck,
  LoaderCircle
} from "lucide-react";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [responses, setResponses] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  const fetchComplaints = async () => {
    try {
      setError("");

      const response = await fetch("http://localhost:3001/complaints");

      if (!response.ok) {
        throw new Error("Unable to fetch complaints");
      }

      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error("Fetch complaints error:", error);
      setError("Unable to load complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateComplaint = async (id, status) => {
    try {
      setUpdatingId(id);

      const response = await fetch(
        `http://localhost:3001/complaints/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status,
            admin_response: responses[id] || ""
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update complaint");
      }

      setComplaints((previous) =>
        previous.map((item) =>
          item.id === id ? data.complaint : item
        )
      );

      setResponses((previous) => ({
        ...previous,
        [id]: data.complaint.admin_response || ""
      }));

      alert(data.message);
    } catch (error) {
      console.error("Update complaint error:", error);
      alert(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const openCount = complaints.filter(
    (item) => item.status === "open"
  ).length;

  const progressCount = complaints.filter(
    (item) => item.status === "in_progress"
  ).length;

  const resolvedCount = complaints.filter(
    (item) => item.status === "resolved"
  ).length;

  const getStatusStyle = (status) => {
    switch (status) {
      case "open":
        return "bg-red-50 text-red-700 border-red-200";

      case "in_progress":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const formatStatus = (status) => {
    return status.replace("_", " ");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* PAGE HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
              <ShieldCheck size={17} />
              ADMIN MANAGEMENT
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Manage Complaints
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Review customer complaints and manage their resolution.
            </p>
          </div>

          <button
            onClick={fetchComplaints}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* STATISTICS */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Open Complaints
                </p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  {openCount}
                </h2>
              </div>

              <div className="rounded-xl bg-red-50 p-3 text-red-600">
                <AlertCircle size={25} />
              </div>
            </div>

            <p className="mt-3 text-xs font-medium text-red-600">
              Awaiting attention
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  In Progress
                </p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  {progressCount}
                </h2>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Clock3 size={25} />
              </div>
            </div>

            <p className="mt-3 text-xs font-medium text-amber-600">
              Currently being handled
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Resolved Complaints
                </p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  {resolvedCount}
                </h2>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 size={25} />
              </div>
            </div>

            <p className="mt-3 text-xs font-medium text-emerald-600">
              Successfully resolved
            </p>
          </div>

        </div>

        {/* COMPLAINT LIST HEADER */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Customer Complaints
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review details and submit an admin response.
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
            {complaints.length} Total
          </span>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <LoaderCircle className="mx-auto animate-spin text-blue-600" size={35} />
            <p className="mt-4 font-medium text-slate-700">
              Loading complaints...
            </p>
          </div>

        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center shadow-sm">
            <AlertCircle className="mx-auto text-red-500" size={35} />
            <p className="mt-3 font-semibold text-slate-800">
              {error}
            </p>
            <button
              onClick={fetchComplaints}
              className="mt-5 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Try Again
            </button>
          </div>

        ) : complaints.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <ClipboardList size={30} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-800">
              No Complaints Yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Customer complaints will appear here when submitted.
            </p>
          </div>

        ) : (
          <div className="space-y-5">

            {complaints.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* CARD HEADER */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-100 p-2.5 text-blue-700">
                      <MessageSquareText size={21} />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        Complaint #{item.id}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Booking ID: {item.booking_id}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${getStatusStyle(item.status)}`}
                  >
                    {formatStatus(item.status)}
                  </span>
                </div>

                {/* CUSTOMER DETAILS */}
                <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">

                  <div className="flex items-start gap-3">
                    <UserRound className="mt-0.5 text-blue-600" size={19} />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Customer
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {item.customer_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 text-blue-600" size={19} />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Phone Number
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {item.phone_number}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 text-blue-600" size={19} />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Submitted On
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleString()
                          : "Date unavailable"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:col-span-2 lg:col-span-3">
                    <Hash className="mt-0.5 text-blue-600" size={19} />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Booking Reference
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        #{item.booking_id}
                      </p>
                    </div>
                  </div>

                </div>

                {/* COMPLAINT MESSAGE */}
                <div className="mx-5 mb-5 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:mx-6">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Complaint Description
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {item.complaint}
                  </p>
                </div>

                {/* PREVIOUS RESPONSE */}
                {item.admin_response && (
                  <div className="mx-5 mb-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4 sm:mx-6">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-700">
                      Previous Admin Response
                    </p>
                    <p className="whitespace-pre-wrap text-sm leading-6 text-emerald-900">
                      {item.admin_response}
                    </p>
                  </div>
                )}

                {/* ADMIN RESPONSE FORM */}
                <div className="border-t border-slate-100 p-5 sm:px-6">
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
                    <MessageSquareText size={17} className="text-blue-600" />
                    Admin Response
                  </label>

                  <textarea
                    rows="3"
                    value={responses[item.id] ?? item.admin_response ?? ""}
                    onChange={(event) =>
                      setResponses((previous) => ({
                        ...previous,
                        [item.id]: event.target.value
                      }))
                    }
                    placeholder="Write a response to the customer..."
                    className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">

                    <button
                      onClick={() =>
                        updateComplaint(item.id, "in_progress")
                      }
                      disabled={updatingId === item.id}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updatingId === item.id ? (
                        <LoaderCircle size={17} className="animate-spin" />
                      ) : (
                        <Clock3 size={17} />
                      )}
                      Mark In Progress
                    </button>

                    <button
                      onClick={() =>
                        updateComplaint(item.id, "resolved")
                      }
                      disabled={updatingId === item.id}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updatingId === item.id ? (
                        <LoaderCircle size={17} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={17} />
                      )}
                      Resolve Complaint
                    </button>

                  </div>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}
