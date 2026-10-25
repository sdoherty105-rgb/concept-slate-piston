import { serviceById, type PriceRow } from "@/lib/data";

export function PriceTable({ rows, caption }: { rows: PriceRow[]; caption: string }) {
  return (
    <div className="price-wrap">
      <table className="price-table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Service</th>
            <th scope="col">What is included</th>
            <th scope="col">Time</th>
            <th scope="col">Price, GST included</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <th scope="row">
                <span className="price-table__cat">{serviceById(r.category).short}</span>
                {r.item}
              </th>
              <td data-label="Included">
                {r.includes}
                {r.note && <span className="price-table__note">{r.note}</span>}
              </td>
              <td data-label="Time">{r.time}</td>
              <td data-label="Price" className="price-table__price">
                {r.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
