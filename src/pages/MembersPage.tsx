import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // লিঙ্কিং এর জন্য
import { useCommunity } from '@/contexts/CommunityContext';
import { getCommunityMembers } from '@/lib/communityService';
import { Loader2, Search, UserCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function MembersPage() {
  const { activeCommunity } = useCommunity();
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchMembers() {
      if (activeCommunity?.id) {
        setIsLoading(true);
        const data = await getCommunityMembers(activeCommunity.id);
        setMembers(data);
        setIsLoading(false);
      }
    }
    fetchMembers();
  }, [activeCommunity?.id]);

  const filteredMembers = members.filter(m => 
    m.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Community Members ({members.length})</h1>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search members..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMembers.map((member) => (
          <Link to={`/members/${member.user_id}`} key={member.user_id}> {/* ডাইনামিক রুট */}
            <Card className="overflow-hidden hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                <div className="h-20 w-20 rounded-full overflow-hidden bg-secondary border-2 border-transparent hover:border-primary/20 transition-all">
                  {member.profiles?.avatar_url ? (
                    <img src={member.profiles.avatar_url} alt={member.profiles.full_name} className="h-full w-full object-cover" />
                  ) : (
                    <UserCircle className="h-full w-full text-muted-foreground/20" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {member.profiles?.full_name || "Anonymous"}
                  </h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{member.role}</p>
                </div>
                {member.profiles?.designation && (
                  <p className="text-[11px] text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 w-fit">
                    {member.profiles.designation}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}