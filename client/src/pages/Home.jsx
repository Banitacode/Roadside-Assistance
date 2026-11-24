import { useLocation, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  // Receive logged-in user information from CustomerDashboard
  const user = location.state?.user;

  const services = [
    {
      icon: "🏍️",
      title: "Bike Repair",
      description:
        "Get quick roadside assistance for bike breakdowns and unexpected vehicle problems.",
      service: "Bike Repair",
      color: "bg-blue-50",
    },
    {
      icon: "🚗",
      title: "Car Repair",
      description:
        "Get reliable assistance when your car breaks down or needs on-site repair.",
      service: "Car Repair",
      color: "bg-indigo-50",
    },
    {
      icon: "🚛",
      title: "Towing Service",
      description:
        "Move your damaged or broken vehicle safely with roadside towing assistance.",
      service: "Towing Service",
      color: "bg-orange-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-2xl text-white">
              🚘
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Road<span className="text-blue-700">Assistant</span>
              </h1>
              <p className="text-xs text-slate-500">
                Your roadside support partner
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/Login")}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/Register")}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
            >
              Register
            </button>
          </div>

        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl"></div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:px-10 md:py-28">

          <div>
            <span className="inline-flex rounded-full border border-blue-300/30 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-100">
              🛠️ Reliable Roadside Assistance
            </span>

            <h2 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
              Help is just a
              <span className="block text-cyan-300">
                click away.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-8 text-blue-100 md:text-lg">
              Vehicle trouble on the road? Find roadside assistance,
              connect with mechanics and get the support you need.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <button
                onClick={() =>
                  navigate("/Booking", {
                    state: { user },
                  })
                }
                className="rounded-xl bg-cyan-400 px-7 py-3.5 font-bold text-slate-950 shadow-lg transition hover:-translate-y-1 hover:bg-cyan-300"
              >
                Book Assistance →
              </button>

              <button
                onClick={() => navigate("/Register")}
                className="rounded-xl border border-white/40 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                Get Started
              </button>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-blue-100">
              <span>✓ Verified mechanics</span>
              <span>✓ Multiple services</span>
              <span>✓ Easy booking</span>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-sm md:p-9">
              <div className="text-center">
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-white/10 text-6xl">
                  🚙
                </div>

                <h3 className="mt-6 text-2xl font-bold text-white">
                  Roadside Help
                </h3>

                <p className="mt-2 leading-7 text-blue-100">
                  From unexpected breakdowns to towing support,
                  get connected with roadside assistance.
                </p>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/10 p-4 text-center">
                  <div className="text-2xl">🔧</div>
                  <p className="mt-2 text-sm font-semibold text-white">
                    Repair Support
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 p-4 text-center">
                  <div className="text-2xl">📍</div>
                  <p className="mt-2 text-sm font-semibold text-white">
                    Location Support
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">

        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-blue-700">
            What We Offer
          </span>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Our Roadside Services
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-500">
            Choose the assistance you need and submit your booking
            request in just a few simple steps.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">

          {services.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl"
            >
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.color} text-4xl transition group-hover:scale-110`}>
                {item.icon}
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-3 min-h-20 leading-7 text-slate-500">
                {item.description}
              </p>

              <button
                onClick={() =>
                  navigate("/Booking", {
                    state: {
                      user,
                      service: item.service,
                    },
                  })
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
              >
                Book Now
                <span>→</span>
              </button>
            </div>
          ))}

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-10">

          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Simple Process
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
              How It Works
            </h2>

            <p className="mt-4 text-slate-500">
              Get roadside assistance in three simple steps.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">

            {[
              {
                number: "01",
                icon: "📝",
                title: "Book a Service",
                description: "Choose your service and provide your vehicle and location details.",
              },
              {
                number: "02",
                icon: "🔍",
                title: "Find a Mechanic",
                description: "View available verified mechanics and their estimated arrival time.",
              },
              {
                number: "03",
                icon: "🛠️",
                title: "Get Assistance",
                description: "Connect with your assigned mechanic and get the required help.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="rounded-2xl bg-slate-50 p-8 text-center transition hover:shadow-lg"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
                  {step.icon}
                </div>

                <p className="mt-5 text-sm font-bold tracking-widest text-blue-700">
                  STEP {step.number}
                </p>

                <h3 className="mt-2 text-xl font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  {step.description}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-blue-800 px-6 py-16 text-center">
        <h2 className="text-3xl font-extrabold text-white md:text-4xl">
          Need roadside assistance?
        </h2>

        <p className="mx-auto mt-4 max-w-xl leading-7 text-blue-100">
          Don't let vehicle trouble interrupt your journey.
          Book the assistance you need.
        </p>

        <button
          onClick={() =>
            navigate("/Booking", {
              state: { user },
            })
          }
          className="mt-8 rounded-xl bg-white px-8 py-3.5 font-bold text-blue-800 shadow-lg transition hover:-translate-y-1 hover:bg-blue-50"
        >
          Book Your Service →
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 px-6 py-8 text-center">
        <h3 className="text-xl font-bold text-white">
          Road<span className="text-cyan-400">Assistant</span>
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Your roadside help, just a click away!
        </p>

        <div className="mt-5 border-t border-slate-800 pt-5 text-xs text-slate-500">
          © {new Date().getFullYear()} Road Assistant. All rights reserved.
        </div>
      </footer>

    </div>
  );
}