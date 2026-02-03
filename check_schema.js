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

async function checkSchema() {
  try {
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    if (error) {
      console.log('ERROR:', error.message);
      // Try to select just one column to see if it works
      const { error: error2 } = await supabase.from('profiles').select('id').limit(1);
      if (error2) console.log('ERROR ID:', error2.message);
      else console.log('ID column exists');
    } else {
      if (data && data.length > 0) {
        console.log('COLUMNS:', Object.keys(data[0]));
      } else {
        console.log('TABLE EMPTY, NO COLUMNS RETURNED');
      }
    }
  } catch (e) {
    console.log('EXCEPTION:', e.message);
  }
}

checkSchema();
