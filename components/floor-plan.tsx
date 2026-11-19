import { business } from "@/lib/data";

export function FloorPlan() {
  return (
    <div className="plan">
      <svg viewBox="0 0 640 420" role="img" aria-label="Schematic floor plan of a fictional four-bay workshop on Anvil Road">
        <g fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="24" y="36" width="592" height="348" />
          <path d="M24 300 H616" />
          <rect x="48" y="60" width="250" height="108" />
          <rect x="322" y="60" width="250" height="108" />
          <rect x="48" y="184" width="250" height="96" />
          <rect x="322" y="184" width="250" height="96" />
          <rect x="48" y="320" width="170" height="44" />
          <rect x="240" y="320" width="150" height="44" />
          <rect x="412" y="320" width="160" height="44" />
        </g>
        <g fill="currentColor" fontFamily="ui-monospace, monospace" fontSize="13">
          <text x="64" y="100">BAY A</text>
          <text x="64" y="120">HOIST</text>
          <text x="338" y="100">BAY B</text>
          <text x="338" y="120">HOIST</text>
          <text x="64" y="224">BAY C</text>
          <text x="64" y="244">ALIGNMENT</text>
          <text x="338" y="224">BAY D</text>
          <text x="338" y="244">DIAGNOSTIC</text>
          <text x="64" y="348">RECEPTION</text>
          <text x="256" y="348">OFFICE</text>
          <text x="428" y="348">PARTS</text>
        </g>
      </svg>
      <div className="plan__meta">
        <p className="kicker">Fictional address</p>
        <address>
          {business.address.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </address>
        <p>
          <a href={business.phoneHref}>{business.phone}</a>
        </p>
        <p>{business.email}</p>
        <p className="demo-line">Invented street, phone and email. Nobody will answer.</p>
        <h3 className="kicker">Hours, Perth</h3>
        <p>Monday to Friday, 7:30 am to 5:00 pm</p>
        <p>Saturday, 8:00 am to 12:00 pm</p>
        <p>Sunday, closed</p>
      </div>
    </div>
  );
}
