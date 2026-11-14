import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MetaGrid from '../components/common/MetaGrid';
import { getMedia, getProject } from '../services/storage/db';
import type { MediaItem, Project } from '../types';

/** Stage 2: reopen a saved project and play its video. Timeline arrives in Stage 3. */
export default function EditorPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [state, setState] = useState<'loading' | 'ok' | 'missing'>('loading');

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;
    (async () => {
      const p = id ? await getProject(id) : undefined;
      const m = p?.mediaIds[0] ? await getMedia(p.mediaIds[0]) : undefined;
      if (cancelled) return;
      if (!p || !m) { setState('missing'); return; }
      objectUrl = URL.createObjectURL(m.blob);
      setProject(p); setMedia(m); setUrl(objectUrl); setState('ok');
    })().catch(() => setState('missing'));
    return () => { cancelled = true; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [id]);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-4 md:px-8">
      <Link to="/" className="mb-4 inline-flex min-h-[44px] items-center gap-2 text-sm text-mute"><ArrowLeft size={18} />Projects</Link>
      {state === 'loading' && <p className="text-sm text-mute">Opening project…</p>}
      {state === 'missing' && <p className="rounded-xl border border-danger/50 p-4 text-sm text-danger">This project or its video is no longer in this browser. Browsers can clear stored data. Import the video again to continue.</p>}
      {state === 'ok' && project && media && url && (
        <div className="space-y-5">
          <h1 className="truncate text-2xl font-extrabold">{project.name}</h1>
          <video src={url} controls playsInline className="w-full rounded-2xl bg-black" style={{ maxHeight: '60vh' }} />
          <MetaGrid meta={media.meta} />
          <p className="rounded-2xl border border-line bg-base p-4 text-sm text-mute">
            The editing timeline, trimming and splitting are planned for Stages 3 and 4. For now this screen plays your saved video.
          </p>
        </div>
      )}
    </div>
  );
}
