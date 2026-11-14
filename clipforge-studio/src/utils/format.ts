export function fmtDuration(sec: number): string {
  if (!isFinite(sec)) return '--:--';
  const s = Math.round(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  const mm = String(m).padStart(h ? 2 : 1, '0');
  const rr = String(r).padStart(2, '0');
  return h ? `${h}:${mm}:${rr}` : `${mm}:${rr}`;
}

export function fmtSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

export function fmtAgo(ts: number): string {
  const d = Date.now() - ts;
  const min = Math.floor(d / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h ago`;
  return new Date(ts).toLocaleDateString();
}

export const uid = (): string =>
  crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
