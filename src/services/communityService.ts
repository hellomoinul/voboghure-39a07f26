import { supabase } from '@/lib/supabase';

export async function getPublicProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

// প্রোফাইল এবং ইভেন্ট হিস্ট্রি ফেচ করার ফাংশন
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

export const getUserStories = async (userId: string) => {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('author_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching user stories:", error);
    return [];
  }
  return data;
};

// প্রোফাইল ছবি আপলোড করার ফাংশন
export const uploadAvatar = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  // পুরানো বাকেট থেকে আপলোড
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // পাবলিক URL তৈরি
  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
  return data.publicUrl;
};

// প্রোফাইল ডাটা আপডেট করার ফাংশন
export const updateProfile = async (userId: string, updates: any) => {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
};