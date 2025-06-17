import React, { useState } from 'react';
import { Menu, X } from 'lucide-react'; // Optional: Use `react-icons` if preferred

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const links = ["Home", "About", "Gallery", "Services", "Testimonials", "Contact"];

  return (
    <nav className="fixed top-0 w-full bg-white shadow z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-amber-600">Mashua The Chef</h1>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          {links.map((item) => (
            <a
              href={`#${item.toLowerCase()}`}
              className="text-gray-700 hover:text-amber-600 transition"
              key={item}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white px-4 pb-4 space-y-2">
          {links.map((item) => (
            <a
              href={`#${item.toLowerCase()}`}
              className="block text-gray-700 hover:text-amber-600 transition"
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
