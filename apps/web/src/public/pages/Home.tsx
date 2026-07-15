import { Link } from 'react-router-dom';
import { ClipboardList, Calendar, Users, AlertTriangle, Shield, Phone, ArrowRight, FileText, Building2 } from 'lucide-react';

const services = [
  {
    title: 'Submit Service Request',
    desc: 'Apply for Fire Safety Inspection Certificates (FSIC), renewals, and other documents online.',
    icon: FileText,
    href: '/public/services',
    color: 'from-red-600 to-red-700',
  },
  {
    title: 'Schedule Inspection',
    desc: 'Book or reschedule your fire safety inspection appointment with our office.',
    icon: Calendar,
    href: '/public/appointments',
    color: 'from-blue-600 to-blue-700',
  },
  {
    title: 'Register for Seminars',
    desc: 'Browse upcoming fire prevention seminars, drills, and training events in Ipil.',
    icon: Users,
    href: '/public/seminars',
    color: 'from-green-600 to-green-700',
  },
  {
    title: 'Report Fire Hazard',
    desc: 'Submit a hazard report with location details for investigation and action.',
    icon: AlertTriangle,
    href: '/public/hazards',
    color: 'from-orange-600 to-orange-700',
  },
];

const stats = [
  { value: '27+', label: 'Barangays Served', sub: 'Municipality of Ipil' },
  { value: '500+', label: 'Active Citizens', sub: 'Registered users' },
  { value: '98%', label: 'Response Rate', sub: 'Within 24 hours' },
  { value: '24/7', label: 'Hazard Reporting', sub: 'Always available' },
];

export default function PublicHome() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3.5 py-1 text-xs font-medium text-gray-300 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Online services available
              </div>
              <div className="text-[10px] font-medium text-red-400 uppercase tracking-[0.2em] mb-2">
                Republic of the Philippines
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
                Bureau of Fire Protection
              </h1>
              <p className="text-xl text-red-300 font-medium mb-2">Ipil Station</p>
              <p className="text-base text-gray-300 leading-relaxed max-w-xl mb-8">
                Your partner in fire safety and emergency response. Submit requests, schedule inspections,
                register for seminars, and report hazards — all in one place.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/public/services"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors shadow-lg shadow-red-900/20"
                >
                  Get Started <ArrowRight size={14} />
                </Link>
                <Link
                  to="/auth/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-colors border border-white/10"
                >
                  Create Account
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-56 h-56 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                  <img src="/bfp-logo.png" alt="BFP Official Seal" className="w-44 h-44 object-contain" />
                </div>
                <div className="absolute -bottom-3 -right-3 w-32 h-32 rounded-xl bg-red-700/20 border border-red-700/20 flex items-center justify-center text-center text-red-300 text-xs font-medium leading-tight p-3 backdrop-blur-sm">
                  "Save Lives and Properties"
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-red-700">{s.value}</div>
                <div className="text-sm font-medium text-gray-900 mt-0.5">{s.label}</div>
                <div className="text-xs text-gray-400">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Online Services */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <div className="text-xs font-medium text-red-600 uppercase tracking-wider mb-1">Online Services</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">What would you like to do?</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Reduce walk-in transactions. Apply, book, register, and report from anywhere in Ipil.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((s) => (
              <Link
                key={s.title}
                to={s.href}
                className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-transparent transition-all duration-200"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-sm`}>
                  <s.icon size={20} className="text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5 group-hover:text-red-700 transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{s.desc}</p>
                <span className="text-xs font-medium text-red-600 group-hover:text-red-700 inline-flex items-center gap-1">
                  Proceed <ArrowRight size={11} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mandate Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-medium text-red-600 uppercase tracking-wider mb-1">Our Mandate</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Fire Prevention, Suppression, and Emergency Response</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                The Bureau of Fire Protection Ipil Station is committed to ensuring the safety of lives and properties
                in the Municipality of Ipil, Zamboanga Sibugay through comprehensive fire prevention programs,
                rapid emergency response, and community engagement.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Shield, label: 'Fire Prevention', desc: 'Inspections and seminars' },
                  { icon: AlertTriangle, label: 'Emergency Response', desc: '24/7 dispatch team' },
                  { icon: ClipboardList, label: 'Code Enforcement', desc: 'Fire code compliance' },
                  { icon: Building2, label: 'Community Service', desc: 'Public assistance' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-lg">
                    <item.icon size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-gray-900">{item.label}</div>
                      <div className="text-[11px] text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Phone size={18} className="text-red-400" />
                <span className="text-xs font-medium text-red-400 uppercase tracking-wider">Emergency Hotline</span>
              </div>
              <div className="text-5xl font-bold mb-2">160</div>
              <p className="text-sm text-gray-400 mb-5">Available 24/7 for fire emergencies and life-threatening situations.</p>
              <div className="border-t border-gray-700 pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Station Hotline</span>
                  <span className="font-medium">(062) 333-1234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email</span>
                  <span className="font-medium">ipil@bfp.gov.ph</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Address</span>
                  <span className="font-medium text-right">Poblacion, Ipil<br />Zamboanga Sibugay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-red-700 to-red-800 py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Join Us in Building a Fire-Safe Ipil</h2>
          <p className="text-sm text-red-200 mb-6 max-w-xl mx-auto">
            Stay informed. Attend our seminars. Report hazards. Together, we can prevent fire incidents.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/public/seminars" className="px-5 py-2 bg-white text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">
              View Upcoming Seminars
            </Link>
            <Link to="/public/hazards" className="px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-500 transition-colors border border-red-500">
              Report a Hazard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Notes / Transparency */}
      <section className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center text-xs text-gray-400">
          <p className="mb-1">
            This online portal is maintained by the Bureau of Fire Protection — Ipil Station.
            For concerns, feedback, or inquiries, please contact us at (062) 333-1234 or ipil@bfp.gov.ph.
          </p>
          <p>
            Data privacy notice: All personal information collected through this portal is
            protected under the Data Privacy Act of 2012 (RA 10173).
          </p>
        </div>
      </section>
    </div>
  );
}
