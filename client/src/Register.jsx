
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmedPassword: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmedPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('https://roadside-assistance-il83.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);
      navigate('/Login');

    } catch (error) {
      console.log('Registration error:', error);
      alert('Unable to connect the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-lg">

        {/* Branding */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-900/40 mb-4">
            <Wrench size={34} className="text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white">
            RoadAssistant
          </h1>

          <p className="text-blue-200 mt-2 text-sm">
            Your reliable roadside assistance partner.
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-7 sm:p-9">

          <div className="text-center mb-7">
            <h2 className="text-2xl font-bold text-slate-900">
              Create Your Account
            </h2>

            <p className="text-slate-500 text-sm mt-2">
              Register to access roadside assistance services.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>

              <div className="relative">
                <User size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full border border-slate-300 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full border border-slate-300 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number
              </label>

              <div className="relative">
                <Phone size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full border border-slate-300 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full border border-slate-300 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <Lock size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="password"
                  name="confirmedPassword"
                  value={formData.confirmedPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full border border-slate-300 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 disabled:bg-slate-400 transition shadow-md mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight size={19} />}
            </button>

          </form>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-5">
            <ShieldCheck size={16} className="text-green-600" />
            Your account details are securely registered.
          </div>

          <div className="border-t border-slate-200 mt-6 pt-5 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link
                to="/Login"
                className="text-blue-600 font-bold hover:text-blue-800"
              >
                Login Now
              </Link>
            </p>
          </div>

        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          RoadAssistant · Your roadside support partner
        </p>

      </div>
    </div>
  );
}
