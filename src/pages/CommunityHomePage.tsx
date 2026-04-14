import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, BookOpen, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCommunity } from '@/contexts/CommunityContext';

function EmptySection({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Icon className="h-10 w-10 text-muted-foreground/40 mb-3" />
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-xs text-muted-foreground/70 mt-1">{description}</p>
    </div>
  );
}

export default function CommunityHomePage() {
  const { activeCommunity } = useCommunity();

  if (!activeCommunity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <p className="text-lg text-muted-foreground">No active community selected</p>
          <Button asChild variant="outline">
            <Link to="/communities">Browse Communities</Link>
          </Button>
        </div>
      </div>
    );
  }

  const sections = [
    { title: 'Events', icon: Calendar, emptyTitle: 'No events yet', emptyDesc: 'Community events will appear here.', link: '/events' },
    { title: 'Stories', icon: BookOpen, emptyTitle: 'No stories yet', emptyDesc: 'Member stories will appear here.', link: '/stories' },
    { title: 'Members', icon: Users, emptyTitle: 'No members to show', emptyDesc: 'Community members will appear here.', link: '/members' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <span className="text-3xl">{activeCommunity.logo}</span>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{activeCommunity.name}</h1>
          {activeCommunity.tagline && (
            <p className="text-sm text-muted-foreground italic">"{activeCommunity.tagline}"</p>
          )}
        </div>
      </motion.div>

      {/* Sections */}
      <div className="grid gap-6">
        {sections.map((section, i) => (
          <motion.div key={section.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <section.icon className="h-4 w-4 text-primary" />
                    <h2 className="text-base font-semibold text-foreground">{section.title}</h2>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground">
                    <Link to={section.link}>View All <ArrowRight className="h-3 w-3 ml-1" /></Link>
                  </Button>
                </div>
                <EmptySection icon={section.icon} title={section.emptyTitle} description={section.emptyDesc} />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
