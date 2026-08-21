import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface StoryCardProps {
  story: any; // সুপাবেস থেকে আসা ডাটা
  index?: number;
}

export function StoryCard({ story, index = 0 }: StoryCardProps) {
  // সুপাবেস ডাটা স্ট্রাকচার অনুযায়ী ভেরিয়েবল সেট করা
  const title = story.title;
  const excerpt = story.content || ""; // content কে excerpt হিসেবে ব্যবহার করছি
  const coverImage = story.image_url || "/placeholder.svg"; // আপনার ইমেজের কলামের নাম image_url
  const author = story.profiles; // আমরা profiles টেবিল থেকে ডাটা আনছি

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <Link to={`/stories/${story.id}`} className="block group">
        <div className="glass-card-hover overflow-hidden rounded-xl border border-border/50 bg-card">
          <div className="relative h-40 overflow-hidden">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          </div>
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-serif text-base font-bold leading-tight group-hover:text-primary transition-colors line-clamp-1">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{excerpt}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {author?.avatar && (
                  <img 
                    src={author.avatar} 
                    alt={author.name} 
                    className="w-5 h-5 rounded-full object-cover" 
                  />
                )}
                <span className="text-xs text-muted-foreground">
                  {author?.name || "Anonymous"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" /> 0
                </span>
                <span>0 ❤️</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// এটি আগের মতো Default ও রাখছি যাতে ইমপোর্ট করতে সমস্যা না হয়
export default StoryCard;