import { useEffect, useState } from 'react';
import { requestPersistence, storageEstimate } from '../services/storage/db';
import { fmtSize } from '../utils/format';

type Est = Awaited<ReturnType<typeof storageEstimate>>;

export default function Settings() {
  const [est, setEst] = useState<Est>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const load = () => void storageEstimate().then(setEst);
  useEffect(load, []);

  return (
    <div className="mx-auto max-w-xl px-4 py-6 md:px-8">
      <h1 className="mb-5 text-2xl font-extrabold">Settings</h1>
      <section className="rounded-2xl border border-line bg-base p-4">
        <h2 className="font-semibold">Local storage</h2>
        {est ? (
          <>
            <p className="mt-2 text-sm text-mute">Used {fmtSize(est.usage)} of about {fmtSize(est.quota)} available to this site.</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-line"><div className="h-full bg-amber" style={{ width: `${Math.min(100, (est.usage / Math.max(1, est.quota)) * 100)}%` }} /></div>
            <p className="mt-3 text-sm">Protected from automatic clearing: <b>{est.persisted === null ? 'unknown' : est.persisted ? 'yes' : 'no'}</b></p>
          </>
        ) : <p className="mt-2 text-sm text-mute">This browser does not report storage usage.</p>}
        <button className="btn btn-ghost mt-4" onClick={() => void requestPersistence().then((ok) => { setMsg(ok ? 'Your browser agreed to keep this data.' : 'Your browser did not grant protection. Keep your original videos.'); load(); })}>Ask browser to keep my data</button>
        {msg && <p className="mt-3 text-sm text-mute">{msg}</p>}
      </section>
    </div>
  );
}
