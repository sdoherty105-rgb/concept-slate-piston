import Link from "next/link";
import { serviceById, sheets, symptomById } from "@/lib/data";

export function SpecSheets() {
  return (
    <ol className="sheets">
      {sheets.map((sheet) => {
        const symptom = symptomById(sheet.symptomId);
        const service = symptom ? serviceById(symptom.service) : null;
        return (
          <li key={sheet.slug} className="panel sheet">
            <div className="panel__bar">
              <h3 className="panel__label">
                <span className="num">{sheet.code}</span> {sheet.title}
              </h3>
              <p className="panel__value num">{service ? `From ${service.from}` : ""}</p>
            </div>
            <div className="panel__body sheet__body">
              <div>
                <p>{sheet.lede}</p>
                <ol className="checks">
                  {sheet.checks.map((check, i) => (
                    <li key={check}>
                      <span className="num">{String(i + 1).padStart(2, "0")}</span>
                      <span>{check}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="sheet__side">
                <p className="kicker">Fixed price band</p>
                <p className="sheet__price num">{service?.from}</p>
                <p>{service?.fromNote}. Parts at cost are shown only on the written quote.</p>
                <p className="demo-line">Demonstration band. Not a quote.</p>
                <Link className="btn-line" href={`/services/${sheet.slug}`} prefetch={false}>
                  Open {sheet.title.toLowerCase()}
                </Link>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
