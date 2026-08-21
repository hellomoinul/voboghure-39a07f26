import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase'; // সুপাবেস ক্লায়েন্ট

export default function RequestAccessPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: '',
    referral: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ১. ডাটাবেসে রিকোয়েস্ট সেভ করা
      const { error: requestError } = await supabase
        .from('join_requests')
        .insert([{
          full_name: formData.name,
          email: formData.email,
          reason: formData.reason,
          referral: formData.referral
        }]);

      if (requestError) throw requestError;

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-serif text-2xl font-bold mb-2 text-foreground">Request Submitted!</h2>
              <p className="text-sm text-muted-foreground">
                An admin will review your request and reach out soon. Thank you for your interest in Voboghure!
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="font-serif text-2xl font-bold text-foreground">Request Access</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Voboghure is invite-only. Tell us why you'd like to join.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Your name" 
                    className="bg-secondary/50 border-border" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com" 
                    className="bg-secondary/50 border-border" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Why do you want to join?</Label>
                  <Textarea 
                    id="reason" 
                    placeholder="Tell us about yourself..." 
                    className="bg-secondary/50 border-border min-h-[100px]" 
                    required 
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referral">Referred by (optional)</Label>
                  <Input 
                    id="referral" 
                    placeholder="Member name" 
                    className="bg-secondary/50 border-border" 
                    value={formData.referral}
                    onChange={(e) => setFormData({...formData, referral: e.target.value})}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Submit Request
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}