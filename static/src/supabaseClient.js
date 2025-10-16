// Initialize Supabase client
const { createClient } = supabase;

// Get credentials from backend
let supabaseClient = null;

async function initializeSupabase() {
  try {
    const response = await fetch('/api/supabase-config');
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Supabase configuration error:', errorData.error);
      throw new Error(errorData.error || 'Failed to fetch Supabase configuration');
    }
    
    const config = await response.json();
    
    if (!config.url || !config.anonKey) {
      throw new Error('Invalid Supabase configuration received');
    }
    
    supabaseClient = createClient(config.url, config.anonKey);
    return supabaseClient;
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    // Return null to allow graceful degradation
    return null;
  }
}

function getSupabaseClient() {
  if (!supabaseClient) {
    throw new Error('Supabase client not initialized. Call initializeSupabase() first.');
  }
  return supabaseClient;
}
