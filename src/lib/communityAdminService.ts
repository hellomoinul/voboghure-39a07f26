import { supabase } from '@/lib/supabase';

export interface JoinRequestWithUser {
  id: string;
  community_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface CommunityMemberRow {
  id: string;
  user_id: string;
  community_id: string;
  role: 'member' | 'community_admin' | 'admin' | 'moderator' | 'pending'; // এখানে সম্ভাব্য সব রোল যোগ করুন
  joined_at: string;
  // ... অন্যান্য কলাম
}

export async function fetchPendingRequests(communityId: string) {
  const { data, error } = await supabase
    .from('community_join_requests')
    .select('*')
    .eq('community_id', communityId)
    .eq('status', 'pending')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []) as JoinRequestWithUser[];
}

export async function approveRequest(requestId: string, communityId: string, userId: string) {
  // Add as member
  const { error: memberErr } = await supabase
    .from('community_members')
    .insert({ community_id: communityId, user_id: userId, role: 'member' });
  if (memberErr) throw memberErr;

  // Update request status
  const { error: reqErr } = await supabase
    .from('community_join_requests')
    .update({ status: 'approved' })
    .eq('id', requestId);
  if (reqErr) throw reqErr;
}

export async function rejectRequest(requestId: string) {
  const { error } = await supabase
    .from('community_join_requests')
    .update({ status: 'rejected' })
    .eq('id', requestId);
  if (error) throw error;
}

export async function fetchCommunityMembers(communityId: string) {
  const { data, error } = await supabase
    .from('community_members')
    .select('*')
    .eq('community_id', communityId)
    .order('joined_at', { ascending: true });
  if (error) throw error;
  return (data || []) as CommunityMemberRow[];
}

export async function removeMember(memberId: string) {
  const { error } = await supabase
    .from('community_members')
    .delete()
    .eq('id', memberId);
  if (error) throw error;
}

export async function updateMemberRole(memberId: string, role: 'member' | 'community_admin') {
  const { error } = await supabase
    .from('community_members')
    .update({ role })
    .eq('id', memberId);
  if (error) throw error;
}
