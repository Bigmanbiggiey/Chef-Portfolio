import {
  Phone,
  Instagram,
  Linkedin,
  MessageCircleMore,
  Smartphone,
  Mail
} from 'lucide-react';

const Contact = () => (
  <section id="contact" className="py-20 bg-white text-gray-900">
    <div className="max-w-3xl mx-auto px-4 text-center">
      <h2 className="text-4xl font-bold mb-10">Get In Touch with Chef Mashua</h2>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 justify-items-center">
        <a
          href="https://wa.me/254704619182"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center space-y-2 hover:text-amber-600 transition"
        >
          <Smartphone size={40} />
          <span>WhatsApp</span>
        </a>

        <a
          href="tel:+254704619182"
          className="flex flex-col items-center space-y-2 hover:text-amber-600 transition"
        >
          <Phone size={40} />
          <span>Call</span>
        </a>

        <a
          href="https://instagram.com/mash_kifaru"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center space-y-2 hover:text-amber-600 transition"
        >
          <Instagram size={40} />
          <span>Instagram</span>
        </a>

        <a
          href="https://linkedin.com/in/meshack-mashua-514a9a299"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center space-y-2 hover:text-amber-600 transition"
        >
          <Linkedin size={40} />
          <span>LinkedIn</span>
        </a>

        <a
          href="https://tiktok.com/@faru.boy7"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center space-y-2 hover:text-amber-600 transition"
        >
          <MessageCircleMore size={40} />
          <span>TikTok</span>
        </a>

        <a
          href="mailto:meshackmashua@gmail.com"
          className="flex flex-col items-center space-y-2 hover:text-amber-600 transition"
        >
          <Mail size={40} />
          <span>Email</span>
        </a>
      </div>
    </div>
  </section>
);

export default Contact;
