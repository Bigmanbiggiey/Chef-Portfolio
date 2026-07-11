import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { publicUrlFor, uploadImage, deleteImage } from '../../lib/media';

const inputClass = 'w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500';

const GalleryPanel = () => {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | uploading | error
  const [errorMessage, setErrorMessage] = useState('');

  const load = () => {
    supabase
      .from('gallery_photos')
      .select('*')
      .order('sort_order')
      .then(({ data }) => setPhotos(data || []));
  };

  useEffect(load, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setStatus('uploading');
    setErrorMessage('');

    try {
      const path = await uploadImage('gallery', file);
      const { error } = await supabase
        .from('gallery_photos')
        .insert({ image_path: path, caption: caption.trim() || null, sort_order: Number(sortOrder) || 0 });
      if (error) throw error;

      setFile(null);
      setCaption('');
      setSortOrder(0);
      setStatus('idle');
      load();
    } catch (err) {
      setErrorMessage(err.message || 'Upload failed.');
      setStatus('error');
    }
  };

  const handleDelete = async (photo) => {
    await deleteImage(photo.image_path);
    await supabase.from('gallery_photos').delete().eq('id', photo.id);
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Signature Dishes Gallery</h2>

      <form onSubmit={handleUpload} className="space-y-3 mb-8 max-w-md">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0] || null)}
          className={inputClass}
        />
        <input
          type="text"
          placeholder="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={200}
          className={inputClass}
        />
        <input
          type="number"
          placeholder="Sort order"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className={inputClass}
        />
        <button
          type="submit"
          disabled={!file || status === 'uploading'}
          className="px-6 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-medium rounded-full shadow transition"
        >
          {status === 'uploading' ? 'Uploading…' : 'Upload Photo'}
        </button>
        {status === 'error' && <p className="text-red-600 text-sm">{errorMessage}</p>}
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="bg-white rounded-lg shadow overflow-hidden">
            <img src={publicUrlFor(photo.image_path)} alt={photo.caption || ''} className="w-full h-32 object-cover" />
            <div className="p-2 text-sm">
              <p className="text-gray-600 truncate">{photo.caption || '—'}</p>
              <p className="text-gray-400 text-xs">order: {photo.sort_order}</p>
              <button
                onClick={() => handleDelete(photo)}
                className="text-red-600 hover:text-red-700 text-xs mt-1"
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

export default GalleryPanel;
