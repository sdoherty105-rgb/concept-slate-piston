import { pricing, services } from "@/lib/data";
import { PriceTable } from "./price-table";

const filters = [{ id: "all", label: "All" }, ...services.map((s) => ({ id: s.id, label: s.short }))];

export function PriceBoard({ variant, prefix }: { variant: "featured" | "grouped"; prefix: string }) {
  return (
    <div className="price-board">
      <div className="filters" role="radiogroup" aria-label="Filter demonstration prices by service">
        {filters.map((f) => {
          const id = `${prefix}-${f.id}`;
          return (
            <div key={f.id}>
              <input type="radio" name={`${prefix}-filter`} id={id} value={f.id} defaultChecked={f.id === "all"} />
              <label htmlFor={id}>{f.label}</label>
            </div>
          );
        })}
      </div>
      {variant === "featured" ? (
        <PriceTable rows={pricing.filter((r) => r.featured)} caption="Starting price bands for common jobs" />
      ) : (
        services.map((s) => (
          <div className="price-group" data-cat={s.id} key={s.id} id={s.id}>
            <h3>{s.name}</h3>
            <PriceTable rows={pricing.filter((r) => r.category === s.id)} caption={`${s.name} price bands`} />
          </div>
        ))
      )}
    </div>
  );
}
