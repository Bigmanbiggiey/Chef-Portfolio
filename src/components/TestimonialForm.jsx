import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

const TestimonialForm = ({ onNewTestimonial }) => {
  const [session, setSession] = useState(null);
  const [name, setName] = useState('');
  const [quote, setQuote] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignIn = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href },
    });
  };

  const handleSignOut = () => {
    supabase.auth.signOut();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedQuote = quote.trim();

    if (!trimmedName || trimmedName.length > 80 || !trimmedQuote || trimmedQuote.length > 500) {
      setErrorMessage('Name must be 1–80 characters and your review 1–500 characters.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    const { data, error } = await supabase
      .from('testimonials')
      .insert({ name: trimmedName, quote: trimmedQuote, user_id: session.user.id })
      .select()
      .single();

    if (error) {
      setErrorMessage('Something went wrong submitting your review. Please try again.');
      setStatus('error');
      return;
    }

    onNewTestimonial?.(data);
    setName('');
    setQuote('');
    setStatus('success');
  };

  if (!session) {
    return (
      <div className="mt-12 text-center">
        <button
          onClick={handleSignIn}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-full shadow transition"
        >
          Sign in with Google to leave a review
        </button>
      </div>
    );
  }

  return (
    <div className="mt-12 max-w-lg mx-auto text-left">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="testimonial-name" className="block text-sm font-medium mb-1">
            Your name
          </label>
          <input
            id="testimonial-name"
            type="text"
            required
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. your name or organization"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label htmlFor="testimonial-quote" className="block text-sm font-medium mb-1">
            Your review
          </label>
          <textarea
            id="testimonial-quote"
            required
            rows={4}
            maxLength={500}
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-medium rounded-full shadow transition"
          >
            {status === 'submitting' ? 'Submitting…' : 'Submit Review'}
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-sm text-gray-500 hover:text-amber-600"
          >
            Sign out
          </button>
        </div>

        {status === 'success' && (
          <p className="text-green-600 font-medium">Thanks for the review!</p>
        )}
        {status === 'error' && (
          <p className="text-red-600 font-medium">{errorMessage}</p>
        )}
      </form>
    </div>
  );
};

export default TestimonialForm;
