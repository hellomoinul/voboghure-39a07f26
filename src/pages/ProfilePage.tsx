import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DemoBanner } from '@/components/DemoBanner';
import { useAuth } from '@/contexts/AuthContext';
import { StoryCard } from '@/components/StoryCard';
import { Calendar, BookOpen, Camera, Mountain, Loader2, MapPin, Plus, X, Check, Edit3 } from 'lucide-react';
import { User } from '@/types';
import { getPublicProfile, getUserEventHistory, getUserStories, updateProfile, uploadAvatar } from '@/services/communityService';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { userId } = useParams(); 
  const { user: currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [eventHistory, setEventHistory] = useState<any[]>([]);
  const [userStories, setUserStories] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [editForm, setEditForm] = useState({ name: '', nameBn: '', bio: '' });

  const fetchProfileData = async () => {
    const targetId = userId || currentUser?.id;
    if (!targetId) return;

    try {
      const [userData, historyData, storiesData] = await Promise.all([
        getPublicProfile(targetId),
        getUserEventHistory(targetId),
        getUserStories(targetId)
      ]);
      
      const mappedUser = {
        id: userData.id,
        name: userData.name || '',
        nameBn: userData.name_bn || '', 
        avatar: userData.avatar || '',
        role: userData.role || 'Member',
        bio: userData.bio || '',
        joinedAt: userData.created_at || new Date().toISOString(),
        stats: {
          trips: historyData.length || 0,
          stories: storiesData.length || 0,
          photos: userData.photos_count || 0,
        },
      } as User;
      
      setProfileUser(mappedUser);
      setEventHistory(historyData);
      setUserStories(storiesData);
      
      setEditForm({ 
        name: userData.name || '', 
        nameBn: userData.name_bn || '', 
        bio: userData.bio || '' 
      });

    } catch (error) {
      console.error("Profile fetch error:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [userId, currentUser]);

  const handleUpdateProfile = async () => {
    if (!profileUser) return;
    try {
      setLoading(true);
      await updateProfile(profileUser.id, {
        name: editForm.name,
        name_bn: editForm.nameBn, 
        bio: editForm.bio
      });
      setIsEditing(false);
      await fetchProfileData(); 
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    if (currentUser?.id === profileUser?.id) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profileUser) return;
    try {
      setUploading(true);
      const publicUrl = await uploadAvatar(profileUser.id, file);
      await updateProfile(profileUser.id, { avatar: publicUrl });
      setProfileUser({ ...profileUser, avatar: publicUrl });
      toast.success("Avatar updated!");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading && !profileUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" aria-label="Loading profile" />
      </div>
    );
  }

  if (!profileUser) return <div className="text-center py-20 text-white font-serif">Explorer not found.</div>;

  const isOwnProfile = currentUser?.id === profileUser.id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      <DemoBanner />

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 text-center mb-12 relative overflow-hidden"
      >
        <div 
          className="relative w-28 h-28 mx-auto mb-4 group cursor-pointer" 
          onClick={handleImageClick}
          title={isOwnProfile ? "Change Profile Picture" : ""}
        >
          <img 
            src={profileUser.avatar || 'https://via.placeholder.com/150'} 
            alt={profileUser.name} 
            className={`w-full h-full rounded-full object-cover ring-4 ring-primary/20 shadow-2xl transition-all ${isOwnProfile && 'group-hover:opacity-70'}`} 
          />
          {isOwnProfile && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {uploading ? <Loader2 className="animate-spin text-white" /> : <Camera className="text-white h-6 w-6" />}
            </div>
          )}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} title="Upload photo" aria-label="Upload photo" />
        </div>

        {isEditing ? (
          <div className="space-y-4 max-w-sm mx-auto">
            <input 
              value={editForm.name} 
              onChange={e => setEditForm({...editForm, name: e.target.value})} 
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center text-xl font-bold focus:border-primary focus:outline-none" 
              placeholder="Full Name" 
              aria-label="Edit Full Name" 
            />
            <input 
              value={editForm.nameBn} 
              onChange={e => setEditForm({...editForm, nameBn: e.target.value})} 
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center font-bangla focus:border-primary focus:outline-none" 
              placeholder="আপনার নাম (বাংলায়)" 
              aria-label="Edit Name in Bengali" 
            />
            <textarea 
              value={editForm.bio} 
              onChange={e => setEditForm({...editForm, bio: e.target.value})} 
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center text-sm h-24 resize-none focus:border-primary focus:outline-none" 
              placeholder="Tell your story..." 
              aria-label="Edit Bio" 
            />
            <div className="flex justify-center gap-4">
              <button onClick={() => setIsEditing(false)} className="p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20" title="Cancel" aria-label="Cancel Changes"><X className="h-5 w-5"/></button>
              <button onClick={handleUpdateProfile} className="p-2 rounded-full bg-green-500/10 text-green-400 hover:bg-green-500/20" title="Save" aria-label="Save Changes"><Check className="h-5 w-5"/></button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-2">
              <h1 className="font-serif text-2xl font-bold tracking-tight">{profileUser.name}</h1>
              {isOwnProfile && (
                <button onClick={() => setIsEditing(true)} title="Edit Profile" aria-label="Edit Profile">
                  <Edit3 className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                </button>
              )}
            </div>
            {profileUser.nameBn && <p className="font-bangla text-muted-foreground mt-1 opacity-80">{profileUser.nameBn}</p>}
            <p className="text-[10px] text-primary uppercase tracking-[0.2em] mt-3 font-semibold">{profileUser.role}</p>
            <p className="text-sm text-muted-foreground mt-5 max-w-md mx-auto italic leading-relaxed px-4">
              "{profileUser.bio || 'This explorer is still writing their story.'}"
            </p>
          </>
        )}

        <div className="flex justify-center gap-10 mt-8 border-t border-white/5 pt-8">
          <div className="text-center group">
            <Mountain className="h-5 w-5 text-primary mx-auto mb-1 group-hover:scale-110 transition-transform" aria-hidden="true" />
            <p className="text-xl font-bold">{profileUser.stats.trips}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Trips</p>
          </div>
          <div className="text-center group">
            <BookOpen className="h-5 w-5 text-primary mx-auto mb-1 group-hover:scale-110 transition-transform" aria-hidden="true" />
            <p className="text-xl font-bold">{profileUser.stats.stories}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Stories</p>
          </div>
          <div className="text-center group">
            <Camera className="h-5 w-5 text-primary mx-auto mb-1 group-hover:scale-110 transition-transform" aria-hidden="true" />
            <p className="text-xl font-bold">{profileUser.stats.photos}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Photos</p>
          </div>
        </div>
      </motion.div>

      {/* Travel History Section */}
      <div className="mb-14">
        <h2 className="font-serif text-xl font-bold mb-8 flex items-center gap-3 border-l-4 border-primary pl-4">
          <MapPin className="h-5 w-5 text-primary" aria-hidden="true" /> 
          {isOwnProfile ? "My Travel History" : `${profileUser.name.split(' ')[0]}'s Travel History`}
        </h2>
        
        {eventHistory.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {eventHistory.map((item: any) => (
              <motion.div 
                key={item.events.id} 
                whileHover={{ x: 8 }} 
                className="glass-card p-4 flex gap-4 items-center border border-white/5 hover:bg-white/5 transition-all cursor-pointer group"
              >
                <img src={item.events.image_url} className="w-16 h-16 rounded-xl object-cover ring-1 ring-white/10 group-hover:ring-primary/40 transition-all" alt="" />
                <div className="text-left">
                  <h4 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{item.events.title}</h4>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1 font-mono">
                    <Calendar className="h-3 w-3" /> {new Date(item.events.event_date).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center text-muted-foreground italic text-sm border-dashed border-2 border-white/5">
            No journeys documented yet.
          </div>
        )}
      </div>

      {/* Stories Section */}
      <div className="mt-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-xl font-bold flex items-center gap-3 border-l-4 border-primary pl-4">
            <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
            {isOwnProfile ? "My Stories" : `${profileUser.name.split(' ')[0]}'s Stories`}
          </h2>
          {isOwnProfile && (
            <button className="flex items-center gap-2 text-[10px] bg-primary/10 text-primary px-4 py-2 rounded-full hover:bg-primary/20 transition-all font-bold uppercase tracking-widest shadow-lg shadow-primary/5" aria-label="Write a new story">
              <Plus className="h-3 w-3" /> New Story
            </button>
          )}
        </div>
        
        {userStories.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {userStories.map((story, i) => (
              <StoryCard key={story.id} story={story} index={i} />
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-16 text-center border-dashed border-2 border-white/5 bg-white/1">
            <div className="bg-primary/5 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-6 w-6 text-primary/30" />
            </div>
            <p className="text-muted-foreground text-sm italic">
              "Every journey tells a story. When are you writing yours?"
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}