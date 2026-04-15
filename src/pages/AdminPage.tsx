import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunity } from '@/contexts/CommunityContext';
import { Shield, Users, Clock, UserPlus, UserMinus, ChevronUp, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  fetchPendingRequests,
  approveRequest,
  rejectRequest,
  fetchCommunityMembers,
  removeMember,
  updateMemberRole,
  JoinRequestWithUser,
  CommunityMemberRow,
} from '@/lib/communityAdminService';

export default function AdminPage() {
  const { user, isDemo } = useAuth();
  const { activeCommunity, joinedCommunities } = useCommunity();
  const { toast } = useToast();

  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [requests, setRequests] = useState<JoinRequestWithUser[]>([]);
  const [members, setMembers] = useState<CommunityMemberRow[]>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Determine admin status from joined communities context
  useEffect(() => {
    if (!activeCommunity || !user) {
      setIsAdmin(false);
      setChecking(false);
      return;
    }
    // Check from community_members via the service
    import('@/lib/communityAdminService').then(({ fetchCommunityMembers: fetch }) => {
      fetch(activeCommunity.id).then(mems => {
        const me = mems.find(m => m.user_id === user.id);
        setIsAdmin(me?.role === 'community_admin');
        setChecking(false);
      }).catch(() => setChecking(false));
    });
  }, [activeCommunity, user]);

  const loadData = useCallback(async () => {
    if (!activeCommunity) return;
    try {
      const [reqs, mems] = await Promise.all([
        fetchPendingRequests(activeCommunity.id),
        fetchCommunityMembers(activeCommunity.id),
      ]);
      setRequests(reqs);
      setMembers(mems);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  }, [activeCommunity]);

  useEffect(() => {
    if (isAdmin && activeCommunity) loadData();
  }, [isAdmin, activeCommunity, loadData]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isDemo) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-bold mb-2">Admin Access Restricted</h1>
          <p className="text-muted-foreground">Demo users cannot access the admin panel.</p>
        </motion.div>
      </div>
    );
  }

  if (!activeCommunity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Users className="h-10 w-10 text-muted-foreground/50 mx-auto" />
          <p className="text-muted-foreground">Select a community to manage.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Shield className="h-10 w-10 text-muted-foreground/50 mx-auto" />
          <p className="text-lg font-semibold text-foreground">Access Denied</p>
          <p className="text-sm text-muted-foreground">You are not an admin of this community.</p>
        </div>
      </div>
    );
  }

  const handleApprove = async (req: JoinRequestWithUser) => {
    setLoadingAction(req.id);
    try {
      await approveRequest(req.id, req.community_id, req.user_id);
      toast({ title: 'Request approved', description: 'User has been added as a member.' });
      loadData();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReject = async (req: JoinRequestWithUser) => {
    setLoadingAction(req.id);
    try {
      await rejectRequest(req.id);
      toast({ title: 'Request rejected' });
      loadData();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRemove = async (member: CommunityMemberRow) => {
    if (member.user_id === user?.id) {
      toast({ title: 'Cannot remove yourself', variant: 'destructive' });
      return;
    }
    setLoadingAction(member.id);
    try {
      await removeMember(member.id);
      toast({ title: 'Member removed' });
      loadData();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoadingAction(null);
    }
  };

  const handlePromote = async (member: CommunityMemberRow) => {
    setLoadingAction(member.id);
    try {
      const newRole = member.role === 'community_admin' ? 'member' : 'community_admin';
      await updateMemberRole(member.id, newRole);
      toast({ title: `Role updated to ${newRole === 'community_admin' ? 'Admin' : 'Member'}` });
      loadData();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-3xl font-bold flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" /> Community Admin
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage <span className="font-medium text-foreground">{activeCommunity.name}</span>
        </p>
      </motion.div>

      {/* Stats row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <Clock className="h-5 w-5 text-primary mb-2" />
          <p className="text-2xl font-bold">{requests.length}</p>
          <p className="text-sm text-muted-foreground">Pending Requests</p>
        </div>
        <div className="glass-card p-5">
          <Users className="h-5 w-5 text-primary mb-2" />
          <p className="text-2xl font-bold">{members.length}</p>
          <p className="text-sm text-muted-foreground">Total Members</p>
        </div>
      </div>

      {/* Pending Join Requests */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <h2 className="font-serif text-lg font-bold">Pending Join Requests</h2>
          </div>
          {requests.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No pending requests.</div>
          ) : (
            <div className="divide-y divide-border">
              {requests.map(req => (
                <div key={req.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">User: {req.user_id.slice(0, 8)}…</p>
                    <p className="text-xs text-muted-foreground">Requested {new Date(req.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={loadingAction === req.id}
                      onClick={() => handleReject(req)}
                      className="text-destructive hover:text-destructive"
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      disabled={loadingAction === req.id}
                      onClick={() => handleApprove(req)}
                    >
                      <UserPlus className="h-3.5 w-3.5 mr-1" /> Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Members */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <h2 className="font-serif text-lg font-bold">Members</h2>
          </div>
          {members.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No members yet.</div>
          ) : (
            <div className="divide-y divide-border">
              {members.map(member => {
                const isSelf = member.user_id === user?.id;
                return (
                  <div key={member.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {member.user_id.slice(0, 8)}… {isSelf && <span className="text-xs text-muted-foreground">(you)</span>}
                        </p>
                        <p className="text-xs text-muted-foreground">Joined {new Date(member.joined_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={member.role === 'community_admin' ? 'default' : 'secondary'} className="text-xs">
                        {member.role === 'community_admin' ? 'Admin' : 'Member'}
                      </Badge>
                      {!isSelf && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={loadingAction === member.id}
                            onClick={() => handlePromote(member)}
                            title={member.role === 'community_admin' ? 'Demote to member' : 'Promote to admin'}
                          >
                            <ChevronUp className={`h-4 w-4 ${member.role === 'community_admin' ? 'rotate-180' : ''}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={loadingAction === member.id}
                            onClick={() => handleRemove(member)}
                            className="text-destructive hover:text-destructive"
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
