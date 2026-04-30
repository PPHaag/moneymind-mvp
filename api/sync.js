const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }

  const token = authHeader.replace('Bearer ', '');

  // Verify the user token
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // GET - load profile data from Supabase
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('profile_data, plan')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return res.status(200).json({
        profile_data: data?.profile_data || {},
        plan: data?.plan || 'free'
      });
    } catch (err) {
      console.error('Sync GET error:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  // POST - save profile data to Supabase
  if (req.method === 'POST') {
    const { profile_data } = req.body;

    if (!profile_data) {
      return res.status(400).json({ error: 'profile_data is required' });
    }

    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          profile_data,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (error) throw error;

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('Sync POST error:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
