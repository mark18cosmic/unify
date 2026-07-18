export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="UnifyGames logo">
      <circle cx="100" cy="100" r="100" fill="#FFFFFF" />
      <path
        d="M70,55 L70,113 C70,131 84,146 100,146 C116,146 130,131 130,113 L130,55"
        fill="none"
        stroke="#EA6A2E"
        strokeWidth="30"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
