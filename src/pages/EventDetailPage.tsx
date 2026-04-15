import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DemoBanner } from '@/components/DemoBanner';
import { StoryCard } from '@/components/StoryCard';
import { MapPin, Calendar, Users, ExternalLink, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventVoting } from '@/components/EventVoting';
import { getEventDetails } from '@/lib/communityService';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEventData() {
      if (id) {
        setIsLoading(true);
        const data = await getEventDetails(id);
        setEvent(data);
        setIsLoading(false);
      }
    }
    fetchEventData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading event data...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-12 text-center">
        <p className="text-xl font-semibold text-muted-foreground">Event not found.</p>
        <Button asChild variant="link" className="mt-4">
          <Link to="/events"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Events</Link>
        </Button>
      </div>
    );
  }

  // সুপাবেস থেকে আসা রিলেশনাল ডাটা
  const stories = event.stories || [];
  const gallery = event.event_gallery || [];
  const expenses = event.expenses || []; // JSONB কলাম থেকে আসবে
  const participants = event.event_members || []; // রিলেশন অনুযায়ী

  return (
    <div className="max-w-5xl mx-auto">
      <DemoBanner />

      {/* Hero Section */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={event.image_url || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <Link to="/events" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
            <ArrowLeft className="h-4 w-4" /> Back to Events
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl font-bold">{event.title}</h1>
          {event.title_bn && <p className="font-bangla text-lg text-muted-foreground mt-1">{event.title_bn}</p>}
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> {event.location}</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary" />
            {new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Description */}
        <div>
          <h2 className="font-serif text-xl font-bold mb-3">About This Trip</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.description}</p>
        </div>

        {/* Google Photos */}
        {event.google_photos_url && (
          <div className="glass-card p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm">📸 Full Photo Album</h3>
              <p className="text-xs text-muted-foreground">View all photos on Google Photos</p>
            </div>
            <a href={event.google_photos_url} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> View Album
              </Button>
            </a>
          </div>
        )}

        {/* Gallery Section */}
        {gallery.length > 0 && (
          <div>
            <h2 className="font-serif text-xl font-bold mb-4">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {gallery.map((img: any, i: number) => (
                <motion.div key={img.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="aspect-square rounded-lg overflow-hidden group">
                  <img src={img.image_url} alt="Gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Voting */}
        <EventVoting eventId={event.id} />

        {/* Expenses (JSONB Mapping) */}
        {expenses.length > 0 && (
          <div className="glass-card p-5">
            <h3 className="font-serif text-lg font-bold mb-3">💰 Expense Breakdown</h3>
            <div className="space-y-2">
              {expenses.map((exp: any, i: number) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{exp.item}</span>
                  <span className="font-medium">৳{exp.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 flex justify-between text-sm font-bold">
                <span>Total</span>
                <span className="text-primary">৳{expenses.reduce((s: number, e: any) => s + e.amount, 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Stories */}
        {stories.length > 0 && (
          <div>
            <h2 className="font-serif text-xl font-bold mb-4">Stories from This Trip</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {stories.map((story: any, i: number) => (
                <StoryCard key={story.id} story={story} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {event.tags && (
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}