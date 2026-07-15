import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (
      email === import.meta.env.VITE_ADMIN_EMAIL &&
      password === import.meta.env.VITE_ADMIN_PASSWORD
    ) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid email or password.');
    }
  }

  function fillAdmin() {
    setEmail(import.meta.env.VITE_ADMIN_EMAIL || '');
    setPassword(import.meta.env.VITE_ADMIN_PASSWORD || '');
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100 text-center">
        <h1 className="text-lg font-bold text-gray-900">Sign In</h1>
        <p className="text-sm text-gray-500 mt-0.5">Access the BFP Ipil Station Management System</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="you@bfp.gov.ph" required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'} value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="••••••••" required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
            <span className="text-gray-600">Remember me</span>
          </label>
          <Link to="/auth/forgot" className="text-red-700 hover:text-red-800 font-medium text-sm">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="w-full py-2.5 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">
          Sign In
        </button>
      </form>

      <div className="px-6 pb-2 text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-red-700 hover:text-red-800 font-medium">Register here</Link>
      </div>

      {/* Admin Quick Fill */}
      {import.meta.env.VITE_ADMIN_EMAIL && (
        <div className="border-t border-gray-100">
          <div className="px-6 py-4">
            <button
              type="button"
              onClick={fillAdmin}
              className="w-full flex items-center justify-center gap-2 px-3 py-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <Shield size={16} className="text-red-600" />
              Sign in as Administrator
            </button>
          </div>
        </div>
      )}

      <div className="px-6 pb-5 text-center">
        <Link to="/public" className="text-xs text-gray-400 hover:text-gray-600 inline-flex items-center gap-1">
          <ArrowLeft size={11} /> Back to public portal
        </Link>
      </div>
    </div>
  );
}
