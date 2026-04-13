import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Users, Lock, ArrowRight, KeyRound, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockCommunities, Community } from '@/data/communityData';

export default function CommunitiesPage() {
  const [search, setSearch] = useState('');
  const [code, setCode] = useState('');
  const [codeResult, setCodeResult] = useState<Community | null>(null);
  const [codeError, setCodeError] = useState('');

  const filtered = mockCommunities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCodeSearch = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    const found = mockCommunities.find(c => c.code === trimmed);
    if (found) {
      setCodeResult(found);
      setCodeError('');
    } else {
      setCodeResult(null);
      setCodeError('No community found with this code. Please check and try again.');
    }
  };

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
                placeholder="e.g. CM-00001-BD-19-01-15"
                value={code}
                onChange={e => { setCode(e.target.value); setCodeError(''); setCodeResult(null); }}
                className="font-mono text-sm"
              />
              <Button onClick={handleCodeSearch} variant="secondary">Lookup</Button>
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

        {/* Grid */}
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

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No communities found</p>
            <p className="text-sm mt-1">Try a different search term or join using a community code</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CommunityCard({ community }: { community: Community }) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300 bg-card/80 backdrop-blur-sm border-border/50">
      <div className="relative h-36 overflow-hidden">
        <img
          src={community.coverImage}
          alt={community.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl shrink-0">{community.logo}</span>
            <h3 className="text-lg font-bold text-white drop-shadow-md truncate">{community.name}</h3>
          </div>
          <Badge variant="secondary" className="text-[10px] shrink-0 gap-1 bg-black/40 text-white border-white/20 backdrop-blur-sm">
            <Lock className="h-2.5 w-2.5" /> {community.type}
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
            <Users className="h-3.5 w-3.5" /> {community.memberCount} members
          </span>
        </div>
        <div className="flex gap-2 pt-1">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link to={`/communities/${community.id}`}>
              View Details <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
          <Button size="sm" className="flex-1">Request to Join</Button>
        </div>
      </CardContent>
    </Card>
  );
}
