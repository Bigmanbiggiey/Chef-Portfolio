import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { publicUrlFor, uploadImage, deleteImage } from '../../lib/media';
import { Spinner, EmptyState, ReorderButtons } from '../ui';
import { inputClass, dangerLinkClass, confirmDelete, reorderRow } from '../adminUtils';

const emptyNew = { title: '', description: '', sort_order: 0, file: null };

const ServicesPanel = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newService, setNewService] = useState(emptyNew);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const load = () => {
    supabase
      .from('services')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        setServices(data || []);
        setLoading(false);
      });
  };

  useEffect(load, []);

  useEffect(() => {
    if (!newService.file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(newService.file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [newService.file]);

  const updateRow = (id, patch) => {
    setServices((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const handleSaveRow = async (row) => {
    await supabase
      .from('services')
      .update({
        title: row.title,
        description: row.description,
        sort_order: Number(row.sort_order) || 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', row.id);
    load();
  };

  const handleReplaceImage = async (row, file) => {
    const path = await uploadImage('services', file);
    if (row.image_path) await deleteImage(row.image_path);
    await supabase.from('services').update({ image_path: path }).eq('id', row.id);
    load();
  };

  const handleDelete = async (row) => {
    if (!confirmDelete('Delete this service? This cannot be undone.')) return;
    if (row.image_path) await deleteImage(row.image_path);
    await supabase.from('services').delete().eq('id', row.id);
    load();
  };

  const handleMove = async (index, direction) => {
    if (await reorderRow('services', services, index, direction)) load();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setStatus('saving');
    setErrorMessage('');

    try {
      let image_path = null;
      if (newService.file) {
        image_path = await uploadImage('services', newService.file);
      }
      const { error } = await supabase.from('services').insert({
        title: newService.title.trim(),
        description: newService.description.trim(),
        sort_order: Number(newService.sort_order) || 0,
        image_path,
      });
      if (error) throw error;

      setNewService(emptyNew);
      setStatus('idle');
      load();
    } catch (err) {
      setErrorMessage(err.message || 'Could not create service.');
      setStatus('error');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Services</h2>

      <form onSubmit={handleCreate} className="space-y-3 mb-8 max-w-md">
        <input
          type="text"
          placeholder="Title"
          value={newService.title}
          onChange={(e) => setNewService({ ...newService, title: e.target.value })}
          required
          maxLength={120}
          className={inputClass}
        />
        <textarea
          placeholder="Description"
          value={newService.description}
          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
          required
          maxLength={500}
          rows={3}
          className={inputClass}
        />
        <input
          type="number"
          placeholder="Sort order"
          value={newService.sort_order}
          onChange={(e) => setNewService({ ...newService, sort_order: e.target.value })}
          className={inputClass}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewService({ ...newService, file: e.target.files[0] || null })}
          className={inputClass}
        />
        {previewUrl && (
          <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />
        )}
        <button
          type="submit"
          disabled={status === 'saving'}
          className="px-6 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-medium rounded-full shadow transition"
        >
          {status === 'saving' ? 'Adding…' : 'Add Service'}
        </button>
        {status === 'error' && <p className="text-red-600 text-sm">{errorMessage}</p>}
      </form>

      {loading ? (
        <Spinner label="Loading services…" />
      ) : services.length === 0 ? (
        <EmptyState>No services yet — add your first one above.</EmptyState>
      ) : (
        <div className="space-y-4">
          {services.map((row, index) => (
            <div key={row.id} className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row gap-4">
              {row.image_path && (
                <img
                  src={publicUrlFor(row.image_path)}
                  alt={row.title}
                  className="w-full h-40 sm:w-24 sm:h-24 object-cover rounded"
                />
              )}
              <div className="flex-1 min-w-0 space-y-2">
                <input
                  type="text"
                  value={row.title}
                  onChange={(e) => updateRow(row.id, { title: e.target.value })}
                  maxLength={120}
                  className={inputClass}
                />
                <textarea
                  value={row.description}
                  onChange={(e) => updateRow(row.id, { description: e.target.value })}
                  maxLength={500}
                  rows={2}
                  className={inputClass}
                />
                <div className="flex gap-3 items-center flex-wrap">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && handleReplaceImage(row, e.target.files[0])}
                    className="text-xs max-w-full"
                  />
                  <button
                    onClick={() => handleSaveRow(row)}
                    className="px-4 py-1 bg-amber-500 hover:bg-amber-600 text-white text-sm rounded-full"
                  >
                    Save
                  </button>
                  <button onClick={() => handleDelete(row)} className={dangerLinkClass}>
                    Delete
                  </button>
                  <ReorderButtons
                    onUp={() => handleMove(index, -1)}
                    onDown={() => handleMove(index, 1)}
                    disableUp={index === 0}
                    disableDown={index === services.length - 1}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesPanel;
