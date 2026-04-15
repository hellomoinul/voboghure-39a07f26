import { useEffect, useState } from 'react';
import { useCommunity } from '@/contexts/CommunityContext'; // Context হুক ইম্পোর্ট
import { 
  getPendingJoinRequests, 
  handleJoinRequest, 
  approveAndAddMember 
} from '@/lib/communityService';
import { Check, X, Loader2, UserPlus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminRequestsPage() {
  const { activeCommunity } = useCommunity(); // এখান থেকে activeCommunity নিচ্ছি
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
    // ১. কমিউনিটি আইডি চেক করা
    if (!activeCommunity?.id) {
      alert("No active community selected!");
      return;
    }

    // ২. জয়েন রিকোয়েস্ট স্ট্যাটাস আপডেট করা
    const success = await handleJoinRequest(request.id, status);
    
    if (success && status === 'approved') {
      // ৩. অটো-মেম্বারশিপ লজিক কল করা
      const result = await approveAndAddMember(request.email, activeCommunity.id);
      
      if (result.success) {
        if (result.registered) {
          alert(`${request.full_name} এখন মেম্বার হিসেবে অ্যাড হয়ে গেছেন!`);
        } else {
          alert(`রিকোয়েস্ট অ্যাপ্রুভ হয়েছে। ইউজার এখনো সাইন-আপ করেনি, তাই মেম্বার লিস্টে পরে ম্যানুয়ালি অ্যাড করতে হতে পারে।`);
        }
      }
    }

    // ৪. লিস্ট আপডেট করা
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