import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Upload } from 'lucide-react';
import Logo from '../components/common/Logo';
import Modal from '../components/common/Modal';
import ProjectCard from '../components/dashboard/ProjectCard';
import StorageNotice from '../components/dashboard/StorageNotice';
import { useProjects } from '../hooks/useProjects';
import { deleteProject, duplicateProject, renameProject } from '../services/storage/db';
import type { Project } from '../types';

export default function Dashboard() {
  const { projects, loading, error, refresh } = useProjects();
  const [renaming, setRenaming] = useState<Project | null>(null);
  const [name, setName] = useState('');
  const [deleting, setDeleting] = useState<Project | null>(null);
  const [busy, setBusy] = useState(false);

  const guard = async (fn: () => Promise<void>) => {
    setBusy(true);
    try { await fn(); await refresh(); } finally { setBusy(false); }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-5 md:px-8">
      <header className="mb-6"><Logo /></header>
      <StorageNotice />

      <section className="mb-8 rounded-3xl border border-line bg-base p-5 md:p-7">
        <h1 className="text-2xl font-extrabold leading-tight md:text-3xl">Turn a long video into short clips</h1>
        <p className="mt-2 max-w-lg text-sm text-mute">Import a video, then trim, caption and export it. Everything stays on your device.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/new" className="btn btn-primary"><Plus size={18} />New project</Link>
          <Link to="/new" className="btn btn-ghost"><Upload size={18} />Import video</Link>
        </div>
      </section>

      <h2 className="mb-3 text-lg font-semibold">Recent projects</h2>
      {error && <p className="rounded-xl border border-danger/50 p-4 text-sm text-danger">{error}</p>}
      {loading ? (
        <p className="text-sm text-mute">Loading projects…</p>
      ) : projects.length === 0 && !error ? (
        <div className="rounded-2xl border border-dashed border-line p-8 text-center">
          <p className="font-semibold">No projects yet</p>
          <p className="mt-1 text-sm text-mute">Import a video to create your first one.</p>
          <Link to="/new" className="btn btn-primary mt-4">Import a video</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onRename={(x) => { setName(x.name); setRenaming(x); }}
              onDuplicate={(x) => void guard(() => duplicateProject(x.id))}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      {renaming && (
        <Modal title="Rename project" onClose={() => setRenaming(null)}>
          <input className="field" value={name} onChange={(e) => setName(e.target.value)} autoFocus maxLength={80} />
          <div className="mt-4 flex gap-3">
            <button className="btn btn-ghost flex-1" onClick={() => setRenaming(null)}>Cancel</button>
            <button className="btn btn-primary flex-1" disabled={busy || !name.trim()} onClick={() => void guard(async () => { await renameProject(renaming.id, name); setRenaming(null); })}>Save name</button>
          </div>
        </Modal>
      )}
      {deleting && (
        <Modal title="Delete project?" onClose={() => setDeleting(null)}>
          <p className="text-sm text-mute">“{deleting.name}” and its imported video will be removed from this browser. Your original file is not affected.</p>
          <div className="mt-4 flex gap-3">
            <button className="btn btn-ghost flex-1" onClick={() => setDeleting(null)}>Keep</button>
            <button className="btn btn-danger flex-1" disabled={busy} onClick={() => void guard(async () => { await deleteProject(deleting.id); setDeleting(null); })}>Delete project</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
