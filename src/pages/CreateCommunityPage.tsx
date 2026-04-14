import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Copy, Palette, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { GooglePhotosInput } from '@/components/GooglePhotosInput';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunity } from '@/contexts/CommunityContext';
import { createCommunity, addCommunityMember } from '@/lib/communityService';

const THEME_COLORS = [
  { label: 'Indigo', value: '#6366f1' },
  { label: 'Emerald', value: '#10b981' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Sky', value: '#0ea5e9' },
  { label: 'Violet', value: '#8b5cf6' },
];

export default function CreateCommunityPage() {
  const { user } = useAuth();
  const { refreshMemberships } = useCommunity();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tagline, setTagline] = useState('');
  const [themeColor, setThemeColor] = useState('#6366f1');
  const [communityType, setCommunityType] = useState<'private' | 'invite_only'>('private');
  const [submitting, setSubmitting] = useState(false);
  const [createdCode, setCreatedCode] = useState('');

  const generatedCode = useMemo(() => {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const seq = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0');
    return `CM-${seq}-BD-${yy}-${mm}-${dd}`;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      toast.error('Please fill in the required fields.');
      return;
    }
    if (!user) {
      toast.error('You must be logged in to create a community.');
      return;
    }

    setSubmitting(true);
    try {
      const community = await createCommunity({
        name: name.trim(),
        description: description.trim(),
        logo: logo.trim() || '😎',
        cover_image: coverImage.trim() || undefined,
        tagline: tagline.trim() || undefined,
        theme_color: themeColor,
        type: communityType,
        code: generatedCode,
        created_by: user.id,
      });

      // Add creator as community_admin
      await addCommunityMember(community.id, user.id, 'community_admin');
      await refreshMemberships();
      setCreatedCode(generatedCode);
      toast.success('Community created!');
    } catch (err: any) {
      console.error(err);
      if (err?.code === '23505') {
        toast.error('A community with this code already exists. Please try again.');
      } else {
        toast.error('Failed to create community. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(createdCode || generatedCode);
    toast.success('Community code copied!');
  };

  if (createdCode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 text-center">
            <CardContent className="p-8 space-y-4">
              <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-xl font-bold text-foreground">Community Created Successfully</h2>
              <p className="text-sm text-muted-foreground">Share your community code with members so they can find and join.</p>
              <div className="flex items-center justify-center gap-2 bg-muted/50 rounded-lg px-4 py-3">
                <code className="font-mono text-sm text-foreground">{createdCode}</code>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyCode}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
              <Button asChild className="w-full mt-2">
                <Link to="/communities">Back to Communities</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/communities" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> All Communities
          </Link>
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">Create a Community</CardTitle>
              <p className="text-sm text-muted-foreground">Set up a private space for your group's adventures and memories.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Community Name <span className="text-destructive">*</span></Label>
                  <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Voboghure— ভবঘুরে" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desc">Short Description <span className="text-destructive">*</span></Label>
                  <Textarea id="desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="What is this community about?" rows={3} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo (emoji or Google Photos link)</Label>
                  <Input id="logo" value={logo} onChange={e => setLogo(e.target.value)} placeholder="e.g. 😎 or paste a Google Photos link" />
                  <p className="text-xs text-muted-foreground">Enter a single emoji or paste a Google Photos link for your logo.</p>
                </div>

                <div className="space-y-2">
                  <Label>Cover Image (optional)</Label>
                  <GooglePhotosInput value={coverImage} onChange={setCoverImage} placeholder="Paste Google Photos link (make sure it's shareable)" />
                  <p className="text-xs text-muted-foreground">Paste Google Photos link (make sure it's shareable)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline (optional)</Label>
                  <Input id="tagline" value={tagline} onChange={e => setTagline(e.target.value)} placeholder="e.g. Wander together, remember forever" />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Palette className="h-3.5 w-3.5" /> Theme Color (optional)</Label>
                  <div className="flex flex-wrap gap-2">
                    {THEME_COLORS.map(c => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setThemeColor(c.value)}
                        className={`h-8 w-8 rounded-full border-2 transition-all ${themeColor === c.value ? 'border-foreground scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c.value }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Community Type</Label>
                  <div className="flex gap-3">
                    {(['private', 'invite_only'] as const).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setCommunityType(t)}
                        className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                          communityType === t
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground hover:border-primary/40'
                        }`}
                      >
                        {t === 'private' ? '🔒 Private' : '✉️ Invite-only'}
                        <p className="text-xs font-normal mt-1 text-muted-foreground">
                          {t === 'private' ? 'Members request to join' : 'Join only via invite code'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-border/50 bg-muted/30 p-4 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Auto-generated Community Code</p>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-sm text-foreground">{generatedCode}</code>
                    <Badge variant="outline" className="text-[10px]">Preview</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Share this code so others can find and join your community.</p>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Create Community
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
