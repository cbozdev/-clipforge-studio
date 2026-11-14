import type { ReactNode } from 'react';

export default function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 md:items-center" onClick={onClose} role="dialog" aria-modal aria-label={title}>
      <div className="w-full max-w-md rounded-t-3xl border border-line bg-base p-5 safe-bottom md:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-semibold">{title}</h2>
        {children}
      </div>
    </div>
  );
}
