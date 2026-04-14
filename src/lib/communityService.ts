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
