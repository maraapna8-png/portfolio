export interface MediaInfo {
  isVideo: boolean;
  type: 'gdrive' | 'youtube' | 'vimeo' | 'html5' | 'image' | 'unknown';
  embedUrl?: string;
  streamUrl?: string;
  thumbnailUrl?: string;
  fileId?: string;
}

/**
 * Extracts Google Drive File ID from various Drive sharing formats.
 */
export function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;
  const matchFile = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFile && matchFile[1]) return matchFile[1];

  const matchIdParam = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchIdParam && matchIdParam[1]) return matchIdParam[1];

  return null;
}

/**
 * Extracts YouTube Video ID from various YouTube URL formats.
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : null;
}

/**
 * Extracts Vimeo Video ID.
 */
export function extractVimeoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  return match ? match[1] : null;
}

/**
 * Detects if a URL points directly to an HTML5 video file.
 */
export function isDirectVideoUrl(url: string): boolean {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

/**
 * Inspects a URL and determines its video/media capabilities.
 */
export function inspectMediaUrl(url?: string): MediaInfo {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { isVideo: false, type: 'unknown' };
  }

  const cleanUrl = url.trim();

  // 1. Google Drive
  const gdriveId = extractGoogleDriveId(cleanUrl);
  if (gdriveId) {
    return {
      isVideo: true,
      type: 'gdrive',
      fileId: gdriveId,
      embedUrl: `https://drive.google.com/file/d/${gdriveId}/preview`,
      streamUrl: `https://drive.google.com/uc?export=download&id=${gdriveId}`,
      thumbnailUrl: `https://drive.google.com/thumbnail?id=${gdriveId}&sz=w1000`,
    };
  }

  // 2. YouTube
  const youtubeId = extractYouTubeId(cleanUrl);
  if (youtubeId) {
    return {
      isVideo: true,
      type: 'youtube',
      fileId: youtubeId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
    };
  }

  // 3. Vimeo
  const vimeoId = extractVimeoId(cleanUrl);
  if (vimeoId) {
    return {
      isVideo: true,
      type: 'vimeo',
      fileId: vimeoId,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
    };
  }

  // 4. Direct video file
  if (isDirectVideoUrl(cleanUrl)) {
    return {
      isVideo: true,
      type: 'html5',
      streamUrl: cleanUrl,
    };
  }

  return {
    isVideo: false,
    type: 'image',
  };
}

/**
 * Resolves gallery item media attributes safely:
 * - If user pasted a video/Drive URL into `imageUrl`, auto-converts it to a video.
 * - Generates high-quality fallback thumbnails so no broken image icons ever show.
 */
export function resolveGalleryMedia(item: {
  imageUrl: string;
  videoUrl?: string;
  category?: string;
  title?: string;
}) {
  const videoInspect = inspectMediaUrl(item.videoUrl);
  const imageInspect = inspectMediaUrl(item.imageUrl);

  // Default fallback poster in case video or drive image preview is blocked
  const defaultPoster =
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80';

  // Case A: Explicit videoUrl is present and is a recognized video/drive link
  if (videoInspect.isVideo) {
    let poster = item.imageUrl;
    // If the image URL itself is also a drive link or empty, use the video thumbnail
    if (!poster || imageInspect.isVideo) {
      poster = videoInspect.thumbnailUrl || defaultPoster;
    }
    return {
      isVideo: true,
      videoType: videoInspect.type,
      embedUrl: videoInspect.embedUrl,
      streamUrl: videoInspect.streamUrl,
      posterUrl: poster,
      thumbnailUrl: videoInspect.thumbnailUrl,
    };
  }

  // Case B: User pasted a video link (e.g. Google Drive, YouTube) into imageUrl
  if (imageInspect.isVideo) {
    return {
      isVideo: true,
      videoType: imageInspect.type,
      embedUrl: imageInspect.embedUrl,
      streamUrl: imageInspect.streamUrl,
      posterUrl: imageInspect.thumbnailUrl || defaultPoster,
      thumbnailUrl: imageInspect.thumbnailUrl,
    };
  }

  // Case C: Category is 'Videos' but user provided a direct stream or file link
  if (item.category === 'Videos' && item.videoUrl) {
    return {
      isVideo: true,
      videoType: 'html5' as const,
      streamUrl: item.videoUrl,
      posterUrl: item.imageUrl || defaultPoster,
    };
  }

  // Case D: Standard image
  return {
    isVideo: false,
    videoType: 'image' as const,
    posterUrl: normalizeImageUrl(item.imageUrl) || defaultPoster,
  };
}

/**
 * Sanitizes an external link URL (blocks javascript:, data:, vbscript: schemes).
 */
