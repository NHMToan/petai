export function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`glass-panel rounded-[1.5rem] ${className}`}>{children}</div>;
}
