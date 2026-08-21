import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunity } from '@/contexts/CommunityContext';
import { Shield, Users, Clock, UserPlus, UserMinus, ChevronUp, AlertTriangle, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner'; // UI consistent রাখার জন্য sonner ব্যবহার করছি
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
  const { activeCommunity } = useCommunity();

  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [requests, setRequests] = useState<JoinRequestWithUser[]>([]);
  const [members, setMembers] = useState<CommunityMemberRow[]>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!activeCommunity) return;
    try {
      const [reqs, mems] = await Promise.all([
        fetchPendingRequests(activeCommunity.id),
        fetchCommunityMembers(activeCommunity.id),
      ]);
      setRequests(reqs);
      setMembers(mems);
      
      // বর্তমান ইউজারের রোল চেক করা
      const me = mems.find(m => m.user_id === user?.id);
      setIsAdmin((me as any)?.role === 'community_admin' || (me as any)?.role === 'admin');
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setChecking(false);
    }
  }, [activeCommunity, user]);

  useEffect(() => {
    if (activeCommunity) loadData();
  }, [activeCommunity, loadData]);

  const handleApprove = async (req: any) => {
    setLoadingAction(req.id);
    try {
      // আপনার ট্রিগার লজিক অনুযায়ী 'member' রোল সেট হবে
      await approveRequest(req.id, req.community_id, req.user_id);
      toast.success('Member Approved', { description: 'Notification sent to user automatically.' });
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReject = async (req: any) => {
    setLoadingAction(req.id);
    try {
      await rejectRequest(req.id);
      toast.info('Request Rejected');
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRemove = async (member: any) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    setLoadingAction(member.id);
    try {
      await removeMember(member.id);
      toast.success('Member removed from community');
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleToggleRole = async (member: any) => {
    setLoadingAction(member.id);
    try {
      const newRole = member.role === 'community_admin' ? 'member' : 'community_admin';
      await updateMemberRole(member.id, newRole);
      toast.success(`Promoted to ${newRole}`);
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  if (checking) return (
    <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  );

  if (!isAdmin) return (
    <div className="p-12 text-center glass-card max-w-lg mx-auto mt-20">
      <Shield className="h-12 w-12 text-destructive mx-auto mb-4" />
      <h2 className="text-xl font-bold">Unauthorized Access</h2>
      <p className="text-muted-foreground mt-2">Only community admins can view this page.</p>
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 text-white">
      <header>
        <h1 className="font-serif text-3xl font-bold flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" /> Community Management
        </h1>
        <p className="text-muted-foreground mt-1 italic">Control center for {activeCommunity?.name}</p>
      </header>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="glass-card p-6 border-l-4 border-yellow-500 bg-yellow-500/5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold">{requests.length}</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Pending Requests</p>
            </div>
            <Clock className="h-10 w-10 text-yellow-500/20" />
          </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-primary bg-primary/5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold">{members.length}</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Active Members</p>
            </div>
            <Users className="h-10 w-10 text-primary/20" />
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="font-serif text-xl font-bold flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-yellow-500" /> Waitlist
        </h2>
        <div className="glass-card overflow-hidden divide-y divide-white/5">
          {requests.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground italic">No pending join requests.</div>
          ) : (
            requests.map(req => (
              <div key={req.id} className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <img src={(req as any).profiles?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${req.user_id}`} className="w-10 h-10 rounded-full object-cover border border-white/10" alt="" />
                  <div>
                    <p className="font-bold text-sm">{(req as any).profiles?.name || 'Unknown Explorer'}</p>
                    <p className="text-[10px] text-muted-foreground">Requested {new Date(req.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleReject(req)} disabled={!!loadingAction} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                    <XCircle className="h-4 w-4 mr-1" /> Reject
                  </Button>
                  <Button size="sm" onClick={() => handleApprove(req)} disabled={!!loadingAction} className="bg-green-600 hover:bg-green-700">
                    {loadingAction === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle2 className="h-4 w-4 mr-1" /> Approve</>}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-xl font-bold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" /> Community Roster
        </h2>
        <div className="glass-card overflow-hidden divide-y divide-white/5">
          {members.map(member => (
            <div key={member.id} className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <img src={(member as any).profiles?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${member.user_id}`} className="w-10 h-10 rounded-full object-cover border border-white/10" alt="" />
                <div>
                  <p className="font-bold text-sm">
                    {(member as any).profiles?.name || 'Member'} 
                    {member.user_id === user?.id && <span className="ml-2 text-[10px] bg-white/10 px-1.5 py-0.5 rounded italic">You</span>}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant={member.role === 'community_admin' ? 'default' : 'secondary'} className="text-[9px] py-0 px-2 h-4 uppercase">
                      {member.role}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">Joined {new Date(member.joined_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              {member.user_id !== user?.id && (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleToggleRole(member)} disabled={!!loadingAction} title="Toggle Admin/Member">
                    <ChevronUp className={`h-4 w-4 transition-transform ${member.role === 'community_admin' ? 'rotate-180 text-red-400' : 'text-primary'}`} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleRemove(member)} disabled={!!loadingAction} className="text-muted-foreground hover:text-red-400">
                    <UserMinus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}