"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { ServiceId } from "@/lib/data";
import { workshopStatus } from "@/lib/workshop-time";
import { BookLink } from "./book-link";
import { useBooking } from "./booking-context";
import { useNow } from "./use-now";

export type ConsoleItem = {
  id: string;
  label: string;
  severity: number;
  cause: string;
  price: string;
  service: ServiceId;
  serviceName: string;
  serviceShort: string;
  band: string;
  attention: boolean;
};

function easeOutBack(t: number) {
  const c1 = 1.35;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}

export function Console({ items, nowIso, children }: { items: ConsoleItem[]; nowIso: string; children?: ReactNode }) {
  const bay = workshopStatus(useNow(nowIso)).nextSlot;
  const [selected, setSelected] = useState<string | null>(null);
  const [shown, setShown] = useState(0);
  const [angle, setAngle] = useState(-120);
  const angleRef = useRef(-120);
  const numberRef = useRef(0);
  const frame = useRef(0);
  const group = useId();
  const { setPrefill } = useBooking();
  const current = items.find((item) => item.id === selected) ?? null;

  useEffect(() => {
    const targetSeverity = current?.severity ?? 0;
    const targetAngle = -120 + (targetSeverity / 100) * 240;
    const fromAngle = angleRef.current;
    const fromNumber = numberRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cancelAnimationFrame(frame.current);
    if (reduce) {
      angleRef.current = targetAngle;
      numberRef.current = targetSeverity;
      frame.current = requestAnimationFrame(() => {
        setAngle(targetAngle);
        setShown(targetSeverity);
      });
      return () => cancelAnimationFrame(frame.current);
    }
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 700);
      const eased = easeOutBack(p);
      const tick = Math.min(1, (now - start) / 240);
      const nextAngle = fromAngle + (targetAngle - fromAngle) * eased;
      const nextNumber = Math.round(fromNumber + (targetSeverity - fromNumber) * tick);
      angleRef.current = nextAngle;
      numberRef.current = nextNumber;
      setAngle(nextAngle);
      setShown(nextNumber);
      if (p < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current);
  }, [current]);

  const choose = (item: ConsoleItem) => {
    setSelected(item.id);
    setPrefill({ service: item.service, symptom: item.label, symptomId: item.id });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) return;
    const next = -120 + (item.severity / 100) * 240;
    angleRef.current = next;
    numberRef.current = item.severity;
    setAngle(next);
    setShown(item.severity);
  };

  const live = current
    ? `${current.label}. Likely cause: ${current.cause}. Service ${current.serviceName}. From ${current.price}. Next free bay ${bay}. ${current.band}. Demonstration readout.`
    : "No symptom selected.";

  return (
    <div className="console">
      <div className="console__symptoms">
        {children}
        <div className="js-only">
        <fieldset>
          <legend className="sr-only">What the car is doing</legend>
          {items.map((item) => {
            const id = `${group}-${item.id}`;
            return (
              <div className="symptom" key={item.id}>
                <input
                  type="radio"
                  name={`${group}-symptom`}
                  id={id}
                  value={item.id}
                  checked={selected === item.id}
                  onChange={() => choose(item)}
                />
                <label htmlFor={id}>{item.label}</label>
              </div>
            );
          })}
        </fieldset>
        </div>
      </div>
      <div className="console__gauge js-only" data-testid="dx-result">
        <div className="gauge">
          <svg viewBox="0 0 200 168" className="gauge__svg" aria-hidden="true">
            <path d="M28 118 A72 72 0 1 1 172 118" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />
            {Array.from({ length: 11 }, (_, i) => {
              const t = -210 + i * 24;
              const rad = (t * Math.PI) / 180;
              const inner = i % 5 === 0 ? 62 : 66;
              const x1 = 100 + Math.cos(rad) * inner;
              const y1 = 108 + Math.sin(rad) * inner;
              const x2 = 100 + Math.cos(rad) * 74;
              const y2 = 108 + Math.sin(rad) * 74;
              return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={i % 5 === 0 ? 1.6 : 1} />;
            })}
            <path d="M36 132 A78 78 0 0 1 70 48" fill="none" stroke="#4DA3FF" strokeWidth="2" />
            <g transform={`rotate(${angle} 100 108)`}>
              <line x1="100" y1="108" x2="100" y2="42" stroke={current?.attention ? "#FFB224" : "#C6F135"} strokeWidth="2" />
              <circle cx="100" cy="108" r="3.5" fill={current?.attention ? "#FFB224" : "#C6F135"} />
            </g>
            <text x="24" y="156" fill="currentColor" fontSize="12" fontFamily="ui-monospace, monospace">
              LOW
            </text>
            <text x="140" y="156" fill="currentColor" fontSize="12" fontFamily="ui-monospace, monospace">
              HIGH
            </text>
          </svg>
          {current && (
            <p className="gauge__num num" aria-hidden="true">
              {shown}
            </p>
          )}
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {live}
        </p>
        {current ? (
          <div className="gauge-read">
            <p>
              <span className="kicker">Likely cause</span>
              <strong>{current.cause}</strong>
            </p>
            <p>
              <span className="kicker">Service</span>
              <strong>{current.serviceName}</strong>
            </p>
            <p>
              <span className="kicker">Fixed price from</span>
              <strong className="num">{current.price}</strong>
            </p>
            <p>
              <span className="kicker">Next free bay</span>
              <strong className="num">{bay}</strong>
            </p>
            <p className={current.attention ? "band band--stop" : "band"}>
              <span className="band__name">{current.band}</span>
              <span>{current.attention ? "Attention. Do not keep driving if it feels unsafe." : "We confirm this on the hoist before any work."}</span>
            </p>
            <BookLink service={current.service} symptom={current.label} symptomId={current.id} className="btn-lime">
              Book a {current.serviceShort.toLowerCase()} inspection
            </BookLink>
          </div>
        ) : (
          <div className="gauge-read">
            <p className="gauge-read__empty">Pick a symptom to start.</p>
            <p>The likely cause, the price band and the next free bay appear here. The needle is a guide, not a diagnosis.</p>
          </div>
        )}
        <p className="demo-line">Demonstration readout. Not a diagnosis and not a quote.</p>
      </div>
    </div>
  );
}
