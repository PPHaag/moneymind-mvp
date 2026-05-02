const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action, email, token } = req.body || {};

  // --- MAGIC LINK ---
  if (action === 'magic-link') {
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.SITE_URL || 'https://moneymind-mvp-five.vercel.app'}/apps/dashboard/`
      }
    });

    if (error) {
      console.error('Magic link error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true, message: 'Magic link sent' });
  }

  // --- GET PLAN ---
  // Frontend stuurt het access_token mee, wij halen user.plan op uit public.users
  if (action === 'get-plan') {
    if (!token) return res.status(400).json({ error: 'Token is required' });

    // Verifieer de token en haal user op
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error('Get user error:', userError?.message);
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    // Haal plan op uit public.users
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('plan')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError.message);
      // Geen rij gevonden = nieuwe user, geef free terug
      return res.status(200).json({ plan: 'free', user_id: user.id });
    }

    return res.status(200).json({
      plan: profile.plan || 'free',
      user_id: user.id
    });
  }

  return res.status(400).json({ error: 'Unknown action' });
};
