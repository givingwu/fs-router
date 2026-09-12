import { defineConfig } from "vitest/config";

export default defineConfig({
	// Configure Vitest (https://vitest.dev/config/)
	test: { include: ["tests/**/*.test.ts"] },
});
