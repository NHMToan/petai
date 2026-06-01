export function WaveBars({ bars = 7, className = "" }: { bars?: number; className?: string }) {
  return (
    <div className={`flex items-end gap-1 ${className}`}>
      {Array.from({ length: bars }).map((_, index) => (
        <span
          key={index}
          className="w-1 rounded-full bg-primary animate-wave"
          style={{ animationDelay: `${index * 0.12}s` }}
        />
      ))}
    </div>
  );
}
