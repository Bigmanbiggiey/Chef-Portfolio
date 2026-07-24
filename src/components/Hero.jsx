import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { publicUrlFor } from '../lib/media';
import { useSiteSettings } from '../hooks/useSiteSettings';
import HeroImage from '../assets/cover.jpg';

const fallback = {
  image: HeroImage,
  heading: 'Chef Mashua',
  subheading: 'Gourmet cuisine crafted with passion and precision.',
};

const Hero = () => {
  const [content, setContent] = useState(fallback);
  const data = useSiteSettings();

  useEffect(() => {
    if (!data) return;
    setContent((c) => ({
      image: data.hero_image_path ? publicUrlFor(data.hero_image_path) : c.image,
      heading: data.hero_heading || c.heading,
      subheading: data.hero_subheading || c.subheading,
    }));
  }, [data]);

  return (
    <section
      id="home"
      className="relative min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${content.image})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold leading-tight mb-4"
        >
          Taste the Art of <span className="text-amber-400">{content.heading}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-2xl max-w-xl"
        >
          {content.subheading}
        </motion.p>

        <motion.a
          href="#services"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white text-lg font-medium rounded-full shadow-lg transition duration-300"
        >
          Explore Greatness
        </motion.a>
      </div>
    </section>
  );
};

export default Hero;
