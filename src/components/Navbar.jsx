import { useState } from 'react';
import { Menu, X } from 'lucide-react'; // lucide-react icons

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white shadow z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo and Menu Button */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-amber-600">Mashua The Chef</h1>
          {/* Hamburger Icon (shown on small screens) */}
          <button
            className="md:hidden ml-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          {["Home", "About", "Gallery", "Services", "Testimonials", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-gray-700 hover:text-amber-600"
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white px-4 pb-4 space-y-2">
          {["Home", "About", "Gallery", "Services", "Testimonials", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="block text-gray-700 hover:text-amber-600"
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
