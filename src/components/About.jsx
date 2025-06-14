import { motion } from 'framer-motion';
import ChefImage from '../assets/chef.jpg';

const About = () => (
  <section id="about" className="py-20 bg-white text-gray-800">
    <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center">
      <motion.img
        src={ChefImage}
        alt="Chef Mashua"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-64 h-64 object-cover rounded-full shadow-lg mb-6 md:mb-0 md:mr-10"
      />

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-bold mb-4">Meet Mashua, The Chef 👨🏽‍🍳</h2>
        <p className="text-lg leading-relaxed mb-2">
          A highly skilled and creative chef with over 4 years of culinary experience.
        </p>
        <p className="text-lg leading-relaxed">
          Chef Mashua specializes in modern fusion cuisine that blends artistry and tradition.
          His dishes are more than meals — they're stories on a plate.
        </p>
      </motion.div>
    </div>
  </section>
);

export default About;
