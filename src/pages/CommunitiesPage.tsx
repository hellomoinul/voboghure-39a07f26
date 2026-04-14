import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Users, Lock, ArrowRight, KeyRound, Plus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DbCommunity, fetchCommunities, fetchCommunityByCode } from '@/lib/communityService';

export default function CommunitiesPage() {
  const [search, setSearch] = useState('');
  const [code, setCode] = useState('');
  const [codeResult, setCodeResult] = useState<DbCommunity | null>(null);
  const [codeError, setCodeError] = useState('');
  const [communities, setCommunities] = useState<DbCommunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [codeLooking, setCodeLooking] = useState(false);

  useEffect(() => {
    fetchCommunities()
      .then(setCommunities)
      .catch(err => console.error('Failed to load communities:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = communities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCodeSearch = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setCodeLooking(true);
    try {
      const found = await fetchCommunityByCode(trimmed);
      if (found) {
        setCodeResult(found);
        setCodeError('');
      } else {
        setCodeResult(null);
        setCodeError('No community found with this code. Please check and try again.');
      }
    } catch {
      setCodeError('Something went wrong. Please try again.');
    } finally {
      setCodeLooking(false);
    }
  };

  const displayType = (type: string) => type === 'invite_only' ? 'invite-only' : type;

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Explore Communities</h1>
            <p className="text-muted-foreground mt-1">Discover and join private travel communities</p>
          </div>
          <Button asChild>
            <Link to="/create-community" className="gap-2">
              <Plus className="h-4 w-4" /> Create Community
            </Link>
          </Button>
        </div>

        {/* Join by Code */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <KeyRound className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Join by Community Code</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Have an invite code? Enter it below to find your community.</p>
            <div className="flex gap-2 max-w-md">
              <Input
                placeholder="e.g. CM-00001-BD-26-04-14"
                value={code}
                onChange={e => { setCode(e.target.value); setCodeError(''); setCodeResult(null); }}
                className="font-mono text-sm"
              />
              <Button onClick={handleCodeSearch} variant="secondary" disabled={codeLooking}>
                {codeLooking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Lookup'}
              </Button>
            </div>
            {codeError && <p className="text-sm text-destructive mt-2">{codeError}</p>}
            {codeResult && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                <CommunityCard community={codeResult} />
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search communities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((community, i) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <CommunityCard community={community} />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No communities found</p>
            <p className="text-sm mt-1">Try a different search term, join using a community code, or create one!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CommunityCard({ community }: { community: DbCommunity }) {
  const displayType = community.type === 'invite_only' ? 'invite-only' : community.type;
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300 bg-card/80 backdrop-blur-sm border-border/50">
      <div className="relative h-36 overflow-hidden">
        {community.cover_image ? (
          <img src={community.cover_image} alt={community.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-5xl">{community.logo}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl shrink-0">{community.logo}</span>
            <h3 className="text-lg font-bold text-white drop-shadow-md truncate">{community.name}</h3>
          </div>
          <Badge variant="secondary" className="text-[10px] shrink-0 gap-1 bg-black/40 text-white border-white/20 backdrop-blur-sm">
            <Lock className="h-2.5 w-2.5" /> {displayType}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4 space-y-3">
        {community.tagline && (
          <p className="text-xs font-medium text-primary italic">"{community.tagline}"</p>
        )}
        <p className="text-sm text-muted-foreground line-clamp-2">{community.description}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {community.member_count} members
          </span>
        </div>
        <div className="flex gap-2 pt-1">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link to={`/communities/${community.id}`}>
              View Details <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
          <Button size="sm" className="flex-1" asChild>
            <Link to={`/communities/${community.id}`}>Request to Join</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
