import { defineConfig, globalIgnores } from "eslint/config";
import astro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  globalIgnores(["dist/**", ".astro/**", ".next/**", "node_modules/**", "public/**", "**/*.astro"]),
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
]);

export default eslintConfig;
