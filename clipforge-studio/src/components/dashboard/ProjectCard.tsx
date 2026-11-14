import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, MoreVertical, Pencil, Trash2, Film } from 'lucide-react';
import type { Project } from '../../types';
import { fmtAgo, fmtDuration, fmtSize } from '../../utils/format';

interface Props {
  project: Project;
  onRename: (p: Project) => void;
  onDuplicate: (p: Project) => void;
  onDelete: (p: Project) => void;
}

export default function ProjectCard({ project: p, onRename, onDuplicate, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const act = (fn: (p: Project) => void) => () => { setOpen(false); fn(p); };
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-base">
      <Link to={`/project/${p.id}`} className="block">
        <div className="relative aspect-video bg-panel">
          {p.thumbnail ? <img src={p.thumbnail} alt="" className="h-full w-full object-cover" /> : <Film className="absolute inset-0 m-auto text-mute" />}
          {p.summary && <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-1.5 py-0.5 text-xs tabular-nums">{fmtDuration(p.summary.duration)}</span>}
        </div>
        <div className="p-3 pr-12">
          <div className="truncate font-semibold">{p.name}</div>
          <div className="mt-0.5 truncate text-xs text-mute">
            {p.aspect} · {p.summary ? `${p.summary.width}×${p.summary.height} · ${fmtSize(p.summary.size)} · ` : ''}{fmtAgo(p.updatedAt)}
          </div>
        </div>
      </Link>
      <button aria-label={`Actions for ${p.name}`} className="absolute bottom-1.5 right-1 flex h-11 w-11 items-center justify-center text-mute" onClick={() => setOpen((o) => !o)}>
        <MoreVertical size={20} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute bottom-12 right-2 z-20 w-44 overflow-hidden rounded-xl border border-line bg-raise shadow-xl">
            <button className="flex min-h-[44px] w-full items-center gap-3 px-3 text-sm" onClick={act(onRename)}><Pencil size={16} />Rename</button>
            <button className="flex min-h-[44px] w-full items-center gap-3 px-3 text-sm" onClick={act(onDuplicate)}><Copy size={16} />Duplicate</button>
            <button className="flex min-h-[44px] w-full items-center gap-3 px-3 text-sm text-danger" onClick={act(onDelete)}><Trash2 size={16} />Delete</button>
          </div>
        </>
      )}
    </div>
  );
}
