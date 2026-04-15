import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DemoBanner } from '@/components/DemoBanner';
import { EventCard } from '@/components/EventCard';
import { supabase } from '@/lib/supabase';
import { useCommunity } from '@/contexts/CommunityContext';
import { Loader2 } from 'lucide-react';

export default function EventsPage() {
  const { activeCommunity } = useCommunity();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      if (!activeCommunity?.id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_participants (count)
        `)
        .eq('community_id', activeCommunity.id)
        .order('event_date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    }

    fetchEvents();
  }, [activeCommunity?.id]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <DemoBanner />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-serif text-3xl font-bold">Community Events</h1>
        <p className="text-muted-foreground mt-1">
          {events.length > 0 ? "Join our upcoming adventures" : "No events scheduled for this community yet."}
        </p>
      </motion.div>

      {events.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, i) => (
            <EventCard 
              key={event.id} 
              event={{
                ...event,
                participants_count: event.event_participants?.[0]?.count || 0
              }} 
              index={i} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border rounded-xl border-dashed">
          <p className="text-muted-foreground">Stay tuned for new events!</p>
        </div>
      )}
    </div>
  );
}