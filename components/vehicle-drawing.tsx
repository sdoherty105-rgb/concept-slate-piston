export function VehicleDrawing() {
  return <svg viewBox="0 0 900 350" role="img" aria-label="Side elevation drawing of a hatchback, showing the wheels, body and engine position" className="vehicle-drawing">
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M84 238 L99 164 Q105 150 132 143 L239 125 L329 57 Q346 45 382 45 H558 Q580 45 596 65 L655 135 L779 158 Q802 164 806 186 L818 238 H766 Q758 178 706 178 Q652 178 645 238 H286 Q277 179 225 179 Q171 179 164 238 Z" strokeWidth="3"/>
      <path d="M264 124 L345 65 H394 V124 Z M410 65 H550 Q564 65 578 82 L614 124 H410 Z"/>
      <path d="M409 134 V227 M639 140 L625 218 M105 169 L152 165 V180 L103 190 M778 171 H798 L802 190 H776 Z M296 148 H322 M435 148 H461 M290 226 H627"/>
      <circle cx="225" cy="240" r="49" strokeWidth="4"/><circle cx="225" cy="240" r="31"/><circle cx="225" cy="240" r="8"/>
      <circle cx="706" cy="240" r="49" strokeWidth="4"/><circle cx="706" cy="240" r="31"/><circle cx="706" cy="240" r="8"/>
      {[0,60,120,180,240,300].map(a=><g key={a}><path d="M225 211 V222" transform={`rotate(${a} 225 240)`}/><path d="M706 211 V222" transform={`rotate(${a} 706 240)`}/></g>)}
      <path d="M82 300 H820 M82 293 V307 M820 293 V307 M52 45 V287 M45 45 H59 M45 287 H59" strokeWidth="1" opacity=".5"/>
      <path d="M660 157 H744 V169 H660 Z M674 169 V190 M695 169 V185 M717 169 V181" strokeDasharray="4 4" opacity=".7"/>
      <path d="M154 89 H95 V115 M735 116 V91 H794" strokeWidth="1"/>
    </g>
    <g fill="currentColor" fontFamily="monospace" fontSize="11" letterSpacing="1">
      <text x="96" y="80">INSPECT / DIAGNOSE</text><text x="685" y="80">SERVICE / REPAIR</text><text x="345" y="326">INDEPENDENT AUTOMOTIVE WORKSHOP</text>
    </g>
  </svg>;
}
