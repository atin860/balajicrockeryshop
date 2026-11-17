import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/**
 * Accordion — accessible expand/collapse list (FAQ).
 *   <Accordion items={[{ id, title, content }]} defaultOpen="id" headingLevel={2} />
 * headingLevel keeps the page outline correct (2 when the accordion sits directly under the page h1).
 * Only one panel is open at a time unless `multiple` is set.
 */
export default function Accordion({ items, defaultOpen = null, multiple = false, headingLevel = 3, className = '' }) {
  const Heading = `h${headingLevel}`;
  const baseId = useId();
  const [open, setOpen] = useState(() => (defaultOpen ? [defaultOpen] : []));

  const toggle = (id) =>
    setOpen((current) => {
      if (current.includes(id)) return current.filter((x) => x !== id);
      return multiple ? [...current, id] : [id];
    });

  return (
    <div className={`divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white ${className}`}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        const buttonId = `${baseId}-btn-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;
        return (
          <div key={item.id}>
            <Heading className="font-sans text-base font-normal">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-4 text-left font-heading text-base font-semibold text-ink transition-colors duration-200 hover:bg-cream md:px-6"
              >
                <span>{item.title}</span>
                <ChevronDown
                  size={20}
                  aria-hidden="true"
                  className={`shrink-0 text-ink-muted transition-transform duration-300 ease-out ${isOpen ? 'rotate-180 text-primary' : ''}`}
                />
              </button>
            </Heading>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 text-ink-muted md:px-6">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
