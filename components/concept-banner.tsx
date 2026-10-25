import { CONCEPT_LABEL, CONCEPT_URL } from "@/lib/data";

export function ConceptBanner() {
  return (
    <div className="concept-banner" data-testid="concept-label">
      <a href={CONCEPT_URL} rel="noopener noreferrer">
        {CONCEPT_LABEL}
      </a>
    </div>
  );
}
