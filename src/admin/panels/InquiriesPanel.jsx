import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { Spinner, EmptyState } from '../ui';
import { dangerLinkClass, confirmDelete } from '../adminUtils';

const InquiriesPanel = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setInquiries(data || []);
        setLoading(false);
      });
  };

  useEffect(load, []);

  const handleToggleHandled = async (inquiry) => {
    await supabase.from('inquiries').update({ handled: !inquiry.handled }).eq('id', inquiry.id);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirmDelete('Delete this inquiry? This cannot be undone.')) return;
    await supabase.from('inquiries').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Inquiries</h2>

      {loading ? (
        <Spinner label="Loading inquiries…" />
      ) : inquiries.length === 0 ? (
        <EmptyState>No inquiries yet — contact form and availability requests will show up here.</EmptyState>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className={`bg-white rounded-lg shadow p-4 ${inq.handled ? 'opacity-60' : 'border-l-4 border-amber-400'}`}
            >
              <div className="flex justify-between items-start gap-2 flex-wrap">
                <div>
                  <p className="font-semibold text-gray-800">
                    {inq.name} <span className="text-gray-400 font-normal text-sm">&lt;{inq.email}&gt;</span>
                  </p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    {inq.source} · {new Date(inq.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button
                    onClick={() => handleToggleHandled(inq)}
                    className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                  >
                    {inq.handled ? 'Mark unhandled' : 'Mark handled'}
                  </button>
                  <button onClick={() => handleDelete(inq.id)} className={dangerLinkClass}>
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-700 mt-2 whitespace-pre-wrap">{inq.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InquiriesPanel;
