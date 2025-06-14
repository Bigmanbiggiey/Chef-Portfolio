import { motion } from 'framer-motion';
import HeroImage from '../assets/cover.jpg';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${HeroImage})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold leading-tight mb-4"
        >
          Taste the Art of <span className="text-amber-400">Chef Mashua</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-2xl max-w-xl"
        >
          Gourmet cuisine crafted with passion and precision.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white text-lg font-medium rounded-full shadow-lg transition duration-300"
        >
          Explore Greatness
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;
