// Provide TMDB_API_KEY via local file that isn't committed.
// Create src/config/tmdb.local.ts with: export const TMDB_API_KEY = '...';
// This file safely reads the key if present.

// eslint-disable-next-line @typescript-eslint/no-var-requires
let local: { TMDB_API_KEY?: string } = {};
try {
	// Dynamically require to avoid bundler errors when file does not exist
	// @ts-ignore
	local = require('./tmdb.local');
} catch {}

export function TMDB_API_KEY_SAFE(): string | undefined {
	return local.TMDB_API_KEY;
}


