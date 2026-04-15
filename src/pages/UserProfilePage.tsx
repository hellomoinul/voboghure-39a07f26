import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCommunity } from '@/contexts/CommunityContext';
import { getUserPublicProfile, getUserEventHistory } from '@/lib/communityService';
import { 
  Loader2, MapPin, Calendar, BookOpen, 
  Camera, ArrowLeft, Milestone, GraduationCap 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { activeCommunity } = useCommunity();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFullProfile() {
      if (id && activeCommunity?.id) {
        setIsLoading(true);
        // প্রোফাইল এবং ইভেন্ট হিস্ট্রি একসাথে ফেচ করা
        const [profileData, eventHistory] = await Promise.all([
          getUserPublicProfile(id, activeCommunity.id),
          getUserEventHistory(id)
        ]);
        
        setUserData(profileData);
        setHistory(eventHistory || []);
        setIsLoading(false);
      }
    }
    fetchFullProfile();
  }, [id, activeCommunity?.id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground italic">Loading member profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">User profile not found!</p>
        <Button variant="link" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-secondary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Members
        </Button>
      </div>

      {/* Hero Profile Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-secondary/30 via-background to-background p-6 md:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-xl">
            <AvatarImage src={userData.avatar_url} className="object-cover" />
            <AvatarFallback className="text-4xl font-serif bg-primary text-primary-foreground">
              {userData.full_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left space-y-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{userData.full_name}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                   {userData.designation || 'Voboghure Explorer'}
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {userData.location || 'Bangladesh'}
                </span>
              </div>
            </div>

            <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl italic">
              "{userData.bio || "Searching for the next great adventure. Let's explore the world together!"}"
            </p>

            <div className="pt-2 flex items-center justify-center md:justify-start gap-4 text-xs font-medium text-muted-foreground">
               <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Member since {new Date(userData.created_at).getFullYear()}</span>
            </div>
          </div>
        </div>
        {/* Decorative element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <div className="glass-card p-6 flex flex-col items-center justify-center border-b-4 border-b-primary shadow-sm">
          <Camera className="h-5 w-5 text-primary mb-2" />
          <span className="text-3xl font-bold">{userData.stats?.events || 0}</span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Trips Joined</span>
        </div>
        <div className="glass-card p-6 flex flex-col items-center justify-center border-b-4 border-b-green-500 shadow-sm">
          <BookOpen className="h-5 w-5 text-green-500 mb-2" />
          <span className="text-3xl font-bold">{userData.stats?.stories || 0}</span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Stories Told</span>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="space-y-8 pb-12">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Milestone className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Adventure Journey</h2>
        </div>

        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:via-border before:to-transparent">
          {history && history.length > 0 ? history.map((item: any, index: number) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              {/* Dot */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-secondary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <div className="w-2.5 h-2.5 bg-primary rounded-full group-hover:scale-150 transition-transform duration-300" />
              </div>
              
              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-5 hover:border-primary/40 transition-all cursor-default">
                <div className="flex items-center justify-between mb-2">
                  <time className="text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                    {new Date(item.events?.event_date).toLocaleDateString('en-GB', { 
                      day: 'numeric', month: 'short', year: 'numeric' 
                    })}
                  </time>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Joined: {new Date(item.joined_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                  {item.events?.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary/60" />
                  <span>{item.events?.location}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 bg-secondary/10 rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground italic">No adventures recorded in this community yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}