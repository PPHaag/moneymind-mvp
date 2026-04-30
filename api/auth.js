const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, action } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    if (action === 'magic-link') {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.SITE_URL || 'https://moneymind-mvp.vercel.app'}/apps/dashboard/`
        }
      });

      if (error) throw error;

      return res.status(200).json({ success: true, message: 'Magic link sent' });
    }

    return res.status(400).json({ error: 'Unknown action' });

  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
