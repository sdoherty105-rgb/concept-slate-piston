import Link from "next/link";

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinejoin: "round" as const };

function SideView() {
  return (
    <svg viewBox="0 0 900 360" role="img" aria-label="Side elevation of a hatchback">
      <g {...stroke}>
        <path d="M84 238 L99 164 Q105 150 132 143 L239 125 L329 57 Q346 45 382 45 H558 Q580 45 596 65 L655 135 L779 158 Q802 164 806 186 L818 238 H766 Q758 178 706 178 Q652 178 645 238 H286 Q277 179 225 179 Q171 179 164 238 Z" strokeWidth="2" />
        <path d="M264 124 L345 65 H394 V124 Z M410 65 H550 Q564 65 578 82 L614 124 H410 Z" />
        <path d="M409 134 V227 M639 140 L625 218 M105 169 L152 165 V180 L103 190 M778 171 H798 L802 190 H776 Z M290 226 H627" />
        <circle cx="225" cy="240" r="49" strokeWidth="2" />
        <circle cx="225" cy="240" r="28" />
        <circle cx="706" cy="240" r="49" strokeWidth="2" />
        <circle cx="706" cy="240" r="28" />
        <path d="M150 168 H210 V210 H150 Z" strokeDasharray="3 3" />
      </g>
    </svg>
  );
}

function FrontView() {
  return (
    <svg viewBox="0 0 360 260" role="img" aria-label="Front elevation of a hatchback">
      <g {...stroke}>
        <path d="M70 200 V110 Q70 70 110 62 H250 Q290 70 290 110 V200" />
        <path d="M96 108 H264 V150 H96 Z" />
        <path d="M40 200 H320" />
        <circle cx="96" cy="206" r="28" />
        <circle cx="264" cy="206" r="28" />
        <path d="M118 168 H150 V186 H118 Z M210 168 H242 V186 H210 Z" />
      </g>
    </svg>
  );
}

function RearView() {
  return (
    <svg viewBox="0 0 360 260" role="img" aria-label="Rear elevation of a hatchback">
      <g {...stroke}>
        <path d="M78 200 V96 Q78 64 120 58 H240 Q282 64 282 96 V200" />
        <path d="M108 90 H252 L244 150 H116 Z" />
        <path d="M40 200 H320" />
        <circle cx="96" cy="206" r="28" />
        <circle cx="264" cy="206" r="28" />
        <path d="M120 164 H156 V178 H120 Z M204 164 H240 V178 H204 Z" />
      </g>
    </svg>
  );
}

function PlanView() {
  return (
    <svg viewBox="0 0 360 220" role="img" aria-label="Plan view of a hatchback">
      <g {...stroke}>
        <path d="M150 24 H210 L248 48 H300 V176 H248 L210 196 H150 L112 176 H60 V48 H112 Z" />
        <path d="M112 70 H248 M112 150 H248" />
        <rect x="78" y="58" width="28" height="46" />
        <rect x="254" y="58" width="28" height="46" />
        <rect x="78" y="118" width="28" height="46" />
        <rect x="254" y="118" width="28" height="46" />
      </g>
    </svg>
  );
}

const hotspots = [
  { n: "01", title: "Front brake", sheet: "/services/brakes", x: "25%", y: "74%" },
  { n: "02", title: "Engine, no start", sheet: "/services/no-start", x: "15%", y: "48%" },
  { n: "03", title: "Warning lamp", sheet: "/services/warning-light", x: "46%", y: "26%" },
  { n: "04", title: "Steering pull", sheet: "/services/pull", x: "38%", y: "40%" },
  { n: "05", title: "Logbook service", sheet: "/services/logbook", x: "55%", y: "58%" },
  { n: "06", title: "Anything else", sheet: "/services/general", x: "82%", y: "46%" },
];

export function VehicleViews() {
  return (
    <div className="views">
      <div className="views__side">
        <figure className="drawing">
          <SideView />
          {hotspots.map((h) => (
            <Link key={h.n} href={h.sheet} className="hotspot" style={{ left: h.x, top: h.y }} prefetch={false}>
              <span className="num">{h.n}</span>
              <span className="sr-only">{h.title}</span>
            </Link>
          ))}
        </figure>
        <ol className="hotlist">
          {hotspots.map((h) => (
            <li key={h.n}>
              <Link href={h.sheet} prefetch={false}>
                <span className="num">{h.n}</span>
                {h.title}
              </Link>
            </li>
          ))}
        </ol>
      </div>
      <div className="views__rest">
        <figure className="drawing drawing--small">
          <figcaption className="kicker">Front</figcaption>
          <FrontView />
        </figure>
        <figure className="drawing drawing--small">
          <figcaption className="kicker">Rear</figcaption>
          <RearView />
        </figure>
        <figure className="drawing drawing--small">
          <figcaption className="kicker">Plan</figcaption>
          <PlanView />
        </figure>
      </div>
    </div>
  );
}
