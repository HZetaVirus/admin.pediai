const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndCreateStore() {
  try {
    console.log('🔍 Checking user authentication...');
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('❌ User not authenticated');
      console.log('\n💡 Please login first at http://localhost:3000');
      return;
    }

    console.log('✅ User authenticated:', user.email);
    console.log('   User ID:', user.id);

    // Check if store exists
    console.log('\n🔍 Checking for existing store...');
    const { data: existingStore, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('owner_id', user.id)
      .single();

    if (existingStore) {
      console.log('✅ Store found:', existingStore.name);
      console.log('   Store ID:', existingStore.id);
      console.log('   Slug:', existingStore.slug);
      
      // Check for orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id')
        .eq('store_id', existingStore.id);

      if (orders) {
        console.log(`\n📦 Found ${orders.length} orders for this store`);
      }

      if (!orders || orders.length === 0) {
        console.log('\n💡 No orders found. The orders page will show empty columns.');
        console.log('   This is normal if you haven\'t received any orders yet.');
      }

    } else {
      console.log('❌ No store found for this user');
      console.log('\n💡 You need to create a store first!');
      console.log('   The store should be created during user registration.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAndCreateStore();
