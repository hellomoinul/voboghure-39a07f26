export type MediaKind = 'direct-image' | 'external-link' | 'invalid' | 'empty';

const DIRECT_IMAGE_HOSTS = [
  'lh3.googleusercontent.com',
  'lh4.googleusercontent.com',
  'lh5.googleusercontent.com',
  'lh6.googleusercontent.com',
  'lh7.googleusercontent.com',
  'images.unsplash.com',
  'res.cloudinary.com',
  'i.imgur.com',
  'i.ibb.co',
];

const DIRECT_IMAGE_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg',
];

export function normalizeMediaUrl(raw: string): string {
  return raw.trim();
}

export function getMediaKind(raw: string): MediaKind {
  const url = normalizeMediaUrl(raw);
  if (!url) return 'empty';

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return 'invalid';
  }

  if (parsed.protocol !== 'https:') return 'invalid';

  const host = parsed.hostname.toLowerCase();
  if (DIRECT_IMAGE_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) {
    return 'direct-image';
  }

  const pathname = parsed.pathname.toLowerCase();
  if (DIRECT_IMAGE_EXTENSIONS.some((ext) => pathname.endsWith(ext))) {
    return 'direct-image';
  }

  return 'external-link';
}

export function isShareableGooglePhotosLink(raw: string): boolean {
  const url = normalizeMediaUrl(raw);
  if (getMediaKind(url) === 'invalid') return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (
      host === 'photos.app.goo.gl' ||
      host === 'photos.google.com' ||
      host.endsWith('.photos.google.com')
    );
  } catch {
    return false;
  }
}

export function isValidMediaLink(raw: string): boolean {
  return getMediaKind(raw) !== 'invalid';
}
