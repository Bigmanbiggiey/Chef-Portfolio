import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { Spinner, EmptyState } from '../ui';
import { dangerLinkClass, confirmDelete } from '../adminUtils';

const TestimonialsPanel = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setTestimonials(data || []);
        setLoading(false);
      });
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!confirmDelete('Delete this testimonial? This cannot be undone.')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Testimonials</h2>

      {loading ? (
        <Spinner label="Loading testimonials…" />
      ) : testimonials.length === 0 ? (
        <EmptyState>No visitor-submitted testimonials yet.</EmptyState>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-lg shadow p-4">
              <blockquote className="text-gray-700 italic">"{t.quote}"</blockquote>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm font-semibold text-amber-600">— {t.name}</p>
                <button onClick={() => handleDelete(t.id)} className={dangerLinkClass}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestimonialsPanel;
