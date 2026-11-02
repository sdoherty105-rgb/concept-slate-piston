"use client";

import { useId } from "react";
import { bays, slotTaken, slotValue, type BookDay } from "@/lib/workshop-time";

type Props = {
  days: BookDay[];
  value?: string;
  onChange?: (slot: string) => void;
};

export function Scheduler({ days, value, onChange }: Props) {
  const uid = useId().replace(/:/g, "");
  const dayName = `${uid}-day`;
  const slotName = `${uid}-slot`;
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
        {days.map((day, i) => {
          const id = `${uid}-${day.iso}`;
          return (
            <div key={day.iso}>
              <input type="radio" name={dayName} id={id} defaultChecked={i === 0} />
              <label htmlFor={id}>
                <span className="num">{day.weekday}</span>
                <span>{day.label}</span>
              </label>
            </div>
          );
        })}
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
                    <span>Taken</span>
                    <span className="sr-only">
                      {day.weekday} {day.label} {bay.name}, demonstration hold
                    </span>
                  </div>
                );
              }
              return (
                <div className="slot" data-day={day.iso} key={slot}>
                  <input
                    type="radio"
                    name={slotName}
                    id={id}
                    value={slot}
                    checked={value === slot}
                    onChange={() => onChange?.(slot)}
                  />
                  <label htmlFor={id}>
                    <span>Free</span>
                    <span className="sr-only">
                      {day.weekday} {day.label} {bay.name} {bay.role}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <p className="demo-line">Demonstration schedule. Holds are invented. Nothing is reserved.</p>
    </div>
  );
}
