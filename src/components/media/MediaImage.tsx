import { useState } from 'react';
import { ExternalLink, ImageIcon } from 'lucide-react';
import { getMediaKind } from '@/lib/media';

interface MediaImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export function MediaImage({ src, alt, className = '', fallbackClassName = '' }: MediaImageProps) {
  const [failed, setFailed] = useState(false);
  const kind = src ? getMediaKind(src) : 'empty';
  const renderable = (kind === 'direct-image') && !failed;

  if (!src || kind === 'invalid' || kind === 'empty' || failed) {
    const showLinkCard = !!src && kind === 'external-link';
    return (
      <div className={`relative flex flex-col items-center justify-center gap-2 overflow-hidden bg-gradient-to-br from-secondary/40 to-secondary/10 ${className} ${fallbackClassName}`}>
        <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
        {showLinkCard ? (
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            View on Google Photos <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50">No photo</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export default MediaImage;
