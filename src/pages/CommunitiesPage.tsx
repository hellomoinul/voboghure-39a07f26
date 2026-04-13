import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Users, Lock, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockCommunities } from '@/data/communityData';

export default function CommunitiesPage() {
  const [search, setSearch] = useState('');

  const filtered = mockCommunities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Explore Communities</h1>
        <p className="text-muted-foreground mt-1">Discover and join travel communities</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search communities..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((community, i) => (
          <motion.div
            key={community.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300 bg-card/80 backdrop-blur-sm border-border/50">
              <div className="relative h-36 overflow-hidden">
                <img
                  src={community.coverImage}
                  alt={community.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="text-2xl">{community.logo}</span>
                  <h3 className="text-lg font-bold text-white drop-shadow-md">{community.name}</h3>
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{community.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {community.memberCount} members
                  </span>
                  <Badge variant="outline" className="text-xs gap-1">
                    <Lock className="h-3 w-3" /> {community.type}
                  </Badge>
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
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No communities found</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
