type PageHeaderProps = {
  title: string;
  description?: string;
  badge?: string;
};

export function PageHeader({ title, description, badge }: PageHeaderProps) {
  return (
    <div className="space-y-2">
      {badge ? (
        <span className="inline-block rounded-full bg-boludo-accent-light px-3 py-1 text-xs font-semibold uppercase tracking-wide text-boludo-accent-dark">
          {badge}
        </span>
      ) : null}
      <h1 className="text-2xl font-bold tracking-tight text-boludo-text">
        {title}
      </h1>
      {description ? (
        <p className="max-w-2xl leading-relaxed text-boludo-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}
