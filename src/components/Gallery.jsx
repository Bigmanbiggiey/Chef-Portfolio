import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { supabase } from '../supabase';
import { publicUrlFor } from '../lib/media';

import dish2 from '../assets/dish2.jpg';
import dish3 from '../assets/dish3.jpg';
import dish4 from '../assets/dish4.jpg';
import dish5 from '../assets/dish5.jpg';

const fallbackDishes = [dish2, dish3, dish4, dish5];

const Gallery = () => {
  const [dishes, setDishes] = useState(fallbackDishes);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    supabase
      .from('gallery_photos')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setDishes(data.map((row) => publicUrlFor(row.image_path)));
        }
      });
  }, []);

  return (
    <section id="gallery" className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-10" data-aos="fade-up">
          Signature Dishes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {dishes.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Dish ${index + 1}`}
              onClick={() => setLightboxImage(src)}
              loading="lazy"
              decoding="async"
              className="rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform duration-300 object-cover w-full h-64"
              data-aos="zoom-in"
            />
          ))}
        </div>
      </div>

      {/* Lightbox Overlay */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setLightboxImage(null)}
        >
          <img
            src={lightboxImage}
            alt="Enlarged Dish"
            className="max-w-3xl max-h-[80vh] rounded-lg shadow-lg"
          />
        </div>
      )}
    </section>
  );
};

export default Gallery;
