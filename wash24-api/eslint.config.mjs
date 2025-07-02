import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default [
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	prettier,
	{
		rules: {
			indent: "off", // Disable ESLint indent rule
			"@typescript-eslint/indent": "off", // Disable TypeScript indent rule
			"no-mixed-spaces-and-tabs": "error",
			'@typescript-eslint/no-explicit-any': 'off'
		},
		ignores: [
			"**/node_modules/*",
			"**/dist/*",
			"**/.next/*",
			"**/coverage/*",
			"**/*.config.js",
			"**/*.test.ts",
		],
	},
];
