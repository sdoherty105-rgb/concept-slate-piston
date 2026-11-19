"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { serviceById, services, STUDIO_ENQUIRY_URL, type ServiceId } from "@/lib/data";
import { parseSlot, type BookDay } from "@/lib/workshop-time";
import { useBooking } from "./booking-context";
import { Scheduler } from "./scheduler";

type Values = {
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  rego: string;
  service: ServiceId | "";
  slot: string;
  notes: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const empty: Values = {
  name: "",
  phone: "",
  email: "",
  vehicle: "",
  rego: "",
  service: "",
  slot: "",
  notes: "",
};

const fieldOrder: (keyof Values)[] = ["slot", "name", "phone", "email", "vehicle", "service"];

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.slot || !parseSlot(v.slot)) e.slot = "Choose a free bay and day.";
  if (v.name.trim().length < 2) e.name = "Enter your name.";
  const digits = v.phone.replace(/[\s()+-]/g, "");
  if (!/^\d{8,12}$/.test(digits)) e.phone = "Enter a phone number with 8 to 12 digits, for example 0400 000 000.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Enter an email address like name@example.com.";
  if (v.vehicle.trim().length < 3) e.vehicle = "Enter the year, make and model, for example 2016 Mazda 3.";
  if (!v.service) e.service = "Choose the service you need, or Diagnostics if you are not sure.";
  return e;
}