export function sanitizeExternalUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  let clean = url.trim().replace(/^['"]|['"]$/g, '');
  if (!clean) return '';
  const lower = clean.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('data:')
  ) {
    return '';
  }
  if (!/^https?:\/\//i.test(clean) && !clean.startsWith('/')) {
    clean = `https://${clean}`;
  }
  return clean;
}

/**
 * Normalizes a pasted image/screenshot URL into a directly loadable image URL
 * across Google Drive, Dropbox, GitHub blob, YouTube thumbnails, and relative assets.
 */
export function normalizeImageUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  let clean = url.trim().replace(/^['"]|['"]$/g, '');
  if (!clean) return '';

  const lower = clean.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('vbscript:')) {
    return '';
  }
  if (lower.startsWith('data:')) {
    return /^data:image\/(?:png|jpeg|jpg|webp|gif);base64,[a-z0-9+/=]+$/i.test(clean)
      ? clean
      : '';
  }

  // Local workspace assets
  if (clean.startsWith('/assets/')) return clean;
  if (clean.startsWith('assets/')) return `/${clean}`;

  // Prepend https:// if user pasted a bare domain like i.imgur.com/abc.png
  if (!/^https?:\/\//i.test(clean)) {
    clean = `https://${clean}`;
  }

  // 1. Google Drive / Googleusercontent links
  const driveId =
    extractGoogleDriveId(clean) ||
    clean.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/)?.[1] ||
    null;
  if (driveId) {
    return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1200`;
  }

  // 2. YouTube links -> high-res thumbnail
  const youtubeId = extractYouTubeId(clean);
  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }

  // 3. GitHub /blob/ links -> raw.githubusercontent.com
  const ghMatch = clean.match(
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/i
  );
  if (ghMatch) {
    return `https://raw.githubusercontent.com/${ghMatch[1]}/${ghMatch[2]}/${ghMatch[3]}`;
  }

  // 4. Dropbox share links -> raw=1
  if (/^https?:\/\/(?:www\.)?dropbox\.com\//i.test(clean)) {
    try {
      const parsed = new URL(clean);
      parsed.searchParams.delete('dl');
      parsed.searchParams.set('raw', '1');
      return parsed.toString();
    } catch {
      return clean.replace(/([?&])dl=[01]/g, '$1raw=1');
    }
  }

  // 5. Imgur page link (without i.imgur.com or file extension)
  const imgurMatch = clean.match(
    /^https?:\/\/(?:www\.)?imgur\.com\/(?:gallery\/|a\/)?([a-zA-Z0-9]+)\/?(?:\?.*)?$/i
  );
  if (imgurMatch) {
    return `https://i.imgur.com/${imgurMatch[1]}.png`;
  }

  return clean;
}

/**
 * Generates an ordered list of fallback image URLs to attempt when loading an image.
 */
export function getImageCandidates(url?: string): string[] {
  if (!url || typeof url !== 'string' || !url.trim()) return [];
  const candidates: string[] = [];
  const pushUnique = (val: string) => {
    if (val && !candidates.includes(val)) candidates.push(val);
  };

  let clean = url.trim().replace(/^['"]|['"]$/g, '');
  const lower = clean.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('vbscript:')) {
    return [];
  }

  const normalized = normalizeImageUrl(clean);
  pushUnique(normalized);

  if (!clean.startsWith('/assets/') && !clean.startsWith('assets/') && !lower.startsWith('data:') && !/^https?:\/\//i.test(clean)) {
    clean = `https://${clean}`;
  }

  // Extra Drive fallbacks in case thumbnail endpoint is blocked by browser cookies
  const driveId =
    extractGoogleDriveId(clean) ||
    clean.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/)?.[1] ||
    null;
  if (driveId) {
    pushUnique(`https://drive.google.com/thumbnail?id=${driveId}&sz=w1200`);
    pushUnique(`https://lh3.googleusercontent.com/d/${driveId}=w1200`);
    pushUnique(`https://drive.google.com/uc?export=view&id=${driveId}`);
  }

  // Extra Imgur format fallbacks
  const imgurMatch = clean.match(
    /^https?:\/\/(?:www\.|i\.)?imgur\.com\/(?:gallery\/|a\/)?([a-zA-Z0-9]+)(?:\.[a-z]+)?\/?(?:\?.*)?$/i
  );
  if (imgurMatch && !/\.(png|jpg|jpeg|webp|gif)(\?.*)?$/i.test(clean)) {
    pushUnique(`https://i.imgur.com/${imgurMatch[1]}.png`);
    pushUnique(`https://i.imgur.com/${imgurMatch[1]}.jpg`);
    pushUnique(`https://i.imgur.com/${imgurMatch[1]}.webp`);
  }

  if (/^https?:\/\//i.test(clean) || clean.startsWith('/')) {
    pushUnique(clean);
  }

  return candidates;
}
