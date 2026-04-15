export type CommunityAccessState = 'NO_COMMUNITY' | 'NOT_JOINED' | 'PENDING' | 'OK';

export function resolveCommunityAccess({
  activeCommunity,
  joinedCommunityIds,
  pendingCommunityIds,
}: {
  activeCommunity: { id: string } | null;
  joinedCommunityIds: string[];
  pendingCommunityIds: string[];
}): CommunityAccessState {
  if (!activeCommunity) return 'NO_COMMUNITY';
  if (joinedCommunityIds.includes(activeCommunity.id)) return 'OK';
  if (pendingCommunityIds.includes(activeCommunity.id)) return 'PENDING';
  return 'NOT_JOINED';
}
