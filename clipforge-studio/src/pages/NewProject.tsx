import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileVideo } from 'lucide-react';
import MetaGrid from '../components/common/MetaGrid';
import { ACCEPT, LARGE_FILE_BYTES, probeVideo, validateFile, type ProbeResult } from '../services/video/probe';
import { saveMedia, saveProject, requestPersistence } from '../services/storage/db';
import type { AspectRatio } from '../types';
import { uid } from '../utils/format';

const ASPECTS: { id: AspectRatio; hint: string }[] = [
  { id: '9:16', hint: 'TikTok, Reels, Shorts' },
  { id: '1:1', hint: 'Square feed' },
  { id: '4:5', hint: 'Instagram feed' },
  { id: '16:9', hint: 'YouTube' },
];

type Step = 'idle' | 'reading' | 'ready' | 'saving';

export default function NewProject() {
  const nav = useNavigate();
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [probe, setProbe] = useState<ProbeResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [aspect, setAspect] = useState<AspectRatio>('9:16');
  const [step, setStep] = useState<Step>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  async function onPick(f: File | undefined) {
    if (!f) return;
    setError(null);
    const bad = validateFile(f);
    if (bad) { setError(bad); return; }
    setStep('reading');
    setProbe(null);
    try {
      const result = await probeVideo(f);
      setFile(f);
      setProbe(result);
      setName(f.name.replace(/\.[^.]+$/, ''));
      setPreviewUrl(URL.createObjectURL(f));
      setStep('ready');
    } catch (e) {
      setFile(null);
      setStep('idle');
      setError(e instanceof Error ? e.message : 'Could not read this video.');
    }
  }

  async function create() {
    if (!file || !probe) return;
    setStep('saving');
    setError(null);
    try {
      void requestPersistence(); // asks the browser to keep data; may be ignored
      const mediaId = uid();
      await saveMedia({ id: mediaId, blob: file, meta: probe.meta });
      const now = Date.now();
      const id = uid();
      await saveProject({
        id, name: name.trim() || probe.meta.name, createdAt: now, updatedAt: now, aspect,
        mediaIds: [mediaId], thumbnail: probe.thumbnail,
        summary: { duration: probe.meta.duration, width: probe.meta.width, height: probe.meta.height, size: probe.meta.size },
      });
      nav(`/project/${id}`, { replace: true });
    } catch (e) {
      setStep('ready');
      setError(`Could not save the project: ${e instanceof Error ? e.message : 'storage error'}. Free up device storage or try a smaller video.`);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 pt-4 md:px-8">
      <button className="mb-4 inline-flex min-h-[44px] items-center gap-2 text-sm text-mute" onClick={() => nav(-1)}><ArrowLeft size={18} />Back</button>
      <h1 className="mb-5 text-2xl font-extrabold">New project</h1>

      <input ref={input} type="file" accept={ACCEPT} className="hidden" onChange={(e) => { void onPick(e.target.files?.[0]); e.target.value = ''; }} />

      {step === 'idle' || step === 'reading' ? (
        <button
          className="flex w-full flex-col items-center gap-3 rounded-3xl border border-dashed border-line bg-base px-6 py-12 text-center active:bg-raise"
          onClick={() => input.current?.click()}
          disabled={step === 'reading'}
        >
          <FileVideo size={36} className="text-amber" />
          <span className="font-semibold">{step === 'reading' ? 'Reading video…' : 'Choose a video'}</span>
          <span className="text-sm text-mute">MP4, MOV, WebM or M4V. The file stays on your device.</span>
        </button>
      ) : (
        probe && file && (
          <div className="space-y-5">
            {previewUrl && <video src={previewUrl} controls playsInline preload="metadata" className="w-full rounded-2xl bg-black" style={{ maxHeight: '45vh' }} />}
            <MetaGrid meta={probe.meta} />
            {file.size > LARGE_FILE_BYTES && <p className="rounded-xl border border-amber/40 bg-amber-dim p-3 text-sm">This file is over 2 GB. Importing may fail on phones with limited storage, and exporting will be slow. A shorter or 720p copy works best.</p>}
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Project name</span>
              <input className="field" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
            </label>
            <div>
              <span className="mb-1.5 block text-sm font-semibold">Output shape</span>
              <div className="flex flex-wrap gap-2">
                {ASPECTS.map((a) => (
                  <button key={a.id} className={`chip ${aspect === a.id ? 'chip-on' : ''}`} onClick={() => setAspect(a.id)} aria-pressed={aspect === a.id}>
                    {a.id} <span className="opacity-70">{a.hint}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn btn-ghost flex-1" disabled={step === 'saving'} onClick={() => input.current?.click()}>Pick another</button>
              <button className="btn btn-primary flex-1" disabled={step === 'saving' || !name.trim()} onClick={() => void create()}>{step === 'saving' ? 'Saving to this device…' : 'Create project'}</button>
            </div>
          </div>
        )
      )}
      {error && <p role="alert" className="mt-4 rounded-xl border border-danger/50 p-3 text-sm text-danger">{error}</p>}
    </div>
  );
}
