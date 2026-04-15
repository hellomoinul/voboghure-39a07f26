import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';

interface EventCardProps {
  event: any; // সুপাবেস ডাটা
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  // সুপাবেস টেবিলের কলাম অনুযায়ী ডাটা সেট করা
  const title = event.title;
  const date = event.event_date ? new Date(event.event_date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : "Date TBA";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/events/${event.id}`} className="block group">
        <div className="bg-card hover:shadow-xl transition-all duration-300 rounded-xl border border-border/50 overflow-hidden">
          <div className="p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-7 w-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                    +
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                {title}
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground mt-2 text-sm">
                <Clock className="h-3 w-3" />
                <span>{date}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-border/50">
              <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-md">
                Upcoming
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" /> Interested
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// এই লাইনটি অত্যন্ত জরুরি, এটি আপনার এরর বন্ধ করবে
export default EventCard;

// Helper component for clock icon (if not imported)
function Clock({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  );
}