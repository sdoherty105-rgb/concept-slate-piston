"use client";

import { useId, useState } from "react";
import { bays, parseSlot, slotTaken, slotValue, type BookDay } from "@/lib/workshop-time";

type Props = {
  days: BookDay[];
  value?: string;
  onChange?: (slot: string) => void;
};

export function Scheduler({ days, value, onChange }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const dayName = `${uid}-day`;
  const slotName = `${uid}-slot`;
  const chosen = value ? parseSlot(value) : null;
  // Which day the mobile picker shows. It follows the chosen bay, so a bay picked
  // elsewhere (the home grid) is visible when the booking form opens.
  const [picked, setPicked] = useState<string | null>(null);
  const [seen, setSeen] = useState(chosen?.iso ?? null);
  if ((chosen?.iso ?? null) !== seen) {
    setSeen(chosen?.iso ?? null);
    if (chosen) setPicked(chosen.iso);
  }
  const activeDay = days.some((d) => d.iso === picked) ? picked : days[0]?.iso;
  const mobileCss = days
    .map(
      (day) =>
        `@media (max-width:767px){#sched-${uid}:has(#${uid}-${day.iso}:checked) .slot[data-day="${day.iso}"]{display:flex}}`,
    )
    .join("");

  return (
    <div className="scheduler" id={`sched-${uid}`}>
      <style>{`@media (max-width:767px){#sched-${uid} .slot{display:none}}${mobileCss}`}</style>
      <fieldset className="day-picker">
        <legend className="kicker">Day</legend>
        <div className="day-picker__days">
          {days.map((day, i) => {
            const id = `${uid}-${day.iso}`;
            const free = bays.filter((_, b) => !slotTaken(i, b)).length;
            return (
              <div key={day.iso}>
                <input type="radio" name={dayName} id={id} checked={activeDay === day.iso} onChange={() => setPicked(day.iso)} />
                <label htmlFor={id}>
                  <span className="num">{day.weekday}</span>
                  <span>{day.label}</span>
                  <span className="day-picker__free">{free} free</span>
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>

      <div className="bay-grid" role="group" aria-label="Demonstration bays for the next seven open days">
        <div className="bay-grid__corner" aria-hidden="true" />
        {days.map((day) => (
          <div className="bay-grid__head" key={day.iso}>
            <span className="num">{day.weekday}</span>
            <span>{day.label}</span>
          </div>
        ))}
        {bays.map((bay, bayIndex) => (
          <div className="bay-grid__row" key={bay.id}>
            <div className="bay-grid__name">
              <span className="num">{bay.name}</span>
              <span>{bay.role}</span>
            </div>
            {days.map((day, dayIndex) => {
              const taken = slotTaken(dayIndex, bayIndex);
              const id = `${uid}-${day.iso}-${bay.id}`;
              const slot = slotValue(day.iso, bay.id);
              if (taken) {
                return (
                  <div className="slot slot--taken" data-day={day.iso} key={slot}>
                      <span aria-hidden="true">Taken</span>
                      <span className="sr-only">
                        {day.weekday} {day.label} {bay.name}, taken (demonstration hold)
                      </span>
                  </div>
                );
              }
              const isChosen = value === slot;
              return (
                <div className="slot" data-day={day.iso} key={slot}>
                    <input
                      type="radio"
                      name={slotName}
                      id={id}
                      value={slot}
                      checked={isChosen}
                      onChange={() => onChange?.(slot)}
                    />
                    <label htmlFor={id}>
                      <span aria-hidden="true">{isChosen ? "Selected" : "Free"}</span>
                      <span className="sr-only">
                        {day.weekday} {day.label} {bay.name} {bay.role}, free
                      </span>
                  </label>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <p className="scheduler__chosen" aria-live="polite">
        {chosen ? (
          <>
            <span className="kicker">Selected</span> <strong className="num">{chosen.bay.name}</strong> {chosen.bay.role.toLowerCase()},{" "}
            <strong className="num">{chosen.label}</strong>
          </>
        ) : (
          <>
            <span className="kicker">Selected</span> No bay yet. Choose a free cell.
          </>
        )}
      </p>
      <p className="demo-line">Demonstration schedule. Holds are invented. Nothing is reserved.</p>
    </div>
  );
}
