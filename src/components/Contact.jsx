// Contact.jsx page
import {
  Phone,
  Instagram,
  Linkedin,
  MessageCircleMore,
  Smartphone,
  Mail,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Contact section for Chef-Mashua.
//
//  • Renders a grid of icon‑links (WhatsApp, Call, Instagram, etc.).
//  • Uses Tailwind utilities for spacing, colours, and hover effects.
//  • Each <a> has target="_blank" where needed and rel="noopener noreferrer"
//    for security best‑practice when opening new tabs.
//
const Contact = () => (
  <section
    id="contact"                               /* anchor ID for smooth‑scroll */
    className="py-20 bg-white text-gray-900"   /* section padding + colours   */
  >
    {/* ------ Fixed‑width container --------------------------------------- */}
    <div className="max-w-3xl mx-auto px-4 text-center">
      <h2 className="text-4xl font-bold mb-10">
        Get In Touch with Chef&nbsp;Mashua
      </h2>

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

export default Contact;
