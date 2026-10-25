export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="30" height="30" rx="3" fill="#343C42" stroke="#737D83" />
      <path d="M8 10h16M8 14h16M8 18h16" stroke="#F0F1EF" strokeWidth="1.6" />
      <path d="M12 18v8M20 18v8" stroke="#F07836" strokeWidth="2" />
    </svg>
  );
}
