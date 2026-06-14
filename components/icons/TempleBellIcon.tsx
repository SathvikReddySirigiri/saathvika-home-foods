type IconProps = { className?: string };

export function TempleBellIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <path
        d="M12 3v1.5M9.5 5.5c-2 1.2-3 3.2-3 5.5h15c0-2.3-1-4.3-3-5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 11h11c0 4-2.5 6.5-5.5 6.5S6.5 15 6.5 11z"
        strokeLinejoin="round"
      />
      <path d="M10 19.5h4" strokeLinecap="round" />
      <circle cx="12" cy="3" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}
