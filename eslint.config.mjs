import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "legacy/**",
  ]),
  { files: ["check-upload.js", "migrate-nav.js", "test-upload.js"], rules: { "@typescript-eslint/no-require-imports": "off" } },
  {
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
]);
