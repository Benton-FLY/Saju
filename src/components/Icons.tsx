export function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: back ? 'rotate(180deg)' : undefined }}
    >
      <path
        d="M4 12h15m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function Spark({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 1c0 8-3 11-11 11 8 0 11 3 11 11 0-8 3-11 11-11C15 12 12 9 12 1Z"
        fill="currentColor"
      />
    </svg>
  );
}
export function ShareIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 15V3m-4 4 4-4 4 4M6 10H4v11h16V10h-2" />
    </svg>
  );
}
export function LinkIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path
        d="m10 14 4-4m-6 5-2 2a4 4 0 0 0 6 6l4-4a4 4 0 0 0 0-6M8 11a4 4 0 0 1 0-6l4-4a4 4 0 0 1 6 6l-2 2"
        transform="translate(0 1) scale(.9)"
      />
    </svg>
  );
}
