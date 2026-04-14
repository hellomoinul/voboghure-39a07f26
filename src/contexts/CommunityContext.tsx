import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DbCommunity, fetchUserMemberships } from '@/lib/communityService';

interface CommunityState {
  activeCommunity: DbCommunity | null;
  setActiveCommunity: (community: DbCommunity | null) => void;
  joinedCommunities: DbCommunity[];
  loading: boolean;
  refreshMemberships: () => Promise<void>;
}

const CommunityContext = createContext<CommunityState | undefined>(undefined);

export function CommunityProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isDemo } = useAuth();
  const [activeCommunity, setActiveCommunity] = useState<DbCommunity | null>(null);
  const [joinedCommunities, setJoinedCommunities] = useState<DbCommunity[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshMemberships = useCallback(async () => {
    if (!user || isDemo) {
      setJoinedCommunities([]);
      setActiveCommunity(null);
      return;
    }
    setLoading(true);
    try {
      const memberships = await fetchUserMemberships(user.id);
      const communities = memberships.map(m => m.communities).filter(Boolean);
      setJoinedCommunities(communities);
      // Auto-select first if no active
      if (!activeCommunity && communities.length > 0) {
        setActiveCommunity(communities[0]);
      }
    } catch (err) {
      console.error('Failed to load memberships:', err);
    } finally {
      setLoading(false);
    }
  }, [user, isDemo]);

  useEffect(() => {
    if (isAuthenticated && !isDemo) {
      refreshMemberships();
    }
  }, [isAuthenticated, isDemo, refreshMemberships]);

  return (
    <CommunityContext.Provider value={{ activeCommunity, setActiveCommunity, joinedCommunities, loading, refreshMemberships }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error('useCommunity must be used within CommunityProvider');
  return ctx;
}
