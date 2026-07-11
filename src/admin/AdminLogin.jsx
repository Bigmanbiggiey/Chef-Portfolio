import { supabase } from '../supabase';

const AdminLogin = () => {
  const handleSignIn = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Chef Mashua Admin</h1>
        <button
          onClick={handleSignIn}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-full shadow transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
