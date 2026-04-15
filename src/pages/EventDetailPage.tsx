import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DemoBanner } from '@/components/DemoBanner';
import { StoryCard } from '@/components/StoryCard';
import { MapPin, Calendar, ExternalLink, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventVoting } from '@/components/EventVoting';
import { getEventDetails } from '@/lib/communityService';
import { useAuth } from '@/contexts/AuthContext'; // অ্যাথ কনটেক্সট ইম্পোর্ট করুন
import EventGallery from '@/components/EventGallery'; // গ্যালারি কম্পোনেন্ট ইম্পোর্ট করুন

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth(); // ইউজার আইডি পাওয়ার জন্য
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
        <p className="text-sm text-muted-foreground font-bangla">তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-12 text-center">
        <p className="text-xl font-semibold text-muted-foreground font-bangla">ইভেন্টটি খুঁজে পাওয়া যায়নি।</p>
        <Button asChild variant="link" className="mt-4">
          <Link to="/events"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Events</Link>
        </Button>
      </div>
    );
  }

  const stories = event.stories || [];
  const expenses = event.expenses || [];

  return (
    <div className="max-w-5xl mx-auto pb-20">
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

      <div className="p-6 space-y-10">
        {/* Meta Info & Description */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> {event.location}</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                {new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold mb-3 border-b pb-2">About This Trip</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>
          </div>

          {/* Sidebar: Expenses */}
          <div className="space-y-4">
            {expenses.length > 0 && (
              <div className="glass-card p-5 border-t-4 border-primary">
                <h3 className="font-serif text-lg font-bold mb-3 flex items-center gap-2">
                  💰 Cost Breakdown
                </h3>
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
            
            {/* Voting Section moved to sidebar */}
            <div className="glass-card p-4">
               <EventVoting eventId={event.id} />
            </div>
          </div>
        </div>

        {/* ✅ দ্য গ্যালারি সেকশন (আপলোড ফিচারসহ) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-2xl font-bold">Captured Moments</h2>
          </div>
          {user ? (
            <EventGallery eventId={event.id} userId={user.id} />
          ) : (
            <p className="text-sm text-muted-foreground italic">Please login to upload photos to this gallery.</p>
          )}
        </div>

        {/* Stories Section */}
        {stories.length > 0 && (
          <div className="pt-6 border-t border-border">
            <h2 className="font-serif text-2xl font-bold mb-6">Stories from This Trip</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {stories.map((story: any, i: number) => (
                <StoryCard key={story.id} story={story} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {event.tags && (
          <div className="flex flex-wrap gap-2 pt-4">
            {event.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs bg-secondary/50 text-secondary-foreground border border-border">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}