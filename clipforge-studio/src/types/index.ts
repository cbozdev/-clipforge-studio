export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5';

export interface MediaMeta {
  name: string;
  mime: string;
  size: number;
  duration: number;
  width: number;
  height: number;
  /** Estimated; null when the browser cannot report it. */
  fps: number | null;
  /** null = the browser cannot tell us. */
  hasAudio: boolean | null;
}

export interface MediaItem {
  id: string;
  blob: Blob;
  meta: MediaMeta;
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  aspect: AspectRatio;
  mediaIds: string[];
  /** Small JPEG data URL. */
  thumbnail?: string;
  /** Cached from the primary media for the dashboard. */
  summary?: Pick<MediaMeta, 'duration' | 'width' | 'height' | 'size'>;
}
