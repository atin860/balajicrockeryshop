import { forwardRef, useId } from 'react';
import { AlertCircle } from 'lucide-react';
import useLanguage from '../../hooks/useLanguage';

/**
 * Accessible form fields (bulk order, contact and checkout forms).
 * Label, required marker, hint and error message are wired with
 * aria-describedby / aria-invalid so screen readers announce them.
 *
 *   <TextField label="Mobile" name="mobile" required error={errors.mobile} value=… onChange=… />
 *   <SelectField label="Event type" …>{options}</SelectField>
 *   <TextAreaField label="Items needed" … />
 * `error` is an i18n key; it is translated here.
 */
export const fieldClass = (invalid) =>
  `w-full rounded-2xl border bg-white px-4 text-[15px] text-ink shadow-soft transition-[border-color,box-shadow] duration-200 placeholder:text-ink-muted/70 focus:outline-none focus:ring-2 ${
    invalid ? 'border-primary focus:border-primary focus:ring-primary/20' : 'border-line focus:border-accent focus:ring-accent/30'
  }`;

function useFieldIds(name) {
  const base = useId();
  return { id: `${base}-${name}`, hintId: `${base}-${name}-hint`, errorId: `${base}-${name}-error` };
}

function FieldShell({ id, label, required, hint, hintId, error, errorId, className = '', children }) {
  const { t } = useLanguage();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required ? (
          <span className="ml-0.5 text-primary" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-1 text-xs font-normal text-ink-muted">({t('common.optional')})</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 flex items-center gap-1.5 text-sm text-primary" role="alert">
          <AlertCircle size={14} aria-hidden="true" className="shrink-0" />
          {t(error)}
        </p>
      )}
    </div>
  );
}

function describedBy({ hint, error, hintId, errorId }) {
  return [error ? errorId : null, hint && !error ? hintId : null].filter(Boolean).join(' ') || undefined;
}

export const TextField = forwardRef(function TextField({ label, name, required, hint, error, className, type = 'text', ...rest }, ref) {
  const ids = useFieldIds(name);
  return (
    <FieldShell {...ids} label={label} required={required} hint={hint} error={error} className={className}>
      <input
        ref={ref}
        id={ids.id}
        name={name}
        type={type}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy({ hint, error, ...ids })}
        className={`${fieldClass(!!error)} h-12`}
        {...rest}
      />
    </FieldShell>
  );
});

export const SelectField = forwardRef(function SelectField({ label, name, required, hint, error, className, children, ...rest }, ref) {
  const ids = useFieldIds(name);
  return (
    <FieldShell {...ids} label={label} required={required} hint={hint} error={error} className={className}>
      <div className="relative">
        <select
          ref={ref}
          id={ids.id}
          name={name}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy({ hint, error, ...ids })}
          className={`${fieldClass(!!error)} h-12 appearance-none pr-10`}
          {...rest}
        >
          {children}
        </select>
        <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-ink-muted">
          ▼
        </span>
      </div>
    </FieldShell>
  );
});

export const TextAreaField = forwardRef(function TextAreaField({ label, name, required, hint, error, className, rows = 4, ...rest }, ref) {
  const ids = useFieldIds(name);
  return (
    <FieldShell {...ids} label={label} required={required} hint={hint} error={error} className={className}>
      <textarea
        ref={ref}
        id={ids.id}
        name={name}
        rows={rows}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy({ hint, error, ...ids })}
        className={`${fieldClass(!!error)} resize-y py-3 leading-relaxed`}
        {...rest}
      />
    </FieldShell>
  );
});
