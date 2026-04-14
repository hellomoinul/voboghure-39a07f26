import { createContext, useContext, useState, ReactNode } from 'react';
import { mockCommunities, Community } from '@/data/communityData';

type MembershipStatus = 'not-joined' | 'pending' | 'joined';

interface CommunityState {
  activeCommunity: Community | null;
  setActiveCommunity: (community: Community | null) => void;
  joinedCommunities: Community[];
  getMembershipStatus: (communityId: string) => MembershipStatus;
  requestJoin: (communityId: string) => void;
}

const CommunityContext = createContext<CommunityState | undefined>(undefined);

// Mock: first community is "joined", rest are not
const DEFAULT_JOINED_IDS = ['voboghure'];
const DEFAULT_PENDING_IDS: string[] = [];

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [activeCommunity, setActiveCommunity] = useState<Community | null>(
    mockCommunities.find(c => c.id === 'voboghure') || null
  );
  const [joinedIds, setJoinedIds] = useState<string[]>(DEFAULT_JOINED_IDS);
  const [pendingIds, setPendingIds] = useState<string[]>(DEFAULT_PENDING_IDS);

  const joinedCommunities = mockCommunities.filter(c => joinedIds.includes(c.id));

  const getMembershipStatus = (communityId: string): MembershipStatus => {
    if (joinedIds.includes(communityId)) return 'joined';
    if (pendingIds.includes(communityId)) return 'pending';
    return 'not-joined';
  };

  const requestJoin = (communityId: string) => {
    if (!joinedIds.includes(communityId) && !pendingIds.includes(communityId)) {
      setPendingIds(prev => [...prev, communityId]);
    }
  };

  return (
    <CommunityContext.Provider value={{ activeCommunity, setActiveCommunity, joinedCommunities, getMembershipStatus, requestJoin }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error('useCommunity must be used within CommunityProvider');
  return ctx;
}
