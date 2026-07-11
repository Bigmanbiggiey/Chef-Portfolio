import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabase';
import { publicUrlFor } from '../lib/media';
import ChefImage from '../assets/chef.jpg';

const fallback = {
  image: ChefImage,
  heading: 'Meet Mashua, The Chef 👨🏽‍🍳',
  bio: "A highly skilled and creative chef with over 4 years of culinary experience.\n\nChef Mashua specializes in modern fusion cuisine that blends artistry and tradition. His dishes are more than meals — they're stories on a plate.",
};

const About = () => {
  const [content, setContent] = useState(fallback);

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        setContent((c) => ({
          image: data.about_image_path ? publicUrlFor(data.about_image_path) : c.image,
          heading: data.about_heading || c.heading,
          bio: data.about_bio || c.bio,
        }));
      });
  }, []);

  const paragraphs = content.bio.split('\n\n');

  return (
    <section id="about" className="py-20 bg-white text-gray-800">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center">
        <motion.img
          src={content.image}
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
          <h2 className="text-4xl font-bold mb-4">{content.heading}</h2>
          {paragraphs.map((p, i) => (
            <p key={i} className="text-lg leading-relaxed mb-2 last:mb-0">
              {p}
            </p>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
