import { useNavigate } from 'react-router-dom';
import { motion, type Transition } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useBrand } from '@/contexts/BrandContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { events, stories, members } from '@/data/mockData';
import { ArrowRight, Sparkles, Play, Plus, KeyRound, LayoutDashboard } from 'lucide-react';
import { useMemo } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0, 0, 0.58, 1] } as Transition,
  }),
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { loginAsDemo, isAuthenticated } = useAuth();
  const { brand } = useBrand();

  const handleDemoAccess = () => {
    loginAsDemo();
    navigate('/dashboard');
  };

  // Static/Mock Connected Communities for the user
  const myCommunities = [
    { id: 'school', name: 'School Friends', icon: '🏫' },
    { id: 'varsity', name: 'University Batch', icon: '🎓' }
  ];

  const activeMembers = members.filter(m => m.role !== 'demo');
  const oldestEvent = events.length > 0 ? events[events.length - 1] : null;
  const yearsActive = oldestEvent ? new Date().getFullYear() - new Date(oldestEvent.date).getFullYear() : 0;

  const pastAdventures = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 3);
  }, []);

  return (
    <div className="relative min-h-screen bg-background bg-mesh">
      <Navbar />
      
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop"
            alt="Mountains"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">{brand.tagline}</span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-4">
              <span className="glow-text">{brand.communityNameBn}</span>
            </h1>
            <p className="font-serif text-2xl md:text-3xl text-foreground/80 mb-2">{brand.communityName}</p>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Every event is a story, every story a memory, and every memory stays alive forever.
            </p>

            {/* --- CORE LOGIC AREA --- */}
            <div className="flex flex-col items-center gap-6">
              {isAuthenticated ? (
                /* EXISTING MEMBER SECTION */
                <div className="w-full space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    {myCommunities.map((comm) => (
                      <button
                        key={comm.id}
                        onClick={() => navigate(`/dashboard/${comm.id}`)}
                        className="frosted-card p-4 hover:border-primary/50 transition-all group flex flex-col items-center gap-2"
                      >
                        <span className="text-2xl">{comm.icon}</span>
                        <span className="text-xs font-bold uppercase tracking-tighter">{comm.name}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => navigate('/create-community')}
                      className="frosted-card p-4 border-dashed border-primary/30 flex flex-col items-center justify-center gap-2"
                    >
                      <Plus className="h-5 w-5 text-primary/60" />
                      <span className="text-[10px] font-bold uppercase">New Circle</span>
                    </button>
                  </div>
                  <Button variant="link" onClick={() => navigate('/communities')} className="text-primary text-sm">
                    Explore or Join Other Communities <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              ) : (
                /* NEW USER SECTION */
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" onClick={() => navigate('/login')} className="bg-primary text-primary-foreground px-8 h-12 font-semibold">
                    Member Login <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleDemoAccess} className="border-primary/30 text-primary px-8 h-12">
                    <Play className="mr-2 h-4 w-4" /> Try Demo
                  </Button>
                  <Button variant="ghost" size="lg" onClick={() => navigate('/login?mode=signup')} className="text-muted-foreground h-12">
                    Request Membership
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- REST OF YOUR ORIGINAL DESIGN (STAYING UNTOUCHED) --- */}
      <section className="py-24 px-4 border-y border-border/30">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[{ value: events.length, label: 'Adventures' }, { value: stories.length, label: 'Stories' }, { value: activeMembers.length, label: 'Members' }, { value: `${yearsActive}+`, label: 'Years' }].map((stat, i) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold glow-text">{stat.value}</div>
              <div className="text-xs text-muted-foreground uppercase mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-12 text-center text-xs text-muted-foreground uppercase tracking-widest">
        © {new Date().getFullYear()} {brand.communityName} • {brand.communityNameBn}
      </footer>
    </div>
  );
}