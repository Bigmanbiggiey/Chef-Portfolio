import { motion } from 'framer-motion';

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

const Testimonials = () => (
  <section id="testimonials" className="py-20 bg-gray-100">
    <div className="max-w-5xl mx-auto px-4 text-center">
      <h2 className="text-4xl font-bold mb-12 text-gray-800">Client Love</h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <motion.figure
            key={i}
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
    </div>
  </section>
);

export default Testimonials;
