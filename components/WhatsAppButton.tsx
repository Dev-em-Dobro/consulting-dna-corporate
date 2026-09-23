/**
 * Floating WhatsApp click-to-chat button, present site-wide (004 FR-210/211).
 * Reads the business number + default message from public env vars; renders
 * nothing when no number is configured, so it never links to a broken chat.
 *
 * Env:
 *   NEXT_PUBLIC_WHATSAPP_NUMBER   digits only, incl. country code (e.g. 447700900123)
 *   NEXT_PUBLIC_WHATSAPP_MESSAGE  optional pre-filled greeting
 */
export default function WhatsAppButton() {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const number = raw?.replace(/[^\d]/g, "");
  if (!number) return null;

  const message =
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
    "Hello CorporateDNA. I'd like to talk about a leadership challenge.";
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
    >
      <svg
        viewBox="0 0 24 24"
        width={30}
        height={30}
        fill="#fff"
        aria-hidden="true"
      >
        <path d="M17.47 14.38c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.32-1.43-.86-.77-1.44-1.72-1.6-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.55-.88-2.12-.23-.56-.47-.48-.64-.49-.17-.01-.36-.01-.55-.01-.19 0-.51.07-.77.36-.26.29-1.01.99-1.01 2.41 0 1.42 1.03 2.79 1.18 2.98.15.19 2.04 3.12 4.95 4.37.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.55-.08 1.7-.69 1.94-1.37.24-.67.24-1.24.17-1.37-.07-.13-.26-.19-.55-.34zM12.05 21.5h-.01a9.42 9.42 0 0 1-4.8-1.31l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.01c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.89.98 6.67 2.77a9.38 9.38 0 0 1 2.76 6.68c0 5.21-4.24 9.45-9.44 9.45zM20.52 3.49A11.78 11.78 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.15 1.6 5.96L.06 24l6.3-1.65a11.86 11.86 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.42-8.42z" />
      </svg>
    </a>
  );
}
