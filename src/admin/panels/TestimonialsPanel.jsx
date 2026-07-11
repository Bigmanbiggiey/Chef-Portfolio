import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';

const TestimonialsPanel = () => {
  const [testimonials, setTestimonials] = useState([]);

  const load = () => {
    supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setTestimonials(data || []));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    await supabase.from('testimonials').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Testimonials</h2>

      {testimonials.length === 0 && <p className="text-gray-500">No visitor-submitted testimonials yet.</p>}

      <div className="space-y-3">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white rounded-lg shadow p-4">
            <blockquote className="text-gray-700 italic">"{t.quote}"</blockquote>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm font-semibold text-amber-600">— {t.name}</p>
              <button
                onClick={() => handleDelete(t.id)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsPanel;
