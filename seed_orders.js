const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; 
// Note: In a real backend scenario we'd use service_role, but for now we might be able to insert if RLS allows or we use anon for dev. 
// If RLS blocks, we might need the user to run SQL. Let's try anon first if the user is owner, or just assume open policies for now as seen before.
// Actually, looking at previous conflicts, RLS might be an issue.
// Let's rely on the user running SQL if this fails, or better yet, generate the SQL file as primary method.

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const STATUSES = [
  { id: 1, name: 'Pendente', sequence: 1 },
  { id: 2, name: 'Em Preparo', sequence: 2 },
  { id: 3, name: 'A Caminho', sequence: 3 },
  { id: 4, name: 'Concluído', sequence: 4 },
  { id: 5, name: 'Cancelado', sequence: 5 }
];

const PAYMENTS = [
  { id: 1, name: 'Pix', active: true },
  { id: 2, name: 'Cartão (Maquininha)', active: true },
  { id: 3, name: 'Dinheiro', active: true },
  { id: 4, name: 'Cartão (Online)', active: true }
];

async function seed() {
  console.log('Seeding Order Statuses...');
  for (const status of STATUSES) {
    const { error } = await supabase
      .from('order_statuses')
      .upsert(status, { onConflict: 'id' });
    
    if (error) console.error('Error upserting status:', status.name, error.message);
    else console.log('Upserted:', status.name);
  }

  console.log('Seeding Payment Types...');
  for (const payment of PAYMENTS) {
    const { error } = await supabase
      .from('payment_types')
      .upsert(payment, { onConflict: 'id' });
      
    if (error) console.error('Error upserting payment:', payment.name, error.message);
    else console.log('Upserted:', payment.name);
  }
}

seed();
