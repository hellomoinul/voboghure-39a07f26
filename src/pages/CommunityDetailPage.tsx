import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Lock, Calendar, ArrowLeft, CheckCircle2, Tag, Quote, BookOpen, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { mockCommunities } from '@/data/communityData';
import { members, events, stories } from '@/data/mockData';
import { useCommunity } from '@/contexts/CommunityContext';

export default function CommunityDetailPage() {
  const { id } = useParams();
  const { getMembershipStatus, requestJoin } = useCommunity();
  const community = mockCommunities.find(c => c.id === id);

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

  const status = getMembershipStatus(community.id);

  // Mock data previews
  const previewMembers = members.filter(m => m.role !== 'demo').slice(0, 4);
  const previewEvents = events.slice(0, 3);
  const previewStories = stories.slice(0, 3);

  const communityRules = [
    'Respect all members and their privacy',
    'No sharing of community content outside the group',
    'All trip plans must be discussed before finalizing',
    'Photos shared must have consent from all participants',
    'Admin decisions are final on membership matters',
  ];

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
              <img src={community.coverImage} alt={community.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{community.logo}</span>
                  <div className="min-w-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md truncate">{community.name}</h1>
                    <div className="flex items-center gap-3 mt-1 text-sm text-white/80 flex-wrap">
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {community.memberCount} members</span>
                      <Badge variant="secondary" className="text-xs gap-1 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                        <Lock className="h-3 w-3" /> {community.type}
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
                    <Badge key={tag} variant="outline" className="gap-1 text-xs"><Tag className="h-3 w-3" /> {tag}</Badge>
                  ))}
                </div>
              )}

              {/* Privacy notice */}
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">
                  <Lock className="h-3.5 w-3.5 inline mr-1.5 -mt-0.5" />
                  This is a <strong>{community.type}</strong> community. You need to be approved by an admin to view events, stories, and memories.
                </p>
              </div>

              {/* Join CTA based on status */}
              <div className="pt-2">
                {status === 'joined' && (
                  <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 rounded-lg px-4 py-3">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>You are a member of this community.</span>
                  </div>
                )}
                {status === 'pending' && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 text-sm text-amber-500 bg-amber-500/10 rounded-lg px-4 py-3">
                    <Clock className="h-5 w-5" />
                    <span>Join request sent. Waiting for admin approval.</span>
                  </motion.div>
                )}
                {status === 'not-joined' && (
                  <Button size="lg" onClick={() => requestJoin(community.id)}>Request to Join</Button>
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

          {/* Members Preview */}
          <Card className="mt-6 bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Members</h2>
                </div>
                <Badge variant="secondary" className="text-xs">{community.memberCount} total</Badge>
              </div>
              {status === 'joined' ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {previewMembers.map(m => (
                    <div key={m.id} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/30">
                      <img src={m.avatar} alt={m.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20" />
                      <p className="text-xs font-medium text-foreground text-center truncate w-full">{m.name}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">{m.role}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Join this community to see its members.</p>
              )}
            </CardContent>
          </Card>

          {/* Events Preview */}
          <Card className="mt-6 bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Recent Events</h2>
              </div>
              {status === 'joined' ? (
                <div className="space-y-3">
                  {previewEvents.map(e => (
                    <div key={e.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <img src={e.coverImage} alt={e.title} className="w-14 h-10 rounded object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{e.title}</p>
                        <p className="text-xs text-muted-foreground">{e.location} · {new Date(e.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Join this community to see its events.</p>
              )}
            </CardContent>
          </Card>

          {/* Stories Preview */}
          <Card className="mt-6 bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Recent Stories</h2>
              </div>
              {status === 'joined' ? (
                <div className="space-y-3">
                  {previewStories.map(s => (
                    <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <img src={s.coverImage} alt={s.title} className="w-14 h-10 rounded object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{s.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{s.excerpt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Join this community to read its stories.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
