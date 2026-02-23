type SectionCardProps = {
  title: string;
  description: string;
};

export function SectionCard({ title, description }: SectionCardProps) {
  return (
    <article className="l2-surface rounded-2xl p-6 panel-hover">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
    </article>
  );
}
