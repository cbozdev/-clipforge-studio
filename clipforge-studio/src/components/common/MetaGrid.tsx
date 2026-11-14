import type { MediaMeta } from '../../types';
import { fmtDuration, fmtSize } from '../../utils/format';

export default function MetaGrid({ meta }: { meta: MediaMeta }) {
  const rows: [string, string][] = [
    ['Duration', fmtDuration(meta.duration)],
    ['Resolution', `${meta.width}×${meta.height}`],
    ['Frame rate', meta.fps ? `~${meta.fps} fps` : 'Not reported'],
    ['File size', fmtSize(meta.size)],
    ['Audio', meta.hasAudio === null ? 'Not reported' : meta.hasAudio ? 'Detected' : 'None'],
    ['Format', meta.mime],
  ];
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="bg-base p-3">
          <dt className="text-xs text-mute">{k}</dt>
          <dd className="mt-0.5 truncate font-semibold tabular-nums">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
