import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { ADMIN_EMAILS } from './allowedAdminEmails';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const AdminApp = () => {
  const [session, setSession] = useState(undefined); // undefined = loading, null = signed out
  const email = session?.user?.email;

  useEffect(() => {
    document.title = 'Admin · Chef Mashua';

    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = () => {
    supabase.auth.signOut();
  };

  if (session === undefined) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100" />;
  }

  if (!session) {
    return <AdminLogin />;
  }

  if (!ADMIN_EMAILS.includes(email)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-lg text-gray-800 mb-4">
            {email} is not authorized to access this admin panel.
          </p>
          <button
            onClick={handleSignOut}
            className="text-sm text-amber-600 hover:text-amber-700 underline"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard onSignOut={handleSignOut} />;
};

export default AdminApp;
