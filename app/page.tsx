import { Console, type ConsoleItem } from "@/components/console";
import { FloorPlan } from "@/components/floor-plan";
import { FreeNow, HomeScheduler } from "@/components/home-scheduler";
import { JobTracker } from "@/components/job-tracker";
import { PriceBoard } from "@/components/price-board";
import { Readout } from "@/components/readout";
import { SpecSheets } from "@/components/spec-sheets";
import { VehicleViews } from "@/components/vehicle-views";
import { consoleSymptoms, serviceById, sheets, symptomById } from "@/lib/data";

function bandFor(severity: number) {
  if (severity >= 76) return "Attention";
  if (severity >= 34) return "Book this week";
  return "Routine";
}

export default function Home() {
  const now = new Date();
  const items: ConsoleItem[] = consoleSymptoms.map((entry) => {
    const symptom = symptomById(entry.id);
    if (!symptom) throw new Error(entry.id);
    const service = serviceById(symptom.service);
    return {
      id: entry.id,
      label: entry.label,
      severity: entry.severity,
      cause: symptom.causes[0].title,
      price: service.from,
      service: service.id,
      serviceName: service.name,
      serviceShort: service.short,
      band: bandFor(entry.severity),
      attention: entry.severity >= 76,
    };
  });

  return (
    <>
      <section id="diagnose" data-layout="console" className="block" aria-labelledby="hero-title">
        <Console items={items} nowIso={now.toISOString()}>
          <p className="kicker">Diagnose</p>
          <h1 id="hero-title">Tell us what the car is doing</h1>
          <p className="lede">
            Pick the closest symptom. The gauge names a likely cause, a fixed price band and the next free bay. We confirm it on the hoist before any work starts.
          </p>
          <ul className="nojs-only symptom-links">
            {items.map((item) => {
              const sheet = sheets.find((s) => s.symptomId === item.id);
              return (
                <li key={item.id}>
                  <a href={sheet ? `/services/${sheet.slug}` : "/services/general"}>{item.label}</a>
                </li>
              );
            })}
          </ul>
        </Console>
        <div className="nojs-only readings">
          <p>Every symptom is listed here. With JavaScript, the gauge shows one at a time.</p>
          {items.map((item) => {
            const symptom = symptomById(item.id);
            return symptom ? <Readout key={item.id} symptom={symptom} plainLabel={item.label} /> : null;
          })}
        </div>
      </section>

      <section id="vehicle" data-layout="orthographic" className="block" aria-labelledby="views-title">
        <div className="panel">
          <div className="panel__bar">
            <h2 id="views-title" className="panel__label">Four views</h2>
            <p className="panel__value">6 hotspots</p>
          </div>
          <div className="panel__body">
            <p className="lede">One line weight, four orthographic views. The numbers match the specification sheets. This is not a customer car.</p>
            <VehicleViews />
          </div>
        </div>
      </section>

      <section id="services" data-layout="spec-sheet" className="block" aria-labelledby="sheets-title">
        <div className="section-label">
          <h2 id="sheets-title">Specification sheets</h2>
          <p>Each job lists the checks we do and a fixed price band. Parts at cost appear only on the quote. Every band is a demonstration figure, not a quote.</p>
        </div>
        <SpecSheets />
      </section>

      <section id="prices" data-layout="price-table" className="block" aria-labelledby="prices-title">
        <div className="panel">
          <div className="panel__bar">
            <h2 id="prices-title" className="panel__label">Price bands</h2>
            <p className="panel__value">Demonstration</p>
          </div>
          <div className="panel__body">
            <p className="lede">Filter the common jobs. The full list, including parts rules, is on the prices page. These figures are invented.</p>
            <PriceBoard variant="featured" prefix="home-price" />
          </div>
        </div>
      </section>

      <section id="tracker" data-layout="job-track" className="block" aria-labelledby="tracker-title">
        <div className="panel">
          <div className="panel__bar">
            <h2 id="tracker-title" className="panel__label">Job tracker</h2>
            <p className="panel__value">4 states</p>
          </div>
          <div className="panel__body">
            <p className="lede">Inspect, quote, approve, repair. Nothing starts without a yes. These are demonstration terms, not a warranty.</p>
            <JobTracker />
          </div>
        </div>
      </section>

      <section id="schedule" data-layout="bay-grid" className="block" aria-labelledby="schedule-title">
        <div className="panel">
          <div className="panel__bar">
            <h2 id="schedule-title" className="panel__label">Bay scheduler</h2>
            <FreeNow initialIso={now.toISOString()} />
          </div>
          <div className="panel__body">
            <p className="lede">Seven open days, four bays. Choose a free cell. Taken cells are demonstration holds, not real bookings.</p>
            <HomeScheduler initialIso={now.toISOString()} />
          </div>
        </div>
      </section>

      <section id="workshop" data-layout="floor-plan" className="block" aria-labelledby="workshop-title">
        <div className="panel">
          <div className="panel__bar">
            <h2 id="workshop-title" className="panel__label">Workshop floor</h2>
            <p className="panel__value">Welshpool</p>
          </div>
          <div className="panel__body">
            <FloorPlan />
          </div>
        </div>
      </section>
    </>
  );
}
