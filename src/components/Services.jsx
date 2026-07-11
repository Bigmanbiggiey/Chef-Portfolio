import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { publicUrlFor } from '../lib/media';

// --- image imports -----------------------------------------------------------
// Import each service photo from the local assets folder.
// Keeping these in separate variables makes the services[] array below cleaner.
import mealPrepImg     from '../assets/chama.jpg';
import cateringImg     from '../assets/outside-cater.jpg';
import partiesImg      from '../assets/birth-grad.jpg';
import weddingImg      from '../assets/wedd-ruracio.jpg';
import facilitatorImg  from '../assets/culinary-facilitator.jpg';
import menuImg         from '../assets/menu-prod.jpg';
import eventsImg       from '../assets/Event-prod.jpg';

// --- static data for the cards ---------------------------------------------
// Fallback shown until (or unless) the admin-managed services load from Supabase.
const fallbackServices = [
  {
    title: 'Meal Prep / Chama Events',
    img: mealPrepImg,
    desc: 'Nutritious, home‑style meals prepped fresh for groups or chama meetups.',
  },
  {
    title: 'Outside Catering',
    img: cateringImg,
    desc: 'Tailored menus and full catering setup for all kinds of gatherings.',
  },
  {
    title: 'Birthday & Graduation Parties',
    img: partiesImg,
    desc: 'Celebrate milestones with festive, flavorful dishes.',
  },
  {
    title: 'Weddings / Ruracio',
    img: weddingImg,
    desc: 'Elegant culinary service for your big day or traditional ceremonies.',
  },
  {
    title: 'Culinary Facilitation',
    img: facilitatorImg,
    desc: 'Expert culinary training for schools, institutions, or community events.',
  },
  {
    title: 'Menu Production',
    img: menuImg,
    desc: 'Creative, customized menu design for events and businesses.',
  },
  {
    title: 'Event Production',
    img: eventsImg,
    desc: 'Full‑scale planning and execution of food‑based events and experiences.',
  },
];

// --- Services component -----------------------------------------------------
// Renders a responsive grid of service cards.
// Tailwind utility classes handle spacing, layout, and colours.
const Services = () => {
  const [services, setServices] = useState(fallbackServices);

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setServices(data.map((row) => ({ title: row.title, desc: row.description, img: publicUrlFor(row.image_path) })));
        }
      });
  }, []);

  return (
  <section
    id="services"                       /* anchor link for navbar scrolling */
    className="py-20 bg-gray-50 text-gray-800"
  >
    {/* Container */}
    <div className="max-w-6xl mx-auto px-4">
      {/* Section heading */}
      <h2 className="text-4xl font-bold text-center mb-12">
        Services by Chef Mashua
      </h2>

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((s, i) => (
          /* Card wrapper */
          <div
            key={i}
            className="bg-white rounded-lg shadow-md overflow-hidden
                       hover:shadow-xl transition-shadow duration-300"
          >
            {/* Image */}
            <img
              src={s.img}
              alt={s.title}
              className="h-48 w-full object-cover"
            />

            {/* Text block */}
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-amber-600 mb-2">
                {s.title}
              </h3>
              <p className="text-gray-600">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="mt-10 text-center text-sm text-gray-500">
        📍 Available in Kitengela and surrounding areas
      </p>
    </div>
  </section>
  );
};

export default Services;
