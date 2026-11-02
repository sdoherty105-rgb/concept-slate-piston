import { process } from "@/lib/data";

export function JobTracker() {
  return (
    <ol className="tracker">
      {process.map((step) => (
        <li key={step.step}>
          <p className="num">{step.step}</p>
          <h3>{step.title}</h3>
          <p>{step.body}</p>
          <p className="tracker__gives">
            <span className="kicker">You get</span>
            {step.gives}
          </p>
        </li>
      ))}
    </ol>
  );
}
