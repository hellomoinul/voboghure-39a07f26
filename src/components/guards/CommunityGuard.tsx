import { ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCommunity } from '@/contexts/CommunityContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { resolveCommunityAccess, CommunityAccessState } from '@/lib/guards/communityGuard';

export function CommunityGuard({ children }: { children: ReactNode }) {
  const { activeCommunity, joinedCommunities } = useCommunity();
  const { user } = useAuth();
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPending() {
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from('community_join_requests')
        .select('community_id')
        .eq('user_id', user.id)
        .eq('status', 'pending');
      setPendingIds((data || []).map(r => r.community_id));
      setLoading(false);
    }
    loadPending();
  }, [user]);

  if (loading) return null;

  const state: CommunityAccessState = resolveCommunityAccess({
    activeCommunity,
    joinedCommunityIds: joinedCommunities.map(c => c.id),
    pendingCommunityIds: pendingIds,
  });

  if (state === 'OK') return <>{children}</>;

  const config: Record<Exclude<CommunityAccessState, 'OK'>, { icon: React.ElementType; title: string; description: string; action?: { label: string; to: string } }> = {
    NO_COMMUNITY: {
      icon: Users,
      title: 'Select a community to continue',
      description: 'You need to select or join a community before accessing this page.',
      action: { label: 'Browse Communities', to: '/communities' },
    },
    NOT_JOINED: {
      icon: ShieldAlert,
      title: 'You need to join this community',
      description: 'Request access or join a community to view its content.',
      action: { label: 'Browse Communities', to: '/communities' },
    },
    PENDING: {
      icon: Clock,
      title: 'Your request is pending approval',
      description: 'A community admin will review your request. You\'ll get access once approved.',
    },
  };

  const c = config[state];

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4 max-w-sm">
        <c.icon className="h-12 w-12 text-muted-foreground/50 mx-auto" />
        <h2 className="text-lg font-semibold text-foreground">{c.title}</h2>
        <p className="text-sm text-muted-foreground">{c.description}</p>
        {c.action && (
          <Button asChild variant="outline">
            <Link to={c.action.to}>{c.action.label}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
