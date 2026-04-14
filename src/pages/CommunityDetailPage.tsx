import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Lock, Calendar, ArrowLeft, CheckCircle2, Tag, Quote, ShieldCheck, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunity } from '@/contexts/CommunityContext';
import {
  DbCommunity,
  fetchCommunityById,
  fetchMembershipStatus,
  createJoinRequest,
} from '@/lib/communityService';
import { toast } from 'sonner';

type MembershipStatus = 'not-joined' | 'pending' | 'joined' | 'loading';

export default function CommunityDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated, isDemo } = useAuth();
  const { refreshMemberships } = useCommunity();
  const [community, setCommunity] = useState<DbCommunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<MembershipStatus>('loading');
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchCommunityById(id)
      .then(c => setCommunity(c))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!community || !user || isDemo) {
      setStatus('not-joined');
      return;
    }
    fetchMembershipStatus(community.id, user.id)
      .then(s => setStatus(s))
      .catch(() => setStatus('not-joined'));
  }, [community, user, isDemo]);

  const handleJoinRequest = async () => {
    if (!community || !user) return;
    setJoining(true);
    try {
      await createJoinRequest(community.id, user.id);
      setStatus('pending');
      toast.success('Join request sent!');
    } catch (err: any) {
      if (err?.code === '23505') {
        toast.info('You already have a pending request.');
        setStatus('pending');
      } else {
        toast.error('Failed to send request. Please try again.');
      }
    } finally {
      setJoining(false);
    }
  };

  const communityRules = [
    'Respect all members and their privacy',
    'No sharing of community content outside the group',
    'All trip plans must be discussed before finalizing',
    'Photos shared must have consent from all participants',
    'Admin decisions are final on membership matters',
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">Community not found</p>
          <Button variant="outline" asChild className="mt-4">
            <Link to="/communities">Back to Communities</Link>
          </Button>
        </div>
      </div>
    );
  }

  const displayType = community.type === 'invite_only' ? 'invite-only' : community.type;

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/communities" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> All Communities
          </Link>
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Hero */}
          <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border-border/50">
            <div className="relative h-52 md:h-72 overflow-hidden">
              {community.cover_image ? (
                <img src={community.cover_image} alt={community.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <span className="text-6xl">{community.logo}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{community.logo}</span>
                  <div className="min-w-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md truncate">{community.name}</h1>
                    <div className="flex items-center gap-3 mt-1 text-sm text-white/80 flex-wrap">
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {community.member_count} members</span>
                      <Badge variant="secondary" className="text-xs gap-1 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                        <Lock className="h-3 w-3" /> {displayType}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {community.tagline && (
                <div className="flex items-start gap-2 text-primary">
                  <Quote className="h-4 w-4 mt-0.5 shrink-0" />
                  <p className="text-sm font-medium italic">{community.tagline}</p>
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">About</h2>
                <p className="text-muted-foreground leading-relaxed">{community.description}</p>
                {community.description_bn && (
                  <p className="text-muted-foreground leading-relaxed mt-2 italic">{community.description_bn}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Founded {new Date(community.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </span>
              </div>

              {/* Privacy notice */}
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">
                  <Lock className="h-3.5 w-3.5 inline mr-1.5 -mt-0.5" />
                  This is a <strong>{displayType}</strong> community. You need to be approved by an admin to view events, stories, and memories.
                </p>
              </div>

              {/* Join CTA */}
              <div className="pt-2">
                {!isAuthenticated && (
                  <Button size="lg" asChild>
                    <Link to="/login">Login to Join</Link>
                  </Button>
                )}
                {isAuthenticated && status === 'loading' && (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                )}
                {isAuthenticated && status === 'joined' && (
                  <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 rounded-lg px-4 py-3">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>You are a member of this community.</span>
                  </div>
                )}
                {isAuthenticated && status === 'pending' && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 text-sm text-amber-500 bg-amber-500/10 rounded-lg px-4 py-3">
                    <Clock className="h-5 w-5" />
                    <span>Join request sent. Waiting for admin approval.</span>
                  </motion.div>
                )}
                {isAuthenticated && status === 'not-joined' && community.type === 'private' && (
                  <Button size="lg" onClick={handleJoinRequest} disabled={joining}>
                    {joining ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Request to Join
                  </Button>
                )}
                {isAuthenticated && status === 'not-joined' && community.type === 'invite_only' && (
                  <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                    <p className="text-sm text-muted-foreground">
                      This is an invite-only community. You need a community code to join. Ask a member for the code.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Community Rules */}
          <Card className="mt-6 bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Community Rules</h2>
              </div>
              <ol className="space-y-2">
                {communityRules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-semibold mt-0.5">{i + 1}</span>
                    {rule}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
