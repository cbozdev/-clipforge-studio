export default function Planned({ title, stage, note }: { title: string; stage: string; note: string }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-10 md:px-8">
      <h1 className="text-2xl font-extrabold">{title}</h1>
      <p className="mt-2 inline-block rounded-full border border-line px-3 py-1 text-xs text-mute">Not built yet · planned for {stage}</p>
      <p className="mt-4 text-sm text-mute">{note}</p>
    </div>
  );
}
