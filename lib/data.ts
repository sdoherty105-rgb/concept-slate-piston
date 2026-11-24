export const CONCEPT_URL = "https://offshiftstudio.com.au/concepts/slate-piston";
export const CONCEPT_LABEL = "An OFF/SHIFT concept: a fictional demonstration";
export const STUDIO_ENQUIRY_URL = "https://offshiftstudio.com.au/?concept=slate-piston#contact";
export const STUDIO_CTA = "Want a website like this?";

export const business = {
  name: "Slate Piston",
  descriptor: "Independent automotive workshop",
  phone: "(08) 5550 0142",
  phoneHref: "tel:+61855500142",
  email: "bookings@slatepiston.example",
  address: ["Unit 4, 18 Anvil Road", "Welshpool WA 6106"],
  suburb: "Welshpool, Perth",
};

export type ServiceId = "logbook" | "diagnostics" | "brakes" | "suspension" | "performance";

export type Service = {
  id: ServiceId;
  name: string;
  short: string;
  summary: string;
  points: string[];
  from: string;
  fromNote: string;
};

export const services: Service[] = [
  {
    id: "logbook",
    name: "Logbook servicing",
    short: "Logbook service",
    summary:
      "Manufacturer-schedule servicing done by the book, with every item ticked off and itemised on your invoice.",
    points: [
      "Oil and filter to your manufacturer's specification",
      "Full checklist, with photos of anything we flag",
      "Service record updated and a copy kept on file",
    ],
    from: "$229",
    fromNote: "minor service",
  },
  {
    id: "diagnostics",
    name: "Diagnostics",
    short: "Diagnostics",
    summary:
      "Fault codes are read, then verified with tests. We trace the cause instead of clearing the light and hoping.",
    points: [
      "Scan with live data, not just stored codes",
      "Electrical and pressure testing where it applies",
      "Written fault report in plain language",
    ],
    from: "$99",
    fromNote: "scan and report",
  },
  {
    id: "brakes",
    name: "Brakes",
    short: "Brakes",
    summary:
      "Pads, rotors, fluid and calipers. Wear is measured and reported in millimetres so you can see the reason for the work.",
    points: [
      "Pad and rotor thickness measured and recorded",
      "Caliper slides cleaned and greased on every job",
      "Road test before the car goes back to you",
    ],
    from: "$249",
    fromNote: "pads, per axle",
  },
  {
    id: "suspension",
    name: "Suspension and steering",
    short: "Suspension",
    summary:
      "Shocks, bushes, joints and four-wheel alignment, so the car tracks straight and the ride settles again.",
    points: [
      "Joints, bushes and mounts checked for play",
      "Alignment printout before and after",
      "Worn parts shown to you on the hoist",
    ],
    from: "$139",
    fromNote: "four-wheel alignment",
  },
  {
    id: "performance",
    name: "Performance",
    short: "Performance",
    summary:
      "Road-legal upgrades and tuning. We baseline the car first, so any gain is measured and not guessed.",
    points: [
      "Health check before anything is bolted on",
      "Intake, exhaust and ECU tuning, road-legal only",
      "Before-and-after dyno run on tune work",
    ],
    from: "$149",
    fromNote: "performance health check",
  },
];

export const serviceById = (id: ServiceId): Service => {
  const found = services.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown service: ${id}`);
  return found;
};

export type Urgency = "stop" | "soon" | "routine";

export const urgencyLabel: Record<Urgency, string> = {
  stop: "Stop driving",
  soon: "Book this week",
  routine: "Routine",
};

export type Symptom = {
  id: string;
  label: string;
  hint: string;
  urgency: Urgency;
  urgencyNote: string;
  causesHeading: string;
  causes: { title: string; detail: string }[];
  checks: string;
  service: ServiceId;
  alsoRelevant?: { service: ServiceId; note: string };
  bookingNote: string;
};

export const symptoms: Symptom[] = [
  {
    id: "brake-noise",
    label: "Squeal or grind when braking",
    hint: "Noise",
    urgency: "soon",
    urgencyNote:
      "Squealing: book this week. A metal-on-metal grind or a soft pedal: stop driving and call us.",
    causesHeading: "Likely causes, most common first",
    causes: [
      {
        title: "Worn brake pads",
        detail: "Most pads have a metal wear tab that squeals when the friction material runs low.",
      },
      {
        title: "Glazed pads or rotors",
        detail: "Heat can harden the pad surface, which squeals even when there is plenty of material left.",
      },
      {
        title: "Scored or lipped rotors",
        detail: "A grinding sound usually means the pad has worn through and the backing plate is cutting the rotor.",
      },
      {
        title: "Sticking caliper slides",
        detail: "Dry or seized slide pins keep one pad dragging, which wears it faster and can pull the car to one side.",
      },
    ],
    checks: "Pad and rotor thickness, rotor runout, caliper slides and brake fluid condition.",
    service: "brakes",
    bookingNote: "Squeal or grind when braking",
  },
  {
    id: "bump-clunk",
    label: "Clunk or knock over bumps",
    hint: "Noise",
    urgency: "soon",
    urgencyNote: "Worn joints get worse with use. Book this week, and ease off on rough roads until then.",
    causesHeading: "Likely causes, most common first",
    causes: [
      {
        title: "Worn sway bar links",
        detail: "Small, cheap parts that rattle over bumps and low-speed corners when the joints loosen.",
      },
      {
        title: "Tired shock absorbers or top mounts",
        detail: "A knock from the corner of the car, often with a bouncy ride or nose-dive under braking.",
      },
      {
        title: "Worn control arm bushes",
        detail: "Perished rubber lets the arm shift, which clunks and can change how the car tracks.",
      },
      {
        title: "Loose or worn ball joints",
        detail: "A clunk with steering vagueness. Worth checking quickly, since a failed joint is a safety issue.",
      },
    ],
    checks: "Each joint and bush checked for play on the hoist, then a road test over the same bumps.",
    service: "suspension",
    bookingNote: "Clunk or knock over bumps",
  },
  {
    id: "warning-light",
    label: "Warning light on the dash",
    hint: "Warning light",
    urgency: "soon",
    urgencyNote:
      "Steady amber: book this week. Flashing check-engine light, or a red oil or temperature light: stop driving and call us.",
    causesHeading: "Likely causes, most common first",
    causes: [
      {
        title: "Ignition fault or misfire",
        detail: "Worn plugs or a failing coil. Often felt as a shudder at idle.",
      },
      {
        title: "Faulty oxygen or emissions sensor",
        detail: "Sensors age and report bad readings, which can lift fuel use before anything else shows.",
      },
      {
        title: "Fuel cap or evaporative system leak",
        detail: "A loose cap or cracked hose can trigger a light on an otherwise healthy engine.",
      },
      {
        title: "Charging or battery voltage fault",
        detail: "Low voltage can set off several unrelated lights at once, which a scan alone will not untangle.",
      },
    ],
    checks: "Full scan with live data, then the specific test that proves or rules out each suspect.",
    service: "diagnostics",
    bookingNote: "Warning light on the dash",
  },
  {
    id: "vibration",
    label: "Steering wheel shakes at speed",
    hint: "Vibration",
    urgency: "soon",
    urgencyNote: "Book this week. A sudden new shake or a wobble you can see in the tyre: pull over and call us.",
    causesHeading: "Likely causes, most common first",
    causes: [
      {
        title: "Out-of-balance wheel",
        detail: "A lost balance weight is the usual culprit, typically felt between 80 and 110 km/h.",
      },
      {
        title: "Damaged tyre or bent wheel",
        detail: "A bulge, flat spot or kerb-bent rim shakes at all speeds above a crawl.",
      },
      {
        title: "Worn tie rod ends or ball joints",
        detail: "Play in the steering linkage lets the wheel shimmy, often with a vague on-centre feel.",
      },
      {
        title: "Warped rotors, if it only shakes while braking",
        detail: "Uneven rotor thickness pulses through the pedal and the steering wheel.",
      },
    ],
    checks: "Wheel balance, tyre and rim inspection, steering linkage play and rotor runout.",
    service: "suspension",
    alsoRelevant: {
      service: "brakes",
      note: "If the shake only happens while braking, tell us. It points to the rotors.",
    },
    bookingNote: "Steering wheel shakes at speed",
  },
  {
    id: "pulling",
    label: "Pulls to one side",
    hint: "Handling",
    urgency: "soon",
    urgencyNote: "Book this week. If one wheel is very hot after a drive, stop and call us.",
    causesHeading: "Likely causes, most common first",
    causes: [
      {
        title: "Wheel alignment out of spec",
        detail: "Kerbs and potholes shift the settings, and the car drifts toward the side with more drag.",
      },
      {
        title: "Uneven tyre pressure or wear",
        detail: "Different pressures or a worn edge on one tyre are enough to pull the car off line.",
      },
      {
        title: "Sticking brake caliper",
        detail: "A dragging brake on one side pulls that way and leaves the wheel noticeably hotter.",
      },
      {
        title: "Worn suspension component",
        detail: "A tired bush or joint lets the wheel angle change under load.",
      },
    ],
    checks: "Tyre pressures and wear pattern, brake drag test, then a four-wheel alignment reading.",
    service: "suspension",
    bookingNote: "Car pulls to one side",
  },
  {
    id: "power-loss",
    label: "Feels flat or hesitates under load",
    hint: "Performance",
    urgency: "soon",
    urgencyNote: "Safe to drive gently. Book this week, and stop if the engine begins to stall or judder badly.",
    causesHeading: "Likely causes, most common first",
    causes: [
      {
        title: "Worn spark plugs or weak coils",
        detail: "Misfires under load feel like a stumble or a flat spot when you press the pedal.",
      },
      {
        title: "Restricted air or fuel filter",
        detail: "Cheap to fix, and a common reason for a car that no longer pulls like it used to.",
      },
      {
        title: "Dirty or failing airflow sensor",
        detail: "The engine computer mixes fuel from this reading, so a bad one leaves it running rich or lean.",
      },
      {
        title: "Vacuum or boost leak",
        detail: "A split hose or loose clamp loses pressure the engine is counting on.",
      },
    ],
    checks: "Fault scan, a measured baseline of how the engine performs, then the specific tests that follow from it.",
    service: "performance",
    alsoRelevant: {
      service: "diagnostics",
      note: "The health check starts with a fault scan, so you are not charged for the same scan twice.",
    },
    bookingNote: "Feels flat or hesitates under load",
  },
  {
    id: "service-due",
    label: "Service due, or history unknown",
    hint: "Maintenance",
    urgency: "routine",
    urgencyNote: "No rush, but oil and filters are cheaper to keep up than an engine is to replace.",
    causesHeading: "What is usually due",
    causes: [
      {
        title: "Engine oil and filter",
        detail: "The one item that matters most, on whichever interval your manufacturer sets.",
      },
      {
        title: "Air and cabin filters",
        detail: "Often skipped, and easy to see for yourself once we show you the old one.",
      },
      {
        title: "Brake fluid",
        detail: "It absorbs moisture over time and is usually due on a time schedule, not by kilometres.",
      },
      {
        title: "Spark plugs and belts",
        detail: "Due at longer intervals. We check your schedule and quote only what is actually due.",
      },
    ],
    checks: "Your manufacturer's schedule for the kilometres and months, plus a visual inspection of wear items.",
    service: "logbook",
    bookingNote: "Service due or history unknown",
  },
  {
    id: "no-start",
    label: "Will not start",
    hint: "No start",
    urgency: "stop",
    urgencyNote: "If the car is in a driveway it can wait. If it dies in traffic, stop and call. Do not keep cranking.",
    causesHeading: "Likely causes, most common first",
    causes: [
      {
        title: "Flat or failing battery",
        detail: "A slow crank or a click is usually voltage, not the starter itself.",
      },
      {
        title: "Starter or connection fault",
        detail: "A single click with lights still bright points at the starter circuit.",
      },
      {
        title: "No fuel or no spark",
        detail: "The engine turns but never fires. Fuel pressure or ignition has to be measured, not guessed.",
      },
      {
        title: "Immobiliser or key fault",
        detail: "A key the car does not recognise will crank, or refuse to crank, and set a security light.",
      },
    ],
    checks: "Battery voltage under crank, starter draw, fuel pressure, spark or injector pulse, and key status.",
    service: "diagnostics",
    bookingNote: "Will not start",
  },
  {
    id: "other",
    label: "Something else",
    hint: "Other",
    urgency: "routine",
    urgencyNote: "Tell us what you notice in ordinary words. If it feels unsafe, do not drive it in.",
    causesHeading: "How we narrow it down",
    causes: [
      {
        title: "A noise you can point at",
        detail: "Where it comes from, and whether it changes with speed or with the pedal, decides the first test.",
      },
      {
        title: "A leak or a smell",
        detail: "Oil, coolant and fuel leave different traces. We identify the fluid before we quote a repair.",
      },
      {
        title: "A feeling through the wheel or the seat",
        detail: "A vibration, a pull or a hesitation each has its own short list of checks.",
      },
      {
        title: "Something we should see on the hoist",
        detail: "If you cannot name it, the inspection is the right first job. We write down what we find.",
      },
    ],
    checks: "A road test where it is safe, a scan, and a hoist inspection of brakes, tyres and fluids.",
    service: "diagnostics",
    alsoRelevant: {
      service: "logbook",
      note: "If the car is also overdue, we can do the service in the same visit.",
    },
    bookingNote: "Something else",
  },
];

export type PriceRow = {
  id: string;
  category: ServiceId;
  item: string;
  includes: string;
  time: string;
  price: string;
  note?: string;
  featured?: boolean;
};

export const pricing: PriceRow[] = [
  {
    id: "minor-service",
    category: "logbook",
    item: "Minor logbook service",
    includes: "Oil and filter, fluid top-ups, 40-point inspection with photos of anything flagged.",
    time: "About 1.5 hrs",
    price: "From $229",
    featured: true,
  },
  {
    id: "major-service",
    category: "logbook",
    item: "Major logbook service",
    includes: "Minor service plus the plugs, filters and fluids your schedule calls for at this interval.",
    time: "About 3 hrs",
    price: "From $389",
    featured: true,
  },
  {
    id: "scan",
    category: "diagnostics",
    item: "Scan and fault report",
    includes: "Codes read, live data checked, written summary of what we found.",
    time: "About 45 min",
    price: "$99",
    note: "Credited toward the repair if you approve it within 7 days.",
    featured: true,
  },
  {
    id: "full-diagnostic",
    category: "diagnostics",
    item: "Full diagnostic inspection",
    includes: "Road test, pressure and electrical testing, written report with photos.",
    time: "About 2 hrs",
    price: "$189",
    note: "Credited toward the repair if you approve it within 7 days.",
  },
  {
    id: "brake-pads",
    category: "brakes",
    item: "Brake pads, front or rear",
    includes: "Pads fitted, rotors measured, slides cleaned and greased, road test.",
    time: "About 1.5 hrs",
    price: "From $249 per axle",
    featured: true,
  },
  {
    id: "pads-rotors",
    category: "brakes",
    item: "Pads and rotors",
    includes: "As above, with new rotors where measurement shows they are below spec.",
    time: "About 2.5 hrs",
    price: "From $549 per axle",
    featured: true,
  },
  {
    id: "brake-fluid",
    category: "brakes",
    item: "Brake fluid flush",
    includes: "Old fluid removed, system bled, moisture content tested before and after.",
    time: "About 1 hr",
    price: "$119",
  },
  {
    id: "alignment",
    category: "suspension",
    item: "Four-wheel alignment",
    includes: "Before-and-after printout, adjusted to your manufacturer's specification.",
    time: "About 1 hr",
    price: "$139",
    featured: true,
  },
  {
    id: "shocks",
    category: "suspension",
    item: "Shock absorbers, pair",
    includes: "Fitted with new mounts and bump stops where the inspection calls for them.",
    time: "About 2.5 hrs",
    price: "From $520 per axle",
  },
  {
    id: "joints-bushes",
    category: "suspension",
    item: "Joints, bushes and links",
    includes: "Varies widely by car, so we quote after inspection, line by line.",
    time: "Quoted",
    price: "Quoted after inspection",
  },
  {
    id: "perf-check",
    category: "performance",
    item: "Performance health check",
    includes: "Fault scan, measured baseline, and a written plan ranked by value for money.",
    time: "About 2 hrs",
    price: "$149",
    featured: true,
  },
  {
    id: "bolt-ons",
    category: "performance",
    item: "Intake or exhaust fitting",
    includes: "Labour to fit road-legal parts you supply or we source. Parts quoted separately.",
    time: "From 1 hr",
    price: "From $180 labour",
  },
  {
    id: "tune",
    category: "performance",
    item: "ECU tune with dyno runs",
    includes: "Before-and-after dyno runs, tune file, printed results.",
    time: "Half a day",
    price: "From $890",
    featured: true,
  },
];

export const process = [
  {
    step: "inspect",
    title: "Inspect",
    body: "We look before we talk numbers. The car goes on the hoist, we measure what matters and photograph what we find.",
    gives: "Photos and measurements",
  },
  {
    step: "quote",
    title: "Quote",
    body: "A written, itemised quote by SMS or email. Every line is ranked: fix now, fix soon, or keep an eye on it.",
    gives: "Itemised written quote",
  },
  {
    step: "approve",
    title: "Approve",
    body: "You approve line by line. Nothing starts without a yes from you, and a no is a perfectly good answer.",
    gives: "Your sign-off, line by line",
  },
  {
    step: "repair",
    title: "Repair",
    body: "We do the approved work and nothing else. If we find something new, we stop and ask before touching it.",
    gives: "Old parts back, on request",
  },
];

export const hours = [
  { day: "Monday to Friday", time: "7:30 am – 5:00 pm" },
  { day: "Saturday", time: "8:00 am – 12:00 pm" },
  { day: "Sunday", time: "Closed" },
  { day: "Public holidays", time: "Closed" },
];

export const promises = [
  "Written quote before any work starts",
  "Nothing is done without your approval",
  "Old parts shown, and returned if you ask",
];

export const navLinks = [
  { href: "/#diagnose", label: "Diagnose" },
  { href: "/#services", label: "Services" },
  { href: "/prices", label: "Prices" },
  { href: "/book", label: "Book" },
  { href: "/#workshop", label: "Workshop" },
];

/** Six plain-language entries for the console. Severity is a demonstration scale, 0 to 100. */
export const consoleSymptoms: { id: string; label: string; severity: number }[] = [
  { id: "brake-noise", label: "Squealing when I brake", severity: 74 },
  { id: "no-start", label: "Will not start", severity: 92 },
  { id: "warning-light", label: "Warning light on", severity: 61 },
  { id: "pulling", label: "Pulls to one side", severity: 56 },
  { id: "service-due", label: "Overdue for a service", severity: 18 },
  { id: "other", label: "Something else", severity: 40 },
];

export type Sheet = {
  slug: string;
  code: string;
  symptomId: string;
  title: string;
  lede: string;
  checks: string[];
};

export const sheets: Sheet[] = [
  {
    slug: "brakes",
    code: "SP-BRK",
    symptomId: "brake-noise",
    title: "Brake inspection",
    lede: "We measure the friction material and the discs, then tell you what is left in millimetres.",
    checks: [
      "Pad thickness on each wheel, recorded in millimetres",
      "Rotor thickness against the stamped minimum",
      "Rotor runout, the wobble that pulses the pedal",
      "Caliper slide pins cleaned, measured and greased",
      "Brake fluid moisture, before any flush is quoted",
      "Road test, including one stop from 60 km/h",
    ],
  },
  {
    slug: "no-start",
    code: "SP-NST",
    symptomId: "no-start",
    title: "No-start inspection",
    lede: "Cranks, clicks, or silence. Each one has a different first measurement.",
    checks: [
      "Voltage at rest and while cranking",
      "Starter draw, so a weak battery is not blamed on the starter",
      "Fuel pressure at the rail",
      "Spark or injector pulse, whichever the engine uses",
      "Key and immobiliser status",
      "A written fault report, whether we find a code or not",
    ],
  },
  {
    slug: "warning-light",
    code: "SP-WRN",
    symptomId: "warning-light",
    title: "Warning-light inspection",
    lede: "A stored code is a clue. The inspection is the test that proves it.",
    checks: [
      "Full scan with live data, not only the stored code",
      "Freeze-frame: what the engine was doing when the light came on",
      "The single test that proves or rules out the top suspect",
      "Charging voltage, because low voltage sets unrelated lights",
      "A written report in plain language",
      "The scan fee credited if you approve the repair within 7 days",
    ],
  },
  {
    slug: "pull",
    code: "SP-PLL",
    symptomId: "pulling",
    title: "Pull and alignment inspection",
    lede: "A car that wanders is dragging on one side. We find which side, then why.",
    checks: [
      "Tyre pressures and the wear pattern on each edge",
      "Brake drag, with a temperature check after a short drive",
      "Play in joints and bushes, checked on the hoist",
      "Four-wheel alignment reading against the manufacturer spec",
      "Before-and-after printout if we adjust it",
      "A note if the pull is a tyre, not the alignment",
    ],
  },
  {
    slug: "logbook",
    code: "SP-LOG",
    symptomId: "service-due",
    title: "Logbook service",
    lede: "The manufacturer schedule, item by item. Nothing extra without a yes.",
    checks: [
      "Oil and filter to the grade your schedule names",
      "The filters, plugs and fluids actually due at this interval",
      "Fluid levels, with a photo of anything low",
      "Brake measurement, recorded even when no work is due",
      "A 40-point inspection list, ticked and filed",
      "The service record updated, and a copy for you",
    ],
  },
  {
    slug: "general",
    code: "SP-GEN",
    symptomId: "other",
    title: "General inspection",
    lede: "For the fault that does not fit a button. You leave with a list, not a shrug.",
    checks: [
      "Your description, written back to you so we agree on the symptom",
      "A road test when it is safe to drive",
      "A scan for stored and pending faults",
      "Brakes, tyres and fluids checked and measured",
      "Findings ranked: fix now, fix soon, or watch",
      "A fixed inspection price. Parts appear only on the quote",
    ],
  },
];

export const sheetBySlug = (slug: string) => sheets.find((s) => s.slug === slug);

export const symptomById = (id: string) => symptoms.find((s) => s.id === id);
