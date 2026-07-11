import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabase';
import TestimonialForm from './TestimonialForm';

const reviews = [
  {
    name: "KIUINI SCHOOL",
    quote: "Chef Meshack works effortlessly to empower our learners with culinary arts skills. They all look forward to cooking lessons with him."
  },
  {
    name: "PCEA KITENGELA",
    quote: "Mr. Mashua is an avid team player who collaborates with our kitchen staff to deliver replenishing meals on almost every occasion. He is truly blessed and deeply loved here."
  },
  {
    name: "Friends and Family",
    quote: "No one beats him at the grill. His Nyama Choma is to die for — and his Kuku Choma? Absolutely unforgettable! Book him now!"
  }
];

const Testimonials = () => {
  const [liveReviews, setLiveReviews] = useState([]);

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setLiveReviews(data);
      });
  }, []);

  const handleNewTestimonial = (row) => {
    setLiveReviews((current) => [row, ...current]);
  };

  return (
    <section id="testimonials" className="py-20 bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-12 text-gray-800">Client Love</h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.figure
              key={`curated-${i}`}
              className="bg-white shadow-md rounded-xl p-6 text-left border-l-4 border-amber-400"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
            >
              <blockquote className="text-gray-700 text-lg italic">“{r.quote}”</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-amber-600">— {r.name}</figcaption>
            </motion.figure>
          ))}
        </div>

        {liveReviews.length > 0 && (
          <>
            <h3 className="text-2xl font-semibold mt-16 mb-8 text-gray-800">
              More reviews from our community
            </h3>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {liveReviews.map((r) => (
                <motion.figure
                  key={r.id}
                  className="bg-white shadow-md rounded-xl p-6 text-left border-l-4 border-amber-400"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <blockquote className="text-gray-700 text-lg italic">“{r.quote}”</blockquote>
                  <figcaption className="mt-4 text-sm font-semibold text-amber-600">— {r.name}</figcaption>
                </motion.figure>
              ))}
            </div>
          </>
        )}

        <TestimonialForm onNewTestimonial={handleNewTestimonial} />
      </div>
    </section>
  );
};

export default Testimonials;
