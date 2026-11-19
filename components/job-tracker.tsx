import { process } from "@/lib/data";

export function JobTracker() {
  return (
    <ul className="tracker">
      {process.map((step, i) => (
        <li key={step.step}>
          <span className="stage" aria-hidden="true" style={{ ["--k" as string]: i + 1 }}>
            <i />
            <i />
            <i />
            <i />
          </span>
          <h3>{step.title}</h3>
          <p>{step.body}</p>
          <p className="tracker__gives">
            <span className="kicker">You get</span>
            {step.gives}
          </p>
        </li>
      ))}
    </ul>
  );
}
