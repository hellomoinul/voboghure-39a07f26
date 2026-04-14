import { Link } from 'react-router-dom';
import { ChevronDown, Plus, Compass, Loader2 } from 'lucide-react';
import { useCommunity } from '@/contexts/CommunityContext';
import { DbCommunity } from '@/lib/communityService';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export function CommunitySwitcher() {
  const { activeCommunity, setActiveCommunity, joinedCommunities, loading } = useCommunity();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-secondary transition-colors text-sm font-medium text-foreground">
          <span className="text-lg leading-none">{activeCommunity?.logo || '🌐'}</span>
          <span className="hidden sm:inline truncate max-w-[120px]">{activeCommunity?.name || 'Select Community'}</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 bg-card border-border">
        <div className="px-3 py-2 border-b border-border">
          <p className="text-xs font-medium text-muted-foreground">Your Communities</p>
        </div>
        {loading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
        {!loading && joinedCommunities.length === 0 && (
          <div className="px-3 py-4 text-center">
            <p className="text-xs text-muted-foreground">No communities yet</p>
          </div>
        )}
        {!loading && joinedCommunities.map(c => (
          <DropdownMenuItem
            key={c.id}
            onClick={() => setActiveCommunity(c)}
            className={`cursor-pointer gap-2 ${activeCommunity?.id === c.id ? 'bg-primary/10 text-primary' : ''}`}
          >
            <span className="text-lg">{c.logo}</span>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.member_count} members</p>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer gap-2">
          <Link to="/communities">
            <Compass className="h-4 w-4" /> Browse Communities
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer gap-2">
          <Link to="/create-community">
            <Plus className="h-4 w-4" /> Create Community
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