export function BookingForm({
  days,
  defaultService = "",
  defaultSymptom = "",
}: {
  days: BookDay[];
  defaultService?: string;
  defaultSymptom?: string;
}) {
  const { prefill, setPrefill } = useBooking();
  const serviceDefault = services.some((s) => s.id === defaultService) ? (defaultService as ServiceId) : "";
  const [values, setValues] = useState<Values>({
    ...empty,
    service: serviceDefault,
    notes: defaultSymptom ? `Symptom: ${defaultSymptom}.` : "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const lastStamp = useRef<number | null>(null);

  useEffect(() => {
    if (!prefill || prefill.stamp === lastStamp.current) return;
    lastStamp.current = prefill.stamp;
    setSubmitted(false);
    setValues((cur) => ({
      ...cur,
      service: prefill.service ?? cur.service,
      slot: prefill.slot ?? cur.slot,
      notes: prefill.symptom ? `Symptom: ${prefill.symptom}.` : cur.notes,
    }));
    setErrors((cur) => ({ ...cur, service: undefined, slot: undefined }));
  }, [prefill]);

  useEffect(() => {
    if (attempt > 0 && summaryRef.current) summaryRef.current.focus();
  }, [attempt]);

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((cur) => ({ ...cur, [key]: value }));
    if (errors[key]) setErrors((cur) => ({ ...cur, [key]: undefined }));
  };

  const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length === 0) setSubmitted(true);
    else setAttempt((n) => n + 1);
  };

  const reset = () => {
    setValues(empty);
    setErrors({});
    setSubmitted(false);
  };

  const errorList = fieldOrder.filter((k) => errors[k]);
  const describe = (k: keyof Values) => (errors[k] ? `${k}-error` : undefined);
  const chosen = values.slot ? parseSlot(values.slot) : null;

  if (submitted) {
    const svc = values.service ? serviceById(values.service) : null;
    return (
      <div className="form-success" role="status" tabIndex={-1} ref={successRef} data-testid="booking-success">
        <p className="kicker">Demo only</p>
        <h2>This is a demonstration. Your booking request was not sent.</h2>
        <p>
          Slate Piston is a fictional workshop, so nothing you typed has left your browser and nobody will contact you.
          On a live site, this is where the request would go to the workshop.
        </p>
        <dl className="summary">
          <div>
            <dt>Name</dt>
            <dd>{values.name}</dd>
          </div>
          <div>
            <dt>Vehicle</dt>
            <dd>{values.vehicle}</dd>
          </div>
          <div>
            <dt>Service</dt>
            <dd>{svc?.name}</dd>
          </div>
          <div>
            <dt>Bay</dt>
            <dd>{chosen ? `${chosen.bay.name}, ${chosen.label}` : values.slot}</dd>
          </div>
        </dl>
        <div className="form-success__actions">
          <button type="button" className="btn-line" onClick={reset}>
            Start another demo booking
          </button>
          <a className="btn-lime" href={STUDIO_ENQUIRY_URL}>
            Want a booking flow like this? Talk to OFF/SHIFT
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate data-testid="booking-form" aria-describedby="form-demo-note">
      <p id="form-demo-note" className="form__demo">
        <strong>Demo form.</strong> It checks your answers in the browser and shows a confirmation. Nothing is sent anywhere.
      </p>
      <p className="form__nojs nojs-only">The demo booking form needs JavaScript. The phone number on this page is invented.</p>

      {errorList.length > 0 && (
        <div className="form__summary" role="alert" tabIndex={-1} ref={summaryRef}>
          <p>
            <strong>Please fix {errorList.length === 1 ? "this field" : `these ${errorList.length} fields`}:</strong>
          </p>
          <ul>
            {errorList.map((k) => (
              <li key={k}>
                <a href={`#f-${k}`}>{errors[k]}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div id="f-slot">
        <Scheduler
          days={days}
          value={values.slot}
          onChange={(slot) => {
            set("slot", slot);
            setPrefill({ slot });
          }}
        />
        {errors.slot && (
          <p className="field__error" id="slot-error">
            {errors.slot}
          </p>
        )}
      </div>

      <fieldset className="form__fields">
        <legend className="sr-only">Your details</legend>
        <div className="field">
          <label htmlFor="f-name">Full name</label>
          <input id="f-name" name="name" autoComplete="name" value={values.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={describe("name")} />
          {errors.name && <p className="field__error" id="name-error">{errors.name}</p>}
        </div>
        <div className="field">
          <label htmlFor="f-phone">Mobile number</label>
          <input id="f-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!errors.phone} aria-describedby={describe("phone")} />
          {errors.phone && <p className="field__error" id="phone-error">{errors.phone}</p>}
        </div>
        <div className="field field--wide">
          <label htmlFor="f-email">Email</label>
          <input id="f-email" name="email" type="email" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={describe("email")} />
          {errors.email && <p className="field__error" id="email-error">{errors.email}</p>}
        </div>
        <div className="field">
          <label htmlFor="f-vehicle">Vehicle (year, make, model)</label>
          <input id="f-vehicle" name="vehicle" value={values.vehicle} onChange={(e) => set("vehicle", e.target.value)} aria-invalid={!!errors.vehicle} aria-describedby={describe("vehicle")} />
          {errors.vehicle && <p className="field__error" id="vehicle-error">{errors.vehicle}</p>}
        </div>
        <div className="field">
          <label htmlFor="f-rego">
            Registration <span className="optional">optional</span>
          </label>
          <input id="f-rego" name="rego" autoCapitalize="characters" value={values.rego} onChange={(e) => set("rego", e.target.value)} />
        </div>
        <div className="field field--wide">
          <label htmlFor="f-service">Service</label>
          <select id="f-service" name="service" value={values.service} onChange={(e) => set("service", e.target.value as ServiceId | "")} aria-invalid={!!errors.service} aria-describedby={describe("service")}>
            <option value="">Choose a service</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.service && <p className="field__error" id="service-error">{errors.service}</p>}
        </div>
        <div className="field field--wide">
          <label htmlFor="f-notes">
            What is happening? <span className="optional">optional</span>
          </label>
          <textarea id="f-notes" name="notes" rows={4} value={values.notes} onChange={(e) => set("notes", e.target.value)} />
        </div>
      </fieldset>

      <div className="form__actions">
        <button type="submit" className="btn-lime">
          Request a booking
        </button>
        <p className="form__fine">A real workshop would reply with a time. This demo does not.</p>
      </div>
    </form>
  );
}
