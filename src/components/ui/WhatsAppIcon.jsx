/**
 * WhatsApp-style chat icon (speech bubble with phone handset).
 * Drawn locally so we don't load a brand icon pack. Inherits `currentColor`.
 */
export default function WhatsAppIcon({ size = 24, className = '', ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      <path
        d="M7.9 20A9 9 0 1 0 4 16.1L2.4 21.6Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 8.3c.2-.4.5-.4.8-.4h.6c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .5-.1.6l-.5.6c-.1.1-.1.3 0 .5.5.9 1.3 1.7 2.2 2.2.2.1.4.1.5 0l.6-.5c.2-.2.4-.2.6-.1l1.5.6c.3.1.4.3.4.5v.6c0 .3 0 .6-.4.8-.6.4-1.5.6-2.4.3-2.1-.6-3.9-2.4-4.5-4.5-.3-.9-.1-1.8.3-2.4z"
        fill="currentColor"
      />
    </svg>
  );
}
