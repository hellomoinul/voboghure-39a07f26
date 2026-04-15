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