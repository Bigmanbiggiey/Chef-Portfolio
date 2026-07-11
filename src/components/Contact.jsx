// Contact.jsx page
import { useState } from 'react';
import {
  Phone,
  Instagram,
  Linkedin,
  MessageCircleMore,
  Smartphone,
  Mail,
} from 'lucide-react';
import { submitContact } from '../lib/contactApi';

const initialForm = { name: '', email: '', message: '', honeypot: '' };

// ---------------------------------------------------------------------------
// Contact section for Chef-Mashua.
//
//  • Renders a form that emails submissions via a Netlify Function, plus a
//    grid of icon‑links (WhatsApp, Call, Instagram, etc.).
//  • Uses Tailwind utilities for spacing, colours, and hover effects.
//  • Each <a> has target="_blank" where needed and rel="noopener noreferrer"
//    for security best‑practice when opening new tabs.
//
const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await submitContact(form);
      setForm(initialForm);
      setStatus('success');
    } catch (err) {
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  return (
  <section
    id="contact"                               /* anchor ID for smooth‑scroll */
    className="py-20 bg-white text-gray-900"   /* section padding + colours   */
  >
    {/* ------ Fixed‑width container --------------------------------------- */}
    <div className="max-w-3xl mx-auto px-4 text-center">
      <h2 className="text-4xl font-bold mb-10">
        Get In Touch with Chef&nbsp;Mashua
      </h2>

      {/* ------ Contact form ------------------------------------------------ */}
      <form onSubmit={handleSubmit} className="text-left mb-16 space-y-4">
        {/* Honeypot field: hidden from real visitors, bots tend to fill it in */}
        <input
          type="text"
          name="honeypot"
          value={form.honeypot}
          onChange={handleChange}
          className="absolute -left-[9999px]"
          aria-hidden="true"
          tabIndex="-1"
          autoComplete="off"
        />

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={100}
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            maxLength={5000}
            value={form.message}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-medium rounded-full shadow transition"
        >
          {status === 'loading' ? 'Sending…' : 'Send Message'}
        </button>

        {status === 'success' && (
          <p className="text-green-600 font-medium">Thanks — I&rsquo;ll get back to you soon!</p>
        )}
        {status === 'error' && (
          <p className="text-red-600 font-medium">{errorMessage}</p>
        )}
      </form>

      {/* ------ Grid of icon links ---------------------------------------- */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3
                      justify-items-center"
      >
        {/* ========= WhatsApp =========================================== */}
        <a
          href="https://wa.me/254704619182"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex flex-col items-center space-y-2
                     hover:text-amber-600 transition"
        >
          <Smartphone size={40} />
          <span>WhatsApp</span>
        </a>

        {/* ========= Direct phone call ================================== */}
        <a
          href="tel:+254704619182"
          aria-label="Call Chef Mashua"
          className="flex flex-col items-center space-y-2
                     hover:text-amber-600 transition"
        >
          <Phone size={40} />
          <span>Call</span>
        </a>

        {/* ========= Instagram ========================================== */}
        <a
          href="https://instagram.com/mash_kifaru"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Instagram profile"
          className="flex flex-col items-center space-y-2
                     hover:text-amber-600 transition"
        >
          <Instagram size={40} />
          <span>Instagram</span>
        </a>

        {/* ========= LinkedIn =========================================== */}
        <a
          href="https://linkedin.com/in/meshack-mashua-514a9a299"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit LinkedIn profile"
          className="flex flex-col items-center space-y-2
                     hover:text-amber-600 transition"
        >
          <Linkedin size={40} />
          <span>LinkedIn</span>
        </a>

        {/* ========= TikTok ============================================= */}
        <a
          href="https://tiktok.com/@faru.boy7"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit TikTok profile"
          className="flex flex-col items-center space-y-2
                     hover:text-amber-600 transition"
        >
          <MessageCircleMore size={40} />
          <span>TikTok</span>
        </a>

        {/* ========= Email ============================================== */}
        <a
          href="mailto:meshackmashua@gmail.com"
          aria-label="Send an email"
          className="flex flex-col items-center space-y-2
                     hover:text-amber-600 transition"
        >
          <Mail size={40} />
          <span>Email</span>
        </a>
      </div>
    </div>
  </section>
  );
};

export default Contact;
