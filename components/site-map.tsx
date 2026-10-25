export function SiteMap() {
  return (
    <figure className="site-map">
      <svg
        viewBox="0 0 520 380"
        role="img"
        aria-label="Schematic street diagram showing the fictional workshop on Anvil Road, Welshpool, beside a rail line and a main road. Not a real map."
      >
        <rect width="520" height="380" fill="#141719" />
        <g stroke="#343C42" strokeWidth="1">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`v${i}`} x1={i * 48} y1="0" x2={i * 48} y2="380" />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 48} x2="520" y2={i * 48} />
          ))}
        </g>
        <g fill="#343C42" stroke="#737D83" strokeWidth="1">
          <rect x="40" y="40" width="130" height="80" />
          <rect x="40" y="210" width="130" height="120" />
          <rect x="300" y="40" width="150" height="90" />
          <rect x="360" y="230" width="110" height="100" />
        </g>
        <rect x="205" y="240" width="130" height="90" fill="#343C42" stroke="#F0F1EF" strokeWidth="1.5" />
        <path d="M0 170 H520" stroke="#737D83" strokeWidth="16" />
        <path d="M0 170 H520" stroke="#141719" strokeWidth="14" />
        <path d="M0 170 H520" stroke="#A3ACB1" strokeWidth="1" strokeDasharray="12 10" />
        <path d="M190 0 V380" stroke="#737D83" strokeWidth="12" />
        <path d="M190 0 V380" stroke="#141719" strokeWidth="10" />
        <path d="M0 365 H520" stroke="#737D83" strokeWidth="1" />
        <path d="M0 372 H520" stroke="#737D83" strokeWidth="1" />
        <path d="M0 365 H520 M0 372 H520" stroke="#A3ACB1" strokeWidth="1" strokeDasharray="2 6" />
        <g fill="#A3ACB1" fontSize="12" letterSpacing="0.08em">
          <text x="200" y="20" transform="rotate(90 200 20)">ANVIL ROAD</text>
          <text x="330" y="164">FOUNDRY STREET</text>
          <text x="20" y="352">RAIL LINE</text>
          <text x="214" y="262" fill="#F0F1EF" fontWeight="600">SLATE PISTON</text>
          <text x="214" y="280">UNIT 4, NO. 18</text>
        </g>
        <g transform="translate(270 305)">
          <circle r="14" fill="#F07836" />
          <circle r="5" fill="#141719" />
        </g>
      </svg>
      <figcaption>Schematic only, not to scale. Fictional location.</figcaption>
    </figure>
  );
}
