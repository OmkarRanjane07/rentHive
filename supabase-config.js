/* ============================================
   RentHive – Supabase Configuration & API
   ============================================ */

const SUPABASE_URL = 'https://rzseddsrgcksxnkrgrbu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6c2VkZHNyZ2Nrc3hua3JncmJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMTIzMDIsImV4cCI6MjEwMjg4ODMwMn0.eJDL5ZMKaQsvaaejIo49kCFryIrosf2R6HbsVfYyJkM';

// Initialize Supabase client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// AUTH FUNCTIONS
// ============================================

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

async function login(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

async function logout() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
}

async function getCurrentUser() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  return user;
}

async function getUserProfile(userId) {
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

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

async function fetchAds(categoryId = null) {
  let query = supabaseClient
    .from('ads')
    .select('*, profiles(full_name, avatar_url), categories(name, icon)')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function fetchFeaturedAds() {
  const { data, error } = await supabaseClient
    .from('ads')
    .select('*, profiles(full_name, avatar_url), categories(name)')
    .eq('status', 'active')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(4);
  if (error) throw error;
  return data;
}

async function fetchAdById(adId) {
  const { data, error } = await supabaseClient
    .from('ads')
    .select('*, profiles(full_name, avatar_url, phone), categories(name)')
    .eq('id', adId)
    .single();
  if (error) throw error;
  return data;
}

async function searchAds(searchTerm) {
  const { data, error } = await supabaseClient
    .from('ads')
    .select('*, profiles(full_name, avatar_url), categories(name, icon)')
    .eq('status', 'active')
    .ilike('title', '%' + searchTerm + '%')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

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

async function deleteAd(adId) {
  const { error } = await supabaseClient
    .from('ads')
    .delete()
    .eq('id', adId);
  if (error) throw error;
}

async function fetchMyAds(status = 'active') {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabaseClient
    .from('ads')
    .select('*, categories(name)')
    .eq('user_id', user.id)
    .eq('status', status)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ============================================
// WISHLIST FUNCTIONS
// ============================================

async function fetchWishlist() {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabaseClient
    .from('wishlists')
    .select('*, ads(*, profiles(full_name))')
    .eq('user_id', user.id);
  if (error) throw error;
  return data;
}

async function toggleWishlist(adId) {
  const user = await getCurrentUser();
  if (!user) throw new Error('You must be logged in');

  const { data: existing } = await supabaseClient
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('ad_id', adId)
    .single();

  if (existing) {
    await supabaseClient.from('wishlists').delete().eq('id', existing.id);
    return false;
  } else {
    await supabaseClient.from('wishlists').insert({ user_id: user.id, ad_id: adId });
    return true;
  }
}

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

async function getOrCreateConversation(adId, sellerId) {
  const user = await getCurrentUser();
  if (!user) throw new Error('You must be logged in');

  const { data: existing } = await supabaseClient
    .from('conversations')
    .select('*')
    .eq('ad_id', adId)
    .eq('buyer_id', user.id)
    .eq('seller_id', sellerId)
    .single();

  if (existing) return existing;

  const { data, error } = await supabaseClient
    .from('conversations')
    .insert({ ad_id: adId, buyer_id: user.id, seller_id: sellerId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function fetchConversations() {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabaseClient
    .from('conversations')
    .select('*, ads(title, image_urls, price), buyer:profiles!conversations_buyer_id_fkey(full_name, avatar_url), seller:profiles!conversations_seller_id_fkey(full_name, avatar_url)')
    .or('buyer_id.eq.' + user.id + ',seller_id.eq.' + user.id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

async function fetchMessages(conversationId) {
  const { data, error } = await supabaseClient
    .from('messages')
    .select('*, profiles(full_name)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

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

function subscribeToMessages(conversationId, callback) {
  return supabaseClient
    .channel('messages:' + conversationId)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: 'conversation_id=eq.' + conversationId
      },
      function(payload) { callback(payload.new); }
    )
    .subscribe();
}

function unsubscribeFromMessages(conversationId) {
  supabaseClient.removeChannel(
    supabaseClient.channel('messages:' + conversationId)
  );
}

// ============================================
// IMAGE UPLOAD (Storage)
// ============================================

async function uploadProductImage(file) {
  const user = await getCurrentUser();
  if (!user) throw new Error('You must be logged in');

  var fileExt = file.name.split('.').pop();
  var fileName = user.id + '/' + Date.now() + '_' + Math.random().toString(36).substring(2) + '.' + fileExt;

  const { data, error } = await supabaseClient.storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabaseClient.storage
    .from('product-images')
    .getPublicUrl(fileName);

  return publicUrl;
}

async function uploadMultipleImages(files) {
  var urls = [];
  for (var i = 0; i < files.length; i++) {
    var url = await uploadProductImage(files[i]);
    urls.push(url);
  }
  return urls;
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

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

async function fetchReportedAds() {
  const { data, error } = await supabaseClient
    .from('reported_ads')
    .select('*, ads(title, image_urls, categories(name, icon, icon_color, bg_color)), profiles(full_name)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

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

supabaseClient.auth.onAuthStateChange(function(event, session) {
  if (event === 'SIGNED_IN' && session) {
    console.log('User signed in:', session.user.email);
    if (typeof loadHomeScreen === 'function') {
      loadHomeScreen();
    }
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
    showScreen('login-screen');
  }
});

console.log('RentHive Supabase initialized');
