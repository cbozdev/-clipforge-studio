import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const KEY = 'clipforge.storageNoticeDismissed';

/** Projects live in this browser only. Safari can clear them after ~7 days without a visit. */
export default function StorageNotice() {
  const [hidden, setHidden] = useState(() => {
    try { return localStorage.getItem(KEY) === '1'; } catch { return false; }
  });
  if (hidden) return null;
  return (
    <div className="mb-5 flex gap-3 rounded-2xl border border-amber/40 bg-amber-dim p-4 text-sm">
      <AlertTriangle className="mt-0.5 shrink-0 text-amber" size={18} />
      <p className="flex-1 text-ink/90">
        Projects and videos are saved only in this browser. Clearing Safari website data, or not opening the site for a while, can delete them. Keep your original files.
      </p>
      <button aria-label="Dismiss" className="shrink-0 text-mute" onClick={() => { try { localStorage.setItem(KEY, '1'); } catch { /* ignore */ } setHidden(true); }}>
        <X size={18} />
      </button>
    </div>
  );
}
