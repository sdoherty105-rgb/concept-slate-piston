import Link from "next/link";
import { BookLink } from "@/components/book-link";
import { BookingForm } from "@/components/booking-form";
import { Diagnostics } from "@/components/diagnostics";
import { VehicleDrawing } from "@/components/vehicle-drawing";
import { PriceTable } from "@/components/price-table";
import { Readout } from "@/components/readout";

import { business, hours, pricing, process, services, symptoms } from "@/lib/data";

export default function Home() {
  return (
    <>
      <section className="workshop-front theme-light" aria-labelledby="hero-title">
        <div className="container">
          <div className="workshop-overline"><span>Independent automotive workshop</span><span>Welshpool, Western Australia</span></div>
          <div className="workshop-title"><h1 id="hero-title">Let&rsquo;s look<br />under the bonnet.</h1><div><p>Servicing, repairs and diagnostics.<br />A written quote before the work starts.</p><BookLink className="btn btn--primary">Book a service</BookLink></div></div>
          <VehicleDrawing />
          <div className="workshop-strip"><span>Logbook servicing</span><span>Brakes &amp; suspension</span><span>Diagnostics</span><Link prefetch={false} href="/#diagnose">Find your symptom</Link></div>
        </div>
      </section>

      <section id="diagnose" className="section section--defer theme-slate" aria-labelledby="diagnose-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Start with the symptom</p>
            <h2 id="diagnose-title" className="h-display h-display--lg">
              What is your car doing?
            </h2>
            <p className="lead">
              Choose a symptom to see possible causes, the urgency and the service that fits,
              then takes you to a booking with the details already filled in.
            </p>
          </div>
          <Diagnostics
            items={symptoms.map(({ id, label, hint }) => ({ id, label, hint }))}
            panels={Object.fromEntries(symptoms.map((s) => [s.id, <Readout key={s.id} symptom={s} />]))}
          />
        </div>
      </section>

      <section id="services" className="section section--defer theme-light" aria-labelledby="services-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">What we do</p>
            <h2 id="services-title" className="h-display h-display--lg">
              Workshop services.
            </h2>
            <p className="lead">
              We keep the list short so we can be good at it. If it is outside what we do, we will say so and point you
              somewhere sensible.
            </p>
          </div>
          <ul className="service-grid">
            {services.map((service, i) => <li key={service.id} className="service-card">
              <span className="service-card__num">{String(i + 1).padStart(2, "0")}</span>
              <div><h3>{service.name}</h3><p>{service.summary}</p><details className="service-detail"><summary>What is included</summary><ul>{service.points.map(point => <li key={point}>{point}</li>)}</ul></details></div>
              <div className="service-card__foot"><p className="service-card__price">From <strong>{service.from}</strong><span>{service.fromNote}</span></p><BookLink service={service.id} className="text-link">Book <span className="sr-only">{service.name}</span></BookLink></div>
            </li>)}
          </ul>
        </div>
      </section>

      <section id="how-it-works" className="section section--defer theme-light" aria-labelledby="how-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">How a job works</p>
            <h2 id="how-title" className="h-display h-display--lg">
              Four steps. You are in control of each one.
            </h2>
          </div>
          <ol className="steps">
            {process.map((p) => (
              <li key={p.step} className="step">
                <span className="step__num" aria-hidden="true">
                  {p.step}
                </span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                <p className="step__gives">
                  <span>You get</span> {p.gives}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="pricing" className="section section--defer theme-dark" aria-labelledby="pricing-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Transparent pricing</p>
            <h2 id="pricing-title" className="h-display h-display--lg">
              What the common jobs cost.
            </h2>
            <p className="lead">
              Starting prices for fictional services, GST included. Parts are quoted line by line, and the final price is
              the quoted price. If the job changes, we ask first.
            </p>
          </div>
          <PriceTable rows={pricing.filter((r) => r.featured)} caption="Starting prices for common services" />
          <div className="btn-row btn-row--spaced">
            <Link prefetch={false} href="/pricing" className="btn btn--ghost">
              See the full pricing guide
            </Link>
            <BookLink className="btn btn--primary">Book a service</BookLink>
          </div>
        </div>
      </section>

      <section id="book" className="section section--defer theme-light section--anchor" aria-labelledby="book-title">
        <div className="container book-grid">
          <div className="book-intro">
            <p className="eyebrow">Book a service</p>
            <h2 id="book-title" className="h-display h-display--lg">
              Request a time.
            </h2>
            <p className="lead">
              Tell us about the car and what is going on. Choose a service and your preferred day.
            </p>
            <ul className="ticks">
              <li>No payment taken online</li>
              <li>The quote comes after the inspection, never before</li>
              <li>You can cancel or move a booking with a phone call</li>
            </ul>
            <div className="book-call">
              <p className="book-call__label">Prefer to talk it through?</p>
              <a href={business.phoneHref}>{business.phone}</a>
              <p>Mon to Fri 7:30 am – 5:00 pm, Sat 8:00 am – 12:00 pm. Invented number for demonstration.</p>
            </div>
          </div>
          <div className="book-form-wrap">
            <BookingForm />
          </div>
        </div>
      </section>

      <section id="visit" className="section section--defer theme-slate" aria-labelledby="visit-title">
        <div className="container visit-grid">
          <div>
            <p className="eyebrow">Hours and location</p>
            <h2 id="visit-title" className="h-display h-display--lg">
              Find the workshop.
            </h2>
            <address className="address">
              {business.address.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            <p className="visit-note">Fictional address, shown for demonstration.</p>
            <h3 className="visit-h">Opening hours</h3>
            <table className="hours">
              <caption className="sr-only">Opening hours</caption>
              <tbody>
                {hours.map((h) => (
                  <tr key={h.day}>
                    <th scope="row">{h.day}</th>
                    <td>{h.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className="visit-h">Contact</h3>
            <p className="contact">
              <a href={business.phoneHref}>{business.phone}</a>
              <span>{business.email}</span>
            </p>
            <p className="visit-note">Invented contact details. Nobody will answer.</p>
          </div>
          <div className="location-type" aria-hidden="true">SLATE<br />PISTON<span>WELSHPOOL / WA</span></div>
        </div>
      </section>
    </>
  );
}

