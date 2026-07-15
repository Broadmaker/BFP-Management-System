import { Phone, Shield, HelpCircle, MapPin, Mail, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const contacts = [
  { label: 'Emergency Hotline', value: '160', icon: Phone, desc: 'Available 24/7 for fire emergencies' },
  { label: 'Station Hotline', value: '(062) 333-1234', icon: Phone, desc: 'Office hours: 8:00 AM - 5:00 PM' },
  { label: 'Email Address', value: 'ipil@bfp.gov.ph', icon: Mail, desc: 'For inquiries and document requests' },
  { label: 'Office Address', value: 'Poblacion, Ipil, Zamboanga Sibugay', icon: MapPin, desc: 'Visit us during office hours' },
];

const faqs = [
  { q: 'What is the FSIC and who needs it?', a: 'The Fire Safety Inspection Certificate (FSIC) is required for all businesses, commercial establishments, and buildings before they can operate or occupy the premises. It certifies that the establishment complies with the Fire Code of the Philippines (RA 9514).' },
  { q: 'How do I schedule an inspection?', a: 'You can schedule an inspection through our online portal under Services > Inspection Appointments, or visit the BFP Ipil Station in person. Walk-in scheduling is also available during office hours.' },
  { q: 'What should I do during a fire?', a: 'Stay calm. Evacuate immediately using the nearest exit. Call 160. Do not use elevators. Proceed to your designated evacuation area. Do not go back for belongings.' },
  { q: 'How long is the FSIC valid?', a: 'The FSIC is valid for one (1) year from the date of issuance and must be renewed before the expiry date to avoid penalties.' },
  { q: 'Can I report a hazard anonymously?', a: 'Yes. You can submit a hazard report through our online portal without providing your name or contact information. However, providing contact details helps us follow up if we need additional information.' },
  { q: 'How do I register for a seminar?', a: 'Browse our Seminars page, select an event with available slots, and complete the online registration form. You will receive a confirmation with the event details.' },
  { q: 'What are the office hours of BFP Ipil Station?', a: 'Our office is open Monday to Friday, 8:00 AM to 5:00 PM, excluding holidays. Emergency services are available 24/7.' },
  { q: 'How do I get a copy of an incident report?', a: 'You may request a certified copy of an incident report through our Document Request service or visit the station in person with a valid ID.' },
];

const tips = [
  { icon: AlertTriangle, title: 'Check Electrical Wiring', desc: 'Replace frayed or damaged cords immediately. Avoid overloading outlets.' },
  { icon: AlertTriangle, title: 'Never Leave Cooking Unattended', desc: 'Keep flammable items away from the stove. Turn off appliances when not in use.' },
  { icon: AlertTriangle, title: 'Install Smoke Alarms', desc: 'Install on every floor. Test monthly and replace batteries annually.' },
  { icon: AlertTriangle, title: 'Keep Fire Extinguishers Accessible', desc: 'Learn the PASS technique: Pull, Aim, Squeeze, Sweep.' },
  { icon: AlertTriangle, title: 'Plan a Fire Escape Route', desc: 'Practice with your family. Identify two ways out of every room.' },
  { icon: AlertTriangle, title: 'Store Flammables Properly', desc: 'Keep LPG tanks, gasoline, and other flammables in well-ventilated areas away from heat sources.' },
];

export default function PublicInfo() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
      <div className="text-xs text-gray-400 mb-1">
        <Link to="/public" className="hover:text-red-600">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-gray-600">Information</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Information</h1>
        <p className="text-sm text-gray-500 mt-1">
          Fire prevention advisories, frequently asked questions, and contact information.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {contacts.map((c) => (
          <div key={c.label} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-red-200 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-700 flex items-center justify-center mb-3">
              <c.icon size={16} />
            </div>
            <div className="text-xs text-gray-500 mb-0.5">{c.label}</div>
            <div className="text-sm font-semibold text-gray-900 mb-1">{c.value}</div>
            <div className="text-[11px] text-gray-400">{c.desc}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        {/* Fire Prevention Tips */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield size={15} className="text-red-600" /> Fire Prevention Tips
          </h2>
          <div className="space-y-3">
            {tips.map((tip) => (
              <div key={tip.title} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <tip.icon size={14} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-0.5">{tip.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HelpCircle size={15} className="text-red-600" /> Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <details key={faq.q} className="bg-white border border-gray-200 rounded-lg group">
                <summary className="px-4 py-3.5 text-sm font-medium text-gray-900 cursor-pointer flex items-center justify-between list-none hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="pr-4">{faq.q}</span>
                  <HelpCircle size={14} className="text-gray-400 flex-shrink-0 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-red-700 to-red-800 rounded-2xl p-6 lg:p-8 text-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold mb-1">Still have questions?</h2>
            <p className="text-sm text-red-200">Contact us and we will be happy to assist you.</p>
          </div>
          <div className="flex gap-3">
            <a href="tel:160" className="px-5 py-2.5 bg-white text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2">
              <Phone size={14} /> Call 160
            </a>
            <a href="tel:+6263331234" className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-500 transition-colors border border-red-500">
              (062) 333-1234
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
