import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Custom ignores:
    ".github/scripts/**",     // Node.js scripts don't need strict TS/ESLint rules
    ".claude/skills/**",       // Python skill files
    "packages/@nextjs-ctf-demo/contentful-setup/**",  // Setup scripts
  ]),
]);

export default eslintConfig;
