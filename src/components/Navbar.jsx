import { useState } from "react";
import { Menu } from "lucide-react"; // or your icon library

const NAV_ITEMS = ["Home", "About", "Gallery", "Services", "Testimonials", "Availability", "Contact"];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white shadow z-50">
      <div className="max-w-6xl mx-auto px-0 md:px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-amber-600">Mashua The Chef</h1>

        {/* Desktop links */}
        <div className="hidden md:flex space-x-6">
          {NAV_ITEMS.map((item) => (
            <a
              href={`#${item.toLowerCase()}`}
              className="text-gray-700 hover:text-amber-600"
              key={item}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Mobile Hamburger Icon */}
        <button
          className="md:hidden p-1 ml-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="md:hidden px-0 pb-4 space-y-2 bg-white shadow">
          {NAV_ITEMS.map((item) => (
            <a
              href={`#${item.toLowerCase()}`}
              className="block text-gray-700 hover:text-amber-600"
              key={item}
              onClick={() => setIsOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
