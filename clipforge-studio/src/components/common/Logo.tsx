export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2 font-extrabold tracking-tight">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
        <rect width="32" height="32" rx="8" fill="#16171A" stroke="#2A2C31" />
        <path d="M11 9H8v14h3M21 9h3v14h-3" stroke="#F0B23E" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <rect x="14.5" y="12" width="3" height="8" rx="1.5" fill="#ECE9E2" />
      </svg>
      <span className="text-[17px]">ClipForge <span className="font-normal text-mute">Studio</span></span>
    </span>
  );
}
