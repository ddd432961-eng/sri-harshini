import { cn } from '@/lib/utils';

export function SectionHeading({
  label,
  title,
  subtitle,
  align = 'center',
  className,
}: {
  label?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {label && <span className="section-label">{label}</span>}
      <h2 className="heading-luxe text-balance max-w-2xl">{title}</h2>
      {align === 'center' && <div className="divider-gold" />}
      {subtitle && (
        <p
          className={cn(
            'max-w-2xl text-base leading-relaxed text-muted-foreground',
            align === 'center' && 'mx-auto',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
