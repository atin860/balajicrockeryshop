import { Reveal } from './Reveal';

/**
 * SectionTitle — eyebrow + heading + subtitle used at the top of page sections.
 * Pass `action` (e.g. a "View all" button) to show it beside a left-aligned title.
 */
export default function SectionTitle({ eyebrow, title, subtitle, align = 'center', action, as: Heading = 'h2', id, className = '' }) {
  const centered = align === 'center';

  return (
    <Reveal
      className={`mb-10 flex flex-col gap-4 md:mb-12 ${
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'
      } ${className}`}
    >
      <div className={centered ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && (
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-px w-6 bg-accent" aria-hidden="true" />
            {eyebrow}
          </p>
        )}
        <Heading id={id} className="text-3xl md:text-4xl">
          {title}
        </Heading>
        {subtitle && <p className="mt-3 text-base text-ink-muted md:text-lg">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
