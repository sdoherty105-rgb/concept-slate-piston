import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  { ignores: [".next/**", ".open-next/**", "node_modules/**", ".lighthouseci/**", "next-env.d.ts"] },
];

export default config;
