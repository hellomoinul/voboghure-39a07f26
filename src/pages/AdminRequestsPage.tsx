import { useEffect, useState } from 'react';
import { 
  getPendingJoinRequests, 
  handleJoinRequest
} from '@/lib/communityService';
import { toast } from 'sonner';
import { Check, X, Loader2, UserPlus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    setIsLoading(true);
    const data = await getPendingJoinRequests();
    setRequests(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const onAction = async (request: any, status: 'approved' | 'rejected') => {
    const success = await handleJoinRequest(request.id, status);

    if (success && status === 'approved') {
      toast.success(`${request.full_name} approved. Create their login via Supabase Dashboard > Authentication > Add User.`);
    } else if (success) {
      toast(`${request.full_name}'s request rejected.`);
    } else {
      toast.error('Something went wrong. Please try again.');
    }

    setRequests(prev => prev.filter(r => r.id !== request.id));
  };

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin text-primary h-8 w-8" />
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserPlus className="h-6 w-6 text-primary" /> Join Requests
        </h1>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
          {requests.length} Pending
        </span>
      </div>

      <div className="grid gap-4">
        {requests.length > 0 ? requests.map((req) => (
          <Card key={req.id} className="overflow-hidden border-l-4 border-l-yellow-500 hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">{req.full_name}</h3>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {new Date(req.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-primary font-medium">{req.email}</p>
                <p className="text-sm text-muted-foreground mt-2 bg-secondary/30 p-3 rounded-lg italic">
                  "{req.reason}"
                </p>
                {req.referral && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Referred by: <span className="text-foreground font-semibold">{req.referral}</span>
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => onAction(req, 'rejected')}
                >
                  <X className="h-4 w-4 mr-1" /> Reject
                </Button>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => onAction(req, 'approved')}
                >
                  <Check className="h-4 w-4 mr-1" /> Approve
                </Button>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="text-center py-20 bg-secondary/10 rounded-2xl border-2 border-dashed border-border">
            <p className="text-muted-foreground italic">No pending requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
}