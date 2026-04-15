import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, BookOpen, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCommunity } from '@/contexts/CommunityContext';
import { getLatestCommunityData, getCommunityMemberCount, subscribeToMemberChanges } from '@/lib/communityService';
import EventCard from '@/components/EventCard';
import StoryCard from '@/components/StoryCard';
import { supabase } from '@/lib/supabase';

function EmptySection({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Icon className="h-10 w-10 text-muted-foreground/40 mb-3" />
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-xs text-muted-foreground/70 mt-1">{description}</p>
    </div>
  );
}

// কার্ডের জন্য স্কেলিটন লোডার (Task 1.3)
function CardSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border border-border/50 p-4 animate-pulse">
      <div className="h-32 w-full bg-muted rounded-lg" />
      <div className="h-4 w-3/4 bg-muted rounded" />
      <div className="h-4 w-1/2 bg-muted rounded" />
    </div>
  );
}

export default function CommunityHomePage() {
  const { activeCommunity } = useCommunity();
  const [data, setData] = useState<{ events: any[]; stories: any[] }>({ events: [], stories: [] });
  const [memberCount, setMemberCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
    let subscription: any;

    async function fetchHomeData() {
      if (activeCommunity?.id) {
        setIsLoading(true);
        const [latestData, count] = await Promise.all([
          getLatestCommunityData(activeCommunity.id),
          getCommunityMemberCount(activeCommunity.id)
        ]);
        
        setData(latestData);
        setMemberCount(count);
        setIsLoading(false);

        // রিয়েল-টাইম সাবস্ক্রিপশন
        subscription = subscribeToMemberChanges(activeCommunity.id, async () => {
          const updatedCount = await getCommunityMemberCount(activeCommunity.id);
          setMemberCount(updatedCount);
        });
      }
    }

    fetchHomeData();

    return () => {
      if (subscription) {
        // supabase.removeChannel(subscription); // আপনার lib/supabase.ts অনুযায়ী এটি ব্যবহার করুন
      }
    };
  }, [activeCommunity?.id]); // এই লাইনটি একবারই থাকবে

  if (!activeCommunity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <p className="text-lg text-muted-foreground">No active community selected</p>
          <Button asChild variant="outline">
            <Link to="/communities">Browse Communities</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <span className="text-3xl">{activeCommunity.logo}</span>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{activeCommunity.name}</h1>
          {activeCommunity.tagline && (
            <p className="text-sm text-muted-foreground italic">"{activeCommunity.tagline}"</p>
          )}
        </div>
      </motion.div>

      {/* Grid Sections */}
      <div className="grid gap-6">
        
        {/* Events Section */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <h2 className="text-base font-semibold text-foreground">Upcoming Events</h2>
                </div>
                <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground">
                  <Link to="/events">View All <ArrowRight className="h-3 w-3 ml-1" /></Link>
                </Button>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CardSkeleton /> <CardSkeleton /> <CardSkeleton />
                </div>
              ) : data.events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.events.map((event, idx) => (
                    <EventCard key={event.id} event={event} index={idx} />
                  ))}
                </div>
              ) : (
                <EmptySection icon={Calendar} title="No events yet" description="Community events will appear here." />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Stories Section */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <h2 className="text-base font-semibold text-foreground">Recent Stories</h2>
                </div>
                <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground">
                  <Link to="/stories">View All <ArrowRight className="h-3 w-3 ml-1" /></Link>
                </Button>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <CardSkeleton /> <CardSkeleton /> <CardSkeleton /> <CardSkeleton />
                </div>
              ) : data.stories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {data.stories.map((story, idx) => (
                    <StoryCard key={story.id} story={story} index={idx} />
                  ))}
                </div>
              ) : (
                <EmptySection icon={BookOpen} title="No stories yet" description="Member stories will appear here." />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Member Snapshot Widget */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <h2 className="text-base font-semibold text-foreground">Community Snapshot</h2>
                </div>
                <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground">
                  <Link to="/members">View All <ArrowRight className="h-3 w-3 ml-1" /></Link>
                </Button>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
                  <div className="h-20 bg-muted rounded-lg" />
                  <div className="h-20 bg-muted rounded-lg" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-bold text-primary">{memberCount}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Total Members</span>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-secondary/20 border border-border/50 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-bold text-foreground">Active</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Community Status</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}