import { useState } from 'react';
import { Image, UtensilsCrossed, Home, MessageSquare, CalendarDays, Inbox, ExternalLink } from 'lucide-react';
import GalleryPanel from './panels/GalleryPanel';
import ServicesPanel from './panels/ServicesPanel';
import SiteSettingsPanel from './panels/SiteSettingsPanel';
import TestimonialsPanel from './panels/TestimonialsPanel';
import AvailabilityPanel from './panels/AvailabilityPanel';
import InquiriesPanel from './panels/InquiriesPanel';

const TABS = [
  { key: 'inquiries', label: 'Inquiries', Icon: Inbox, Panel: InquiriesPanel },
  { key: 'gallery', label: 'Gallery', Icon: Image, Panel: GalleryPanel },
  { key: 'services', label: 'Services', Icon: UtensilsCrossed, Panel: ServicesPanel },
  { key: 'settings', label: 'Hero & About', Icon: Home, Panel: SiteSettingsPanel },
  { key: 'testimonials', label: 'Testimonials', Icon: MessageSquare, Panel: TestimonialsPanel },
  { key: 'availability', label: 'Availability', Icon: CalendarDays, Panel: AvailabilityPanel },
];

const AdminDashboard = ({ email, onSignOut }) => {
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const ActivePanel = TABS.find((t) => t.key === activeTab).Panel;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-y-2 gap-x-4">
          <h1 className="text-lg sm:text-xl font-bold text-amber-600">Chef Mashua Admin</h1>
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-amber-600"
            >
              <span className="hidden sm:inline">View Site</span> <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-sm text-gray-400 hidden md:inline">{email}</span>
            <button
              onClick={onSignOut}
              className="text-sm text-gray-500 hover:text-amber-600"
            >
              Sign out
            </button>
          </div>
        </div>
        <nav className="max-w-5xl mx-auto px-4 flex gap-4 overflow-x-auto border-t border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 py-3 px-1 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === tab.key
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-amber-600'
              }`}
            >
              <tab.Icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <ActivePanel />
      </main>
    </div>
  );
};

export default AdminDashboard;
