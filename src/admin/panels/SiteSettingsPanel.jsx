import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { publicUrlFor, uploadImage } from '../../lib/media';
import { Spinner } from '../ui';
import { inputClass } from '../adminUtils';

const SiteSettingsPanel = () => {
  const [settings, setSettings] = useState(null);
  const [heroFile, setHeroFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);
  const [aboutFile, setAboutFile] = useState(null);
  const [aboutPreview, setAboutPreview] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | saving | success | error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => setSettings(data));
  }, []);

  useEffect(() => {
    if (!heroFile) {
      setHeroPreview(null);
      return;
    }
    const url = URL.createObjectURL(heroFile);
    setHeroPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [heroFile]);

  useEffect(() => {
    if (!aboutFile) {
      setAboutPreview(null);
      return;
    }
    const url = URL.createObjectURL(aboutFile);
    setAboutPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [aboutFile]);

  if (!settings) return <Spinner label="Loading settings…" />;

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('saving');
    setErrorMessage('');

    try {
      const update = {
        hero_heading: settings.hero_heading,
        hero_subheading: settings.hero_subheading,
        about_heading: settings.about_heading,
        about_bio: settings.about_bio,
        updated_at: new Date().toISOString(),
      };

      if (heroFile) update.hero_image_path = await uploadImage('site', heroFile);
      if (aboutFile) update.about_image_path = await uploadImage('site', aboutFile);

      const { error } = await supabase.from('site_settings').update(update).eq('id', 1);
      if (error) throw error;

      setSettings({ ...settings, ...update });
      setHeroFile(null);
      setAboutFile(null);
      setStatus('success');
    } catch (err) {
      setErrorMessage(err.message || 'Could not save settings.');
      setStatus('error');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Hero & About</h2>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        <fieldset className="space-y-3">
          <legend className="font-medium text-gray-700 mb-1">Hero</legend>
          {(heroPreview || settings.hero_image_path) && (
            <img
              src={heroPreview || publicUrlFor(settings.hero_image_path)}
              alt="Hero"
              className="w-full h-40 object-cover rounded"
            />
          )}
          <input type="file" accept="image/*" onChange={(e) => setHeroFile(e.target.files[0] || null)} className={inputClass} />
          <input
            type="text"
            placeholder="Hero heading"
            value={settings.hero_heading || ''}
            onChange={(e) => handleChange('hero_heading', e.target.value)}
            maxLength={150}
            className={inputClass}
          />
          <input
            type="text"
            placeholder="Hero subheading"
            value={settings.hero_subheading || ''}
            onChange={(e) => handleChange('hero_subheading', e.target.value)}
            maxLength={300}
            className={inputClass}
          />
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="font-medium text-gray-700 mb-1">About</legend>
          {(aboutPreview || settings.about_image_path) && (
            <img
              src={aboutPreview || publicUrlFor(settings.about_image_path)}
              alt="About"
              className="w-32 h-32 object-cover rounded-full"
            />
          )}
          <input type="file" accept="image/*" onChange={(e) => setAboutFile(e.target.files[0] || null)} className={inputClass} />
          <input
            type="text"
            placeholder="About heading"
            value={settings.about_heading || ''}
            onChange={(e) => handleChange('about_heading', e.target.value)}
            maxLength={150}
            className={inputClass}
          />
          <textarea
            placeholder="Bio (separate paragraphs with a blank line)"
            value={settings.about_bio || ''}
            onChange={(e) => handleChange('about_bio', e.target.value)}
            maxLength={2000}
            rows={6}
            className={inputClass}
          />
        </fieldset>

        <button
          type="submit"
          disabled={status === 'saving'}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-medium rounded-full shadow transition"
        >
          {status === 'saving' ? 'Saving…' : 'Save Changes'}
        </button>
        {status === 'success' && <p className="text-green-600">Saved.</p>}
        {status === 'error' && <p className="text-red-600">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default SiteSettingsPanel;
