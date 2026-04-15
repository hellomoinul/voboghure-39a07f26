import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunity } from '@/contexts/CommunityContext';
import { getMyNotifications, markNotificationAsRead } from '@/lib/communityService';
import { supabase } from '@/lib/supabase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function NotificationBell() {
  const { user } = useAuth();
  const { activeCommunity } = useCommunity();
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    if (!user || !activeCommunity) return;

    // ১. শুরুতে নোটিফিকেশন লোড করা
    const fetchNotifs = async () => {
      const data = await getMyNotifications(user.id, activeCommunity.id);
      setNotifications(data);
    };
    fetchNotifs();

    // ২. রিয়েল-টাইম লিসেনার (নতুন নোটিফিকেশন আসলে সাথে সাথে আপডেট হবে)
    const channel = supabase
      .channel('realtime_notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
        // এখানে চাইলে একটি ব্রাউজার সাউন্ড বা টোস্ট যোগ করা যায়
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, activeCommunity]);

  const handleRead = async (notif: any) => {
    if (!notif.is_read) {
      await markNotificationAsRead(notif.id);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
    }
    if (notif.link) navigate(notif.link);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-background animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-2">
        <h3 className="p-2 font-bold text-sm">Notifications</h3>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-xs text-muted-foreground">No notifications yet</p>
          ) : (
            notifications.map((n) => (
              <DropdownMenuItem 
                key={n.id} 
                onClick={() => handleRead(n)}
                className={`p-3 cursor-pointer flex flex-col items-start gap-1 rounded-lg mb-1 ${!n.is_read ? 'bg-primary/5' : ''}`}
              >
                <div className="flex justify-between w-full">
                  <span className="font-bold text-xs">{n.title}</span>
                  <span className="text-[10px] text-muted-foreground">{new Date(n.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
// ফাইলের সব কোডের নিচে এটি যুক্ত করুন
export default NotificationBell;