import { useEffect, useState } from 'react';
import { CheckCircle2, ExternalLink, ImagePlus, Link2, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MediaImage } from '@/components/media/MediaImage';
import { getMediaKind, isShareableGooglePhotosLink, normalizeMediaUrl } from '@/lib/media';

interface MediaLinkInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  id?: string;
}

export function MediaLinkInput({ value, onChange, label = 'Photo link', id = 'media-link' }: MediaLinkInputProps) {
  const [draft, setDraft] = useState(value);
  const [previewUrl, setPreviewUrl] = useState(value);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    setDraft(value);
    setPreviewUrl(value);
  }, [value]);

  useEffect(() => {
    if (draft === value) return;
    setChecking(true);
    const t = setTimeout(() => {
      const url = normalizeMediaUrl(draft);
      setPreviewUrl(getMediaKind(url) === 'invalid' ? '' : url);
      setChecking(false);
    }, 400);
    return () => clearTimeout(t);
  }, [draft]);

  const kind = getMediaKind(previewUrl);
  const shareableHint = draft.length > 0 && !isValidSoFar();

  function isValidSoFar() {
    return draft.length === 0 || getMediaKind(normalizeMediaUrl(draft)) !== 'invalid';
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id={id}
          type="url"
          placeholder="https://photos.app.goo.gl/..."
          className="pl-9 pr-9 bg-secondary/50 border-border"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => onChange(normalizeMediaUrl(draft))}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {checking ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : draft && kind !== 'invalid' ? (
            <button
              type="button"
              aria-label="Clear photo link"
              onClick={() => {
                setDraft('');
                setPreviewUrl('');
                onChange('');
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      <p className={`text-xs ${shareableHint ? 'text-destructive' : 'text-muted-foreground'}`}>
        Paste Google Photos link (make sure it's shareable)
      </p>

      {kind !== 'empty' && (
        <div className="pt-1">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-1">
            <ImagePlus className="h-3 w-3" /> Preview
          </p>
          <div className="rounded-xl border border-border/60 overflow-hidden max-w-xs">
            <div className="aspect-video">
              <MediaImage src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
            </div>
            {kind === 'external-link' && (
              <div className="flex items-center justify-between gap-2 px-3 py-2 bg-secondary/30">
                <span className="text-[11px] text-muted-foreground truncate">
                  {isShareableGooglePhotosLink(previewUrl) ? 'Google Photos album' : 'External page'}
                </span>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline shrink-0"
                >
                  Open <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
          {kind === 'direct-image' && (
            <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-500" /> Renders inline everywhere
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default MediaLinkInput;
