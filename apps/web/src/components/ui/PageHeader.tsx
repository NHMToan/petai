export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow ? <div className="mono-label mb-3 text-primary">{eyebrow}</div> : null}
        <h1 className="text-4xl font-bold tracking-tight text-on-surface md:text-5xl">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-on-surface-variant">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}
