const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local
const envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function debugLogin() {
  const phone = '5521994601961';
  console.log('Searching for phone:', phone);
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone', phone);
      
    if (error) {
      console.log('ERROR:', error.message);
    } else {
      console.log('DATA:', JSON.stringify(data));
      if (data.length === 0) {
        console.log('No user found with this phone.');
      }
    }
    
    // Check if RLS is enabled or if there are any policies
    // You can't easily check policies with anon key, but we can try a simple query to stores too
    const { data: stores, error: storeError } = await supabase.from('stores').select('id').limit(1);
    console.log('Stores check:', storeError ? storeError.message : 'OK');

  } catch (e) {
    console.log('EXCEPTION:', e.message);
  }
}

debugLogin();
