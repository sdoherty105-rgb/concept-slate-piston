export function HeroArt() {
  const label = { fill: "#A3ACB1", fontSize: 12, letterSpacing: "0.08em" } as const;
  return (
    <figure className="hero-art">
      <svg
        viewBox="0 0 480 600"
        role="img"
        aria-label="Technical line drawing of a piston, connecting rod and crankshaft with dimension lines and numbered callouts. Illustrative artwork."
      >
        <line className="hero-art__centre" x1="240" y1="14" x2="240" y2="592" stroke="#F07836" strokeWidth="1" strokeDasharray="14 4 3 4" opacity="0.7" />

        <circle cx="240" cy="500" r="80" fill="none" stroke="#737D83" strokeWidth="1" strokeDasharray="4 5" />

        <path d="M190 506 A50 50 0 0 0 290 506 Z" fill="#343C42" stroke="#F0F1EF" strokeWidth="1.5" />
        <rect x="218" y="420" width="44" height="80" rx="6" fill="#343C42" stroke="#F0F1EF" strokeWidth="1.5" />
        <circle cx="240" cy="500" r="26" fill="#141719" stroke="#F0F1EF" strokeWidth="1.5" />
        <circle className="hero-art__pulse" cx="240" cy="500" r="8" fill="#F07836" />

        <path d="M226 206 L254 206 L264 384 L216 384 Z" fill="#343C42" stroke="#F0F1EF" strokeWidth="1.5" />
        <path d="M240 232 V362" stroke="#737D83" strokeWidth="1.5" />

        <path
          d="M150 82 Q150 70 162 70 H318 Q330 70 330 82 V248 Q330 258 320 258 H160 Q150 258 150 248 Z"
          fill="#343C42"
          stroke="#F0F1EF"
          strokeWidth="1.5"
        />
        {[94, 108, 122].map((y) => (
          <g key={y}>
            <line x1="150" y1={y} x2="330" y2={y} stroke="#141719" strokeWidth="5" />
            <line x1="150" y1={y - 3.5} x2="330" y2={y - 3.5} stroke="#737D83" strokeWidth="1" />
          </g>
        ))}
        <path d="M168 150 V244 M312 150 V244" stroke="#737D83" strokeWidth="1" />
        <circle cx="240" cy="190" r="24" fill="#141719" stroke="#F0F1EF" strokeWidth="1.5" />
        <circle cx="240" cy="190" r="15" fill="#737D83" stroke="#F0F1EF" strokeWidth="1" />
        <circle cx="240" cy="190" r="6" fill="#141719" />

        <circle cx="240" cy="420" r="52" fill="#343C42" stroke="#F0F1EF" strokeWidth="1.5" />
        <circle cx="240" cy="420" r="31" fill="#141719" stroke="#737D83" strokeWidth="1.5" />
        <circle cx="240" cy="420" r="22" fill="#737D83" />
        <circle cx="240" cy="420" r="7" fill="#141719" />
        <circle cx="203" cy="448" r="4.5" fill="#F07836" />
        <circle cx="277" cy="448" r="4.5" fill="#F07836" />

        <g stroke="#F07836" strokeWidth="1.2" fill="none">
          <line x1="150" y1="38" x2="330" y2="38" />
          <line x1="150" y1="30" x2="150" y2="68" strokeWidth="0.8" />
          <line x1="330" y1="30" x2="330" y2="68" strokeWidth="0.8" />
          <line x1="110" y1="70" x2="110" y2="258" />
          <line x1="104" y1="70" x2="146" y2="70" strokeWidth="0.8" />
          <line x1="104" y1="258" x2="146" y2="258" strokeWidth="0.8" />
        </g>
        <text x="240" y="28" textAnchor="middle" fill="#F07836" fontSize="13" fontWeight="600" letterSpacing="0.06em">
          BORE Ø
        </text>
        <text x="96" y="164" textAnchor="middle" fill="#F07836" fontSize="13" fontWeight="600" letterSpacing="0.06em" transform="rotate(-90 96 164)">
          HEIGHT
        </text>

        <g stroke="#F07836" strokeWidth="1" fill="none">
          <path d="M330 76 H352" />
          <path d="M330 101 H352" />
          <path d="M264 190 H352" />
          <path d="M262 300 H352" />
          <path d="M292 420 H352" />
        </g>
        <g fill="#F07836">
          <circle cx="330" cy="76" r="3" />
          <circle cx="330" cy="101" r="3" />
          <circle cx="264" cy="190" r="3" />
          <circle cx="262" cy="300" r="3" />
          <circle cx="292" cy="420" r="3" />
        </g>
        <g style={label}>
          <text x="358" y="80" {...label}>01 CROWN</text>
          <text x="358" y="105" {...label}>02 RING PACK</text>
          <text x="358" y="194" {...label}>03 WRIST PIN</text>
          <text x="358" y="304" {...label}>04 CON-ROD</text>
          <text x="358" y="424" {...label}>05 BIG END</text>
        </g>
      </svg>
      <figcaption className="hero-art__cap">Fig. 01 — Piston assembly. Illustrative artwork.</figcaption>
    </figure>
  );
}
