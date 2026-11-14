import type { MediaMeta } from '../../types';

const EXT = /\.(mp4|mov|webm|m4v)$/i;
export const ACCEPT = 'video/mp4,video/quicktime,video/webm,video/x-m4v,.mp4,.mov,.webm,.m4v';
export const LARGE_FILE_BYTES = 2 * 1024 ** 3;

export function validateFile(file: File): string | null {
  if (!(file.type.startsWith('video/') || EXT.test(file.name))) return 'This file is not a supported video. Use MP4, MOV, WebM or M4V.';
  if (file.size === 0) return 'This file is empty.';
  return null;
}

export interface ProbeResult { meta: MediaMeta; thumbnail: string }

type Rvfc = (cb: (now: number, md: { mediaTime: number }) => void) => void;

/** Estimate fps from decoded-frame timestamps (needs requestVideoFrameCallback; Safari 15.4+, Chrome). */
async function estimateFps(v: HTMLVideoElement): Promise<number | null> {
  const rvfc = (v as unknown as { requestVideoFrameCallback?: Rvfc }).requestVideoFrameCallback;
  if (!rvfc) return null;
  try {
    const times: number[] = [];
    const done = new Promise<void>((resolve) => {
      const tick = (_: number, md: { mediaTime: number }) => {
        times.push(md.mediaTime);
        if (times.length >= 12) resolve();
        else rvfc.call(v, tick);
      };
      rvfc.call(v, tick);
      setTimeout(resolve, 1500);
    });
    v.muted = true;
    await v.play();
    await done;
    v.pause();
    const deltas = times.slice(1).map((t, i) => t - times[i]).filter((d) => d > 0);
    if (deltas.length < 3) return null;
    deltas.sort((a, b) => a - b);
    const med = deltas[Math.floor(deltas.length / 2)];
    return Math.round((1 / med) * 100) / 100;
  } catch {
    return null; // autoplay blocked or unsupported
  }
}

function detectAudio(v: HTMLVideoElement): boolean | null {
  const a = v as unknown as { audioTracks?: { length: number }; mozHasAudio?: boolean; webkitAudioDecodedByteCount?: number };
  if (a.audioTracks && typeof a.audioTracks.length === 'number') return a.audioTracks.length > 0;
  if (typeof a.mozHasAudio === 'boolean') return a.mozHasAudio;
  if (typeof a.webkitAudioDecodedByteCount === 'number' && a.webkitAudioDecodedByteCount > 0) return true;
  return null;
}

/** Reads metadata and a thumbnail without loading the file into JS memory (uses an object URL). */
export async function probeVideo(file: File): Promise<ProbeResult> {
  const url = URL.createObjectURL(file);
  const v = document.createElement('video');
  v.preload = 'metadata';
  v.muted = true;
  v.playsInline = true;
  v.src = url;
  try {
    await new Promise<void>((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('Timed out reading the video. The codec may not be supported by this browser.')), 20000);
      v.onloadedmetadata = () => { clearTimeout(t); resolve(); };
      v.onerror = () => { clearTimeout(t); reject(new Error('This browser cannot decode this video. Try an H.264 MP4.')); };
    });
    if (!isFinite(v.duration) || v.duration <= 0) throw new Error('Could not read the video duration.');

    v.currentTime = Math.min(1, v.duration * 0.1);
    await new Promise<void>((resolve) => { v.onseeked = () => resolve(); setTimeout(resolve, 4000); });
    const w = 360;
    const h = Math.round((w * v.videoHeight) / v.videoWidth) || 202;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    c.getContext('2d')?.drawImage(v, 0, 0, w, h);
    const thumbnail = c.toDataURL('image/jpeg', 0.7);

    const fps = await estimateFps(v);
    const hasAudio = detectAudio(v);
    return {
      thumbnail,
      meta: { name: file.name, mime: file.type || 'video/mp4', size: file.size, duration: v.duration, width: v.videoWidth, height: v.videoHeight, fps, hasAudio },
    };
  } finally {
    v.removeAttribute('src');
    v.load();
    URL.revokeObjectURL(url);
  }
}
