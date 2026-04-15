import { supabase } from '@/lib/supabase';

export const adminService = {
  // ১. পেন্ডিং জয়েন রিকোয়েস্টগুলো দেখা
  async getPendingRequests() {
    const { data, error } = await supabase
      .from('community_members')
      .select(`
        id,
        role,
        joined_at,
        user_id,
        profiles:user_id (id, full_name, avatar_url, name_bn),
        communities:community_id (name)
      `)
      .eq('role', 'pending');

    if (error) throw error;
    return data;
  },

  // ২. মেম্বার অ্যাপ্রুভ করা বা রোল আপডেট করা
  async updateMemberRole(memberId: string, newRole: 'member' | 'admin' | 'moderator') {
    const { data, error } = await supabase
      .from('community_members')
      .update({ role: newRole })
      .eq('id', memberId);

    if (error) throw error;
    return data;
  },

  // ৩. মেম্বার রিমুভ করা বা রিজেক্ট করা
  async removeMember(memberId: string) {
    const { error } = await supabase
      .from('community_members')
      .delete()
      .eq('id', memberId);

    if (error) throw error;
  }
};