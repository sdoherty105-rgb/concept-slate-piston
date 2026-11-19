import type { ReactNode } from "react";
import { Footer } from "./footer";
import { JobReadout } from "./job-readout";
import { Rail } from "./rail";
import { StatusBar } from "./status-bar";

export function Shell({ children, nowIso }: { children: ReactNode; nowIso: string }) {
  return (
    <div className="app">
      <Rail />
      <StatusBar initialIso={nowIso} />
      <main id="main" className="main">
        {children}
      </main>
      <JobReadout initialIso={nowIso} />
      <Footer />
    </div>
  );
}
