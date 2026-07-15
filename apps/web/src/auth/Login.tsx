import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Shield, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const demoAccounts = [
  { label: 'Station Commander', email: 'commander@bfp.gov.ph', role: 'Station Commander', icon: Shield },
  { label: 'Fire Officer', email: 'fire.officer@bfp.gov.ph', role: 'Fire Officer', icon: User },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selected, setSelected] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email && password) navigate('/admin/dashboard');
  }

  function selectDemo(demo: typeof demoAccounts[number]) {
    setEmail(demo.email);
    setPassword('demo1234');
    setSelected(demo.label);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100 text-center">
        <h1 className="text-lg font-bold text-gray-900">Sign In</h1>
        <p className="text-sm text-gray-500 mt-0.5">Access the BFP Ipil Station Management System</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

      {/* Demo Access */}
      <div className="border-t border-gray-100">
        <div className="px-6 py-4">
          <p className="text-xs text-gray-400 text-center mb-3">
            <span className="font-medium text-gray-500">Demo Access</span> — Click a role then Sign In
          </p>
          <div className="grid grid-cols-2 gap-3">
            {demoAccounts.map((demo) => {
              const active = selected === demo.label;
              return (
                <button
                  key={demo.label}
                  type="button"
                  onClick={() => selectDemo(demo)}
                  className={`flex items-center gap-2.5 px-3 py-3 border rounded-lg text-left transition-all ${
                    active
                      ? 'border-red-600 bg-red-50 ring-1 ring-red-600'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    active ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <demo.icon size={16} />
                  </div>
                  <div>
                    <div className={`text-xs font-medium ${active ? 'text-red-700' : 'text-gray-900'}`}>{demo.label}</div>
                    <div className="text-[10px] text-gray-400">{demo.role}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-6 pb-5 text-center">
        <Link to="/public" className="text-xs text-gray-400 hover:text-gray-600 inline-flex items-center gap-1">
          <ArrowLeft size={11} /> Back to public portal
        </Link>
      </div>
    </div>
  );
}
