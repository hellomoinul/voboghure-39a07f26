import { useNavigate } from 'react-router-dom';
import { motion, type Transition } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useBrand } from '@/contexts/BrandContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Sparkles, 
  Plus, 
  KeyRound, 
  Search, 
  Users, 
  Globe, 
  Calendar,
  BookOpen,
  Shield
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0, 0, 0.58, 1] } as Transition,
  }),
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { brand } = useBrand();

  // Mock data for connected communities (এটি পরে Supabase থেকে আসবে)
  const myCommunities = [
    { id: 'school-friends', name: 'School Friends', icon: '🏫', memberCount: 12 },
    { id: 'varsity-batch', name: 'University Batch', icon: '🎓', memberCount: 45 },
    { id: 'travel-club', name: 'Travel Buddies', icon: '🏔️', memberCount: 8 },
  ];

  return (
    <div className="relative min-h-screen bg-background bg-mesh overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8 }}
          >
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                {brand.tagline}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-6xl md:text-8xl font-bold leading-tight mb-4">
              <span className="glow-text">{brand.communityNameBn}</span>
            </h1>
            <p className="font-serif text-2xl md:text-3xl text-foreground/70 mb-12">
              {brand.communityName}
            </p>

            {/* --- LOGGED IN USER: SWITCHING DASHBOARD --- */}
            {isAuthenticated ? (
              <div className="space-y-10 w-full max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" /> Your Communities
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/communities')} className="text-primary">
                    See All
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {myCommunities.map((comm, i) => (
                    <motion.div
                      key={comm.id}
                      custom={i}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      onClick={() => navigate(`/dashboard/${comm.id}`)}
                      className="frosted-card p-6 cursor-pointer hover:border-primary/50 transition-all group flex flex-col items-center"
                    >
                      <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">{comm.icon}</span>
                      <h3 className="font-bold text-base mb-1">{comm.name}</h3>
                      <p className="text-xs text-muted-foreground">{comm.memberCount} Members</p>
                    </motion.div>
                  ))}

                  {/* Create/Join Options as Cards */}
                  <motion.div
                    onClick={() => navigate('/create-community')}
                    className="frosted-card p-6 cursor-pointer border-dashed border-primary/30 hover:bg-primary/5 flex flex-col items-center justify-center"
                  >
                    <Plus className="h-6 w-6 text-primary mb-2" />
                    <span className="text-sm font-medium">Create New</span>
                  </motion.div>
                </div>
              </div>
            ) : (
              /* --- NEW USER FLOW --- */
              <div className="space-y-12">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/login?mode=signup')} 
                    className="bg-primary text-white px-10 h-14 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                  >
                    Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => navigate('/login')} 
                    className="border-primary/30 text-primary hover:bg-primary/10 px-10 h-14 text-lg"
                  >
                    Member Log In
                  </Button>
                </div>

                {/* Quick Actions for Visitors */}
                <div className="flex flex-wrap justify-center gap-8 pt-10 border-t border-white/5">
                  <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Plus className="h-4 w-4" /> Create Community
                  </button>
                  <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <KeyRound className="h-4 w-4" /> Join with Code
                  </button>
                  <button onClick={() => navigate('/explore')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Search className="h-4 w-4" /> Search Public
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-black/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-serif">Storytelling</h3>
            <p className="text-muted-foreground leading-relaxed">আপনার স্মৃতিগুলোকে শুধু ছবি নয়, বরং গল্প হিসেবে বাঁচিয়ে রাখুন আপনার বন্ধুদের সাথে।</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
              <Calendar className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-serif">Event Timeline</h3>
            <p className="text-muted-foreground leading-relaxed">কবে কোথায় কী করেছিলেন, তার একটি সুন্দর টাইমলাইন যা বছরের পর বছর স্মরণে থাকবে।</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-serif">Complete Privacy</h3>
            <p className="text-muted-foreground leading-relaxed">সম্পূর্ণ এনক্রিপ্টেড এবং প্রাইভেট। আপনার কমিউনিটির কথা থাকবে কেবল আপনাদের মাঝেই।</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="font-serif font-bold text-lg">{brand.communityName}</span>
          <span className="text-primary opacity-50">|</span>
          <span className="text-sm text-muted-foreground">{brand.communityNameBn}</span>
        </div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">
          © {new Date().getFullYear()} • Developed by Md. Moinul Hasan Akash
        </p>
      </footer>
    </div>
  );
}