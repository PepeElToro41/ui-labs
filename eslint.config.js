import eslint from "@eslint/js";
import perfectionist from "eslint-plugin-perfectionist";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import roblox from "eslint-plugin-roblox-ts";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
	eslint.configs.recommended,
	tseslint.configs.recommended,
	roblox.configs.tsRecommendedCompat,
	roblox.configs.recommended,
	{
		plugins: {
			perfectionist
		},
		rules: {
			"perfectionist/sort-imports": "error"
		}
	},
	{
		rules: {
			"prefer-const": "off",
			"no-constant-condition": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-empty-object-type": "off",
			"roblox-ts/no-any": "off"
		}
	},
	globalIgnores(["out/**", "node_modules/**", "docs/**"]),
	prettierRecommended
);
