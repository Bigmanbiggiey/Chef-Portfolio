import { useState } from 'react';
import GalleryPanel from './panels/GalleryPanel';
import ServicesPanel from './panels/ServicesPanel';
import SiteSettingsPanel from './panels/SiteSettingsPanel';
import TestimonialsPanel from './panels/TestimonialsPanel';
import AvailabilityPanel from './panels/AvailabilityPanel';

const TABS = [
  { key: 'gallery', label: 'Gallery', Panel: GalleryPanel },
  { key: 'services', label: 'Services', Panel: ServicesPanel },
  { key: 'settings', label: 'Hero & About', Panel: SiteSettingsPanel },
  { key: 'testimonials', label: 'Testimonials', Panel: TestimonialsPanel },
  { key: 'availability', label: 'Availability', Panel: AvailabilityPanel },
];

const AdminDashboard = ({ onSignOut }) => {
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const ActivePanel = TABS.find((t) => t.key === activeTab).Panel;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-amber-600">Chef Mashua Admin</h1>
          <button
            onClick={onSignOut}
            className="text-sm text-gray-500 hover:text-amber-600"
          >
            Sign out
          </button>
        </div>
        <nav className="max-w-5xl mx-auto px-4 flex gap-4 overflow-x-auto border-t border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 px-1 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === tab.key
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-amber-600'
              }`}
            >
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
