import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookLink } from "@/components/book-link";
import { serviceById, sheetBySlug, sheets, symptomById } from "@/lib/data";

export function generateStaticParams() {
  return sheets.map((sheet) => ({ slug: sheet.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const sheet = sheetBySlug(slug);
  return {
    title: sheet ? sheet.title : "Service",
    description: sheet
      ? `${sheet.title}. Demonstration specification for a fictional workshop. An OFF/SHIFT Studio concept.`
      : "Service sheet",
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sheet = sheetBySlug(slug);
  if (!sheet) notFound();
  const symptom = symptomById(sheet.symptomId);
  const service = symptom ? serviceById(symptom.service) : null;

  return (
    <article className="block" data-layout="spec-sheet" aria-labelledby="sheet-title">
      <p className="kicker">
        <Link href="/#services">Services</Link>
      </p>
      <h1 id="sheet-title">{sheet.title}</h1>
      <p className="lede">{sheet.lede}</p>
      <div className="sheet-page">
        <div className="panel">
          <div className="panel__bar">
            <h2 className="panel__label">Included checks</h2>
            <p className="panel__value num">{service ? `From ${service.from}` : ""}</p>
          </div>
          <div className="panel__body">
            <ul className="checks">
              {sheet.checks.map((check) => (
                <li key={check}>
                  <span>{check}</span>
                </li>
              ))}
            </ul>
            {symptom && (
              <>
                <h2 className="subhead">Likely causes</h2>
                <ul className="causes">
                  {symptom.causes.map((cause) => (
                    <li key={cause.title}>
                      <strong>{cause.title}</strong>
                      <span>{cause.detail}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
        <aside className="panel">
          <div className="panel__bar">
            <h2 className="panel__label">Price band</h2>
            <p className="panel__value">Demonstration</p>
          </div>
          <div className="panel__body">
            <p className="sheet__price num">{service?.from}</p>
            <p>{service?.fromNote}. Parts at cost are shown only on the written quote.</p>
            <p className="demo-line">Demonstration band. Not a quote, and not a guarantee.</p>
            {service && symptom && (
              <BookLink className="btn-lime" service={service.id} symptom={symptom.bookingNote} symptomId={symptom.id}>
                Book a {service.short.toLowerCase()} inspection
              </BookLink>
            )}
            <p>
              <Link href="/prices">All price bands</Link>
            </p>
          </div>
        </aside>
      </div>
      {sheet.slug === "brakes" && (
        <figure className="render">
          <picture>
            <source srcSet="/art/brake-caliper.avif" type="image/avif" />
            <img
              src="/art/brake-caliper.webp"
              width={1200}
              height={900}
              alt="Generated studio render of a brake disc beside a brake caliper, on a dark ground. Made for this concept, not a customer car."
              loading="lazy"
              decoding="async"
            />
          </picture>
          <figcaption>Demonstration render of a disc and caliper. Generated for this concept. Used once.</figcaption>
        </figure>
      )}
    </article>
  );
}
