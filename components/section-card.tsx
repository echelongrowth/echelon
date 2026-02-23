type SectionCardProps = {
  title: string;
  description: string;
};

export function SectionCard({ title, description }: SectionCardProps) {
  return (
    <article className="rounded-xl border border-border bg-surface p-6">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
    </article>
  );
}

