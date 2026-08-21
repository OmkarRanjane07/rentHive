/* ============================================
   RentHive – Supabase Configuration & API
   ============================================ */

// ⚠️ REPLACE THESE with your Supabase project values
// Find them at: Supabase Dashboard → Settings → API
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';

// Initialize Supabase client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// AUTH FUNCTIONS
// ============================================

// Sign Up with email, password, and full name
async function signUp(email, password, fullName) {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  });
  if (error) throw error;
  return data;
}

// Login with email and password
async function login(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

// Logout
async function logout() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
}

// Get current logged-in user
async function getCurrentUser() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  return user;
}

// Get user profile from profiles table
async function getUserProfile(userId) {
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

// Update user profile
async function updateProfile(updates) {
  const user = await getCurrentUser();
  const { data, error } = await supabaseClient
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ============================================
// CATEGORIES FUNCTIONS
// ============================================

// Fetch all categories
async function fetchCategories() {
  const { data, error } = await supabaseClient
    .from('categories')
    .select('*')
    .order('id');
  if (error) throw error;
  return data;
}

// ============================================
// ADS (PRODUCTS) FUNCTIONS
// ============================================

// Fetch all active ads (optionally filtered by category)
async function fetchAds(categoryId = null) {
  let query = supabaseClient
    .from('ads')
    .select(`*, profiles(full_name, avatar_url), categories(name, icon)`)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Fetch featured ads for the home screen
async function fetchFeaturedAds() {
  const { data, error } = await supabaseClient
    .from('ads')
    .select(`*, profiles(full_name, avatar_url), categories(name)`)
    .eq('status', 'active')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(4);
  if (error) throw error;
  return data;
}

// Fetch a single ad by ID (for product details screen)
async function fetchAdById(adId) {
  const { data, error } = await supabaseClient
    .from('ads')
    .select(`*, profiles(full_name, avatar_url, phone), categories(name)`)
    .eq('id', adId)
    .single();
  if (error) throw error;
  return data;
}

// Search ads by title
async function searchAds(searchTerm) {
  const { data, error } = await supabaseClient
    .from('ads')
    .select(`*, profiles(full_name, avatar_url), categories(name, icon)`)
    .eq('status', 'active')
    .ilike('title', `%${searchTerm}%`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Create a new ad
async function createAd(adData) {
  const user = await getCurrentUser();
  if (!user) throw new Error('You must be logged in to post an ad');

  const { data, error } = await supabaseClient
    .from('ads')
    .insert({ ...adData, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Update an existing ad
async function updateAd(adId, updates) {
  const { data, error } = await supabaseClient
    .from('ads')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', adId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Delete an ad
async function deleteAd(adId) {
  const { error } = await supabaseClient
    .from('ads')
    .delete()
    .eq('id', adId);
  if (error) throw error;
}

// Fetch current user's ads (for My Ads screen)
async function fetchMyAds(status = 'active') {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabaseClient
    .from('ads')
    .select(`*, categories(name)`)
    .eq('user_id', user.id)
    .eq('status', status)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ============================================
// WISHLIST FUNCTIONS
// ============================================

// Fetch current user's wishlist
async function fetchWishlist() {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabaseClient
    .from('wishlists')
    .select(`*, ads(*, profiles(full_name))`)
    .eq('user_id', user.id);
  if (error) throw error;
  return data;
}

// Toggle wishlist (add if not present, remove if present)
async function toggleWishlist(adId) {
  const user = await getCurrentUser();
  if (!user) throw new Error('You must be logged in');

  // Check if already in wishlist
  const { data: existing } = await supabaseClient
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('ad_id', adId)
    .single();

  if (existing) {
    // Remove from wishlist
    await supabaseClient.from('wishlists').delete().eq('id', existing.id);
    return false; // removed
  } else {
    // Add to wishlist
    await supabaseClient.from('wishlists').insert({ user_id: user.id, ad_id: adId });
    return true; // added
  }
}

// Check if an ad is in the user's wishlist
async function isInWishlist(adId) {
  const user = await getCurrentUser();
  if (!user) return false;

  const { data } = await supabaseClient
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('ad_id', adId)
    .single();

  return !!data;
}

// ============================================
// CHAT / MESSAGES FUNCTIONS
// ============================================

// Get or create a conversation between buyer and seller
async function getOrCreateConversation(adId, sellerId) {
  const user = await getCurrentUser();
  if (!user) throw new Error('You must be logged in');

  // Check if conversation already exists
  const { data: existing } = await supabaseClient
    .from('conversations')
    .select('*')
    .eq('ad_id', adId)
    .eq('buyer_id', user.id)
    .eq('seller_id', sellerId)
    .single();

  if (existing) return existing;

  // Create new conversation
  const { data, error } = await supabaseClient
    .from('conversations')
    .insert({ ad_id: adId, buyer_id: user.id, seller_id: sellerId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Fetch all conversations for the current user
async function fetchConversations() {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabaseClient
    .from('conversations')
    .select(`*, 
      ads(title, image_urls, price), 
      buyer:profiles!conversations_buyer_id_fkey(full_name, avatar_url),
      seller:profiles!conversations_seller_id_fkey(full_name, avatar_url)
    `)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Fetch messages for a specific conversation
async function fetchMessages(conversationId) {
  const { data, error } = await supabaseClient
    .from('messages')
    .select(`*, profiles(full_name)`)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

// Send a message in a conversation
async function sendMessageToConversation(conversationId, content) {
  const user = await getCurrentUser();
  if (!user) throw new Error('You must be logged in');

  const { data, error } = await supabaseClient
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Subscribe to realtime messages for live chat
function subscribeToMessages(conversationId, callback) {
  return supabaseClient
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      (payload) => callback(payload.new)
    )
    .subscribe();
}

// Unsubscribe from realtime messages
function unsubscribeFromMessages(conversationId) {
  supabaseClient.removeChannel(
    supabaseClient.channel(`messages:${conversationId}`)
  );
}

// ============================================
// IMAGE UPLOAD (Storage)
// ============================================

// Upload a product image and return its public URL
async function uploadProductImage(file) {
  const user = await getCurrentUser();
  if (!user) throw new Error('You must be logged in');

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { data, error } = await supabaseClient.storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  // Get the public URL
  const { data: { publicUrl } } = supabaseClient.storage
    .from('product-images')
    .getPublicUrl(fileName);

  return publicUrl;
}

// Upload multiple images
async function uploadMultipleImages(files) {
  const urls = [];
  for (const file of files) {
    const url = await uploadProductImage(file);
    urls.push(url);
  }
  return urls;
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

// Fetch admin dashboard statistics
async function fetchAdminStats() {
  const [users, ads, reported, sold] = await Promise.all([
    supabaseClient.from('profiles').select('id', { count: 'exact', head: true }),
    supabaseClient.from('ads').select('id', { count: 'exact', head: true }),
    supabaseClient.from('reported_ads').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabaseClient.from('ads').select('id', { count: 'exact', head: true }).eq('status', 'sold'),
  ]);

  return {
    totalUsers: users.count || 0,
    totalAds: ads.count || 0,
    reportedAds: reported.count || 0,
    totalSold: sold.count || 0,
  };
}

// Fetch reported ads list
async function fetchReportedAds() {
  const { data, error } = await supabaseClient
    .from('reported_ads')
    .select(`*, ads(title, image_urls, categories(name, icon, icon_color, bg_color)), profiles(full_name)`)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Report an ad
async function reportAd(adId, reason) {
  const user = await getCurrentUser();
  if (!user) throw new Error('You must be logged in');

  const { data, error } = await supabaseClient
    .from('reported_ads')
    .insert({ ad_id: adId, reported_by: user.id, reason })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ============================================
// AUTH STATE LISTENER
// ============================================

// Automatically react to login/logout events
supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session) {
    console.log('✅ User signed in:', session.user.email);
    // Load the home screen with real data
    if (typeof loadHomeScreen === 'function') {
      loadHomeScreen();
    }
  } else if (event === 'SIGNED_OUT') {
    console.log('👋 User signed out');
    showScreen('login-screen');
  }
});

console.log('🐝 RentHive Supabase initialized');
