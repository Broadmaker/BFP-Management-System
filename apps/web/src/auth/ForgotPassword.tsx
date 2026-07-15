import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100 text-center">
        <h1 className="text-lg font-bold text-gray-900">Reset Password</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {sent ? 'Reset link sent' : 'Enter your registered email address'}
        </p>
      </div>

      {!sent ? (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="you@example.com" required
            />
            <p className="text-xs text-gray-400 mt-1">
              We'll send a password reset link to your email. The link expires in 24 hours.
            </p>
          </div>
          <button type="submit" className="w-full py-2.5 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">
            Send Reset Link
          </button>
        </form>
      ) : (
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
            <Mail size={24} />
          </div>
          <h2 className="text-base font-semibold text-gray-900 mb-1">Check your email</h2>
          <p className="text-sm text-gray-500 mb-2">
            We've sent a password reset link to <strong className="text-gray-900">{email}</strong>.
          </p>
          <p className="text-xs text-gray-400 mb-5">
            Didn't receive the email? Check your spam folder or{' '}
            <button onClick={() => setSent(false)} className="text-red-700 hover:text-red-800 font-medium">try again</button>.
          </p>
          <button onClick={() => setSent(false)} className="w-full py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
            Send to a different email
          </button>
        </div>
      )}

      <div className="px-6 pb-5 text-center">
        <Link to="/auth/login" className="text-sm text-red-700 hover:text-red-800 font-medium inline-flex items-center gap-1">
          <ArrowLeft size={14} /> Back to sign in
        </Link>
      </div>
    </div>
  );
}
