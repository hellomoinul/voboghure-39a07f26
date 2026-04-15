import { supabase } from '@/lib/supabase';

export interface DbCommunity {
  id: string;
  name: string;
  name_bn: string | null;
  description: string;
  description_bn: string | null;
  tagline: string | null;
  logo: string;
  cover_image: string | null;
  theme_color: string | null;
  type: 'private' | 'invite_only';
  code: string;
  member_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DbCommunityMember {
  id: string;
  community_id: string;
  user_id: string;
  role: 'member' | 'community_admin';
  joined_at: string;
}

export interface DbJoinRequest {
  id: string;
  community_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export async function fetchCommunities() {
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as DbCommunity[];
}

export async function fetchCommunityById(id: string) {
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as DbCommunity | null;
}

export async function fetchCommunityByCode(code: string) {
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .eq('code', code)
    .maybeSingle();
  if (error) throw error;
  return data as DbCommunity | null;
}

export async function createCommunity(community: {
  name: string;
  description: string;
  logo: string;
  cover_image?: string;
  tagline?: string;
  theme_color?: string;
  type: 'private' | 'invite_only';
  code: string;
  created_by: string;
}) {
  const { data, error } = await supabase
    .from('communities')
    .insert(community)
    .select()
    .single();
  if (error) throw error;
  return data as DbCommunity;
}

export async function addCommunityMember(communityId: string, userId: string, role: 'member' | 'community_admin' = 'member') {
  const { error } = await supabase
    .from('community_members')
    .insert({ community_id: communityId, user_id: userId, role });
  if (error) throw error;
}

export async function fetchUserMemberships(userId: string) {
  const { data, error } = await supabase
    .from('community_members')
    .select('*, communities(*)')
    .eq('user_id', userId);
  if (error) throw error;
  return (data || []) as (DbCommunityMember & { communities: DbCommunity })[];
}

export async function fetchMembershipStatus(communityId: string, userId: string) {
  // Check membership
  const { data: member } = await supabase
    .from('community_members')
    .select('id')
    .eq('community_id', communityId)
    .eq('user_id', userId)
    .maybeSingle();
  if (member) return 'joined' as const;

  // Check pending request
  const { data: request } = await supabase
    .from('community_join_requests')
    .select('id, status')
    .eq('community_id', communityId)
    .eq('user_id', userId)
    .maybeSingle();
  if (request?.status === 'pending') return 'pending' as const;

  return 'not-joined' as const;
}

export async function createJoinRequest(communityId: string, userId: string) {
  const { error } = await supabase
    .from('community_join_requests')
    .insert({ community_id: communityId, user_id: userId });
  if (error) throw error;
}


// প্রোজেক্টের শেষে এই ফাংশনগুলো যোগ করুন

export const getLatestCommunityData = async (communityId: string) => {
  const now = new Date().toISOString();

  // ১. আসন্ন ৩টি ইভেন্ট আনা
  const { data: events, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('community_id', communityId)
    .gt('event_date', now)
    .order('event_date', { ascending: true })
    .limit(3);

  // ২. সাম্প্রতিক ৪টি স্টোরি আনা (মেম্বার ইনফো সহ)
  const { data: stories, error: storyError } = await supabase
    .from('stories')
    .select('*, profiles(username, avatar_url)')
    .eq('community_id', communityId)
    .order('created_at', { ascending: false })
    .limit(4);

  if (eventError || storyError) {
    console.error("Error fetching home data:", eventError || storyError);
  }

  return { events: events || [], stories: stories || [] };
};

// এই ফাংশনটি মেম্বার সংখ্যা গণনা করবে
export const getCommunityMemberCount = async (communityId: string) => {
  const { count, error } = await supabase
    .from('community_members') // আপনার টেবিল নাম যদি আলাদা হয় জানাবেন
    .select('*', { count: 'exact', head: true })
    .eq('community_id', communityId);

  if (error) {
    console.error("Error fetching member count:", error);
    return 0;
  }
  return count || 0;
};

// রিয়েল-টাইম মেম্বার আপডেট লিসেনার
export const subscribeToMemberChanges = (communityId: string, callback: () => void) => {
  return supabase
    .channel('community_members_changes')
    .on(
      'postgres_changes',
      {
        event: '*', // জয়েন বা লিভ যেকোনো কিছু হলেই
        schema: 'public',
        table: 'community_members',
        filter: `community_id=eq.${communityId}`
      },
      () => {
        callback(); // ডাটা চেঞ্জ হলে এই ফাংশনটি কল হবে
      }
    )
    .subscribe();
};

// একটি নির্দিষ্ট ইভেন্টের ডিটেইলস নিয়ে আসা
export const getEventDetails = async (eventId: string) => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      communities(name, logo),
      event_gallery(*),
      stories(*)
    `)
    .eq('id', eventId)
    .single();

  if (error) {
    console.error("Error fetching event details:", error);
    return null;
  }
  return data;
};

// একটি নির্দিষ্ট কমিউনিটির সব মেম্বারদের লিস্ট নিয়ে আসা
export const getCommunityMembers = async (communityId: string) => {
  const { data, error } = await supabase
    .from('community_members')
    .select(`
      user_id,
      role,
      profiles:user_id (
        id,
        full_name,
        avatar_url,
        bio,
        designation
      )
    `)
    .eq('community_id', communityId);

  if (error) {
    console.error("Error fetching members:", error);
    return [];
  }
  return data;
};

// ইউজারের পাবলিক প্রোফাইল এবং অ্যাক্টিভিটি সামারি নিয়ে আসা
export const getUserPublicProfile = async (userId: string, communityId: string) => {
  // ১. প্রোফাইল ডিটেইলস
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError) return null;

  // ২. ইভেন্ট পার্টিসিপেশন কাউন্ট
  const { count: eventCount } = await supabase
    .from('event_participants')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // ৩. স্টোরি কাউন্ট (কমিউনিটি স্কোপড)
  const { count: storyCount } = await supabase
    .from('stories')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', userId)
    .eq('community_id', communityId);

  return {
    ...profile,
    stats: {
      events: eventCount || 0,
      stories: storyCount || 0
    }
  };
};

// ইউজারের জয়েন করা ইভেন্টগুলোর হিস্ট্রি নিয়ে আসা
export const getUserEventHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from('event_participants')
    .select(`
      joined_at,
      events (
        id,
        title,
        event_date,
        location,
        image_url
      )
    `)
    .eq('user_id', userId)
    .order('joined_at', { ascending: false });

  if (error) {
    console.error("Error fetching event history:", error);
    return [];
  }
  return data;
};

// ১. নতুন নোটিফিকেশন তৈরি
export const createNotification = async (notif: {
  user_id: string;
  community_id: string;
  title: string;
  message: string;
  type: 'join_request' | 'request_approved' | 'new_event' | 'new_story';
  link?: string;
}) => {
  const { error } = await supabase.from('notifications').insert([notif]);
  if (error) console.error("Error creating notification:", error);
};

// ২. ইউজারের নোটিফিকেশনগুলো নিয়ে আসা
export const getMyNotifications = async (userId: string, communityId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('community_id', communityId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data;
};

// ৩. নোটিফিকেশন 'Read' হিসেবে মার্ক করা
export const markNotificationAsRead = async (id: string) => {
  await supabase.from('notifications').update({ is_read: true }).eq('id', id);
};

// ১. সব পেন্ডিং জয়েন রিকোয়েস্ট নিয়ে আসা
export const getPendingJoinRequests = async () => {
  const { data, error } = await supabase
    .from('join_requests')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  return data || [];
};

// ২. রিকোয়েস্ট হ্যান্ডেল করা (Approve/Reject)
export const handleJoinRequest = async (requestId: string, status: 'approved' | 'rejected') => {
  const { error } = await supabase
    .from('join_requests')
    .update({ status })
    .eq('id', requestId);
  return !error;
};

// ইমেইল দিয়ে ইউজার আইডি খুঁজে বের করা এবং মেম্বার হিসেবে অ্যাড করা
export const approveAndAddMember = async (email: string, communityId: string) => {
  // ১. ইমেইল দিয়ে প্রোফাইল থেকে ইউজার আইডি বের করা
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (userError || !userData) {
    console.log("User has not registered yet. Status updated only.");
    return { success: true, registered: false };
  }

  // ২. ইউজার অলরেডি মেম্বার কি না চেক করা
  const { data: existingMember } = await supabase
    .from('community_members')
    .select('*')
    .eq('user_id', userData.id)
    .eq('community_id', communityId)
    .single();

  if (existingMember) return { success: true, registered: true };

  // ৩. community_members টেবিলে ইনসার্ট করা
  const { error: memberError } = await supabase
    .from('community_members')
    .insert([
      { user_id: userData.id, community_id: communityId, role: 'member' }
    ]);

  if (memberError) return { success: false };

  // ৪. ইউজারকে একটি ওয়েলকাম নোটিফিকেশন পাঠানো
  await createNotification({
    user_id: userData.id,
    community_id: communityId,
    title: 'স্বাগতম! 🎉',
    message: `আপনার মেম্বারশিপ রিকোয়েস্ট অ্যাপ্রুভ হয়েছে। এখন আপনি সব ইভেন্টে অংশ নিতে পারবেন।`,
    type: 'request_approved',
    link: '/community-home'
  });

  return { success: true, registered: true };
};

// ১. ইমেজ আপলোড এবং লিঙ্ক সেভ করা
export const uploadEventImage = async (eventId: string, userId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${eventId}/${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  // স্টোরেজে আপলোড
  const { error: uploadError } = await supabase.storage
    .from('event-gallery')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // পাবলিক ইউআরএল নেওয়া
  const { data: { publicUrl } } = supabase.storage
    .from('event-gallery')
    .getPublicUrl(filePath);

  // ডাটাবেসে ইনসার্ট
  const { error: dbError } = await supabase
    .from('event_images')
    .insert([{ 
      event_id: eventId, 
      user_id: userId, 
      image_url: publicUrl 
    }]);

  if (dbError) throw dbError;
  return publicUrl;
};

// ২. কোনো ইভেন্টের সব ছবি নিয়ে আসা
export const getEventImages = async (eventId: string) => {
  const { data, error } = await supabase
    .from('event_images')
    .select('*, profiles(full_name, avatar)')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data;
};

export const getPublicProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      event_participants (
        count
      )
    `)
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

