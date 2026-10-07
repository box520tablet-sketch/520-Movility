/**
 * Utility functions for parsing and rendering YouTube videos safely.
 */

export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();

  // If user pasted just an 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex for YouTube URLs:
  // - youtube.com/watch?v=ID
  // - youtube.com/v/ID
  // - youtu.be/ID
  // - youtube.com/embed/ID
  // - youtube.com/shorts/ID
  // - youtube.com/live/ID
  const patterns = [
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/,
    /^[a-zA-Z0-9_-]{11}$/,
  ];

  for (const regex of patterns) {
    const match = trimmed.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }

  // Fallback search with URL search params
  try {
    const urlObj = new URL(trimmed);
    const vParam = urlObj.searchParams.get('v');
    if (vParam && vParam.length === 11) {
      return vParam;
    }
  } catch {
    // Ignore URL parse error
  }

  return null;
}

export function getYouTubeEmbedUrl(url: string, autoPlay = false): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;

  const autoplayParam = autoPlay ? '&autoplay=1' : '&autoplay=0';
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1${autoplayParam}`;
}

export function getYouTubeThumbnailUrl(url: string, quality: 'hq' | 'max' = 'hq'): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;

  if (quality === 'max') {
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  }
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
