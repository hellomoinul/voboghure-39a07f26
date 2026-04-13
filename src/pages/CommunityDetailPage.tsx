import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Lock, Calendar, ArrowLeft, CheckCircle2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { mockCommunities } from '@/data/communityData';

export default function CommunityDetailPage() {
  const { id } = useParams();
  const [requested, setRequested] = useState(false);
  const community = mockCommunities.find(c => c.id === id);

  if (!community) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center py-20">
        <p className="text-muted-foreground text-lg">Community not found</p>
        <Button variant="outline" asChild className="mt-4">
          <Link to="/communities">Back to Communities</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/communities" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> All Communities
        </Link>
      </Button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border-border/50">
          <div className="relative h-52 md:h-64 overflow-hidden">
            <img
              src={community.coverImage}
              alt={community.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-5 flex items-center gap-3">
              <span className="text-4xl">{community.logo}</span>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">
                  {community.name}
                </h1>
                <div className="flex items-center gap-3 mt-1 text-sm text-white/80">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {community.memberCount} members
                  </span>
                  <Badge variant="secondary" className="text-xs gap-1">
                    <Lock className="h-3 w-3" /> {community.type}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">About</h2>
              <p className="text-muted-foreground leading-relaxed">{community.description}</p>
              {community.descriptionBn && (
                <p className="text-muted-foreground leading-relaxed mt-2 italic">{community.descriptionBn}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> Founded {new Date(community.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </span>
            </div>

            {community.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {community.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="gap-1 text-xs">
                    <Tag className="h-3 w-3" /> {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="pt-2">
              {requested ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-500/10 rounded-lg px-4 py-3"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Join request sent. Waiting for admin approval.</span>
                </motion.div>
              ) : (
                <Button size="lg" onClick={() => setRequested(true)}>
                  Request to Join
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
