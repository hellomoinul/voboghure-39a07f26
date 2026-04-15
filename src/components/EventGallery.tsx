import { useState, useEffect } from 'react';
import { uploadEventImage, getEventImages } from '@/lib/communityService';
import { ImagePlus, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '@/lib/supabase';

export default function EventGallery({ eventId, userId }: { eventId: string, userId: string }) {
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      const data = await getEventImages(eventId);
      setImages(data);
    };
    fetchImages();

    // রিয়েল-টাইম লিসেনার
    const channel = supabase.channel(`gallery-${eventId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'event_images', filter: `event_id=eq.${eventId}` }, 
      (payload) => {
        setImages(prev => [payload.new, ...prev]);
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [eventId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      await uploadEventImage(eventId, userId, e.target.files[0]);
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Event Gallery</h2>
        <label className="cursor-pointer">
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*" />
          <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            {uploading ? <Loader2 className="animate-spin h-4 w-4" /> : <ImagePlus className="h-4 w-4" />}
            Upload Photo
          </div>
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl bg-secondary/30">
            <img src={img.image_url} alt="Gallery" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
        ))}
      </div>
    </div>
  );
}