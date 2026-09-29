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
    posterUrl: item.imageUrl || defaultPoster,
  };
}
