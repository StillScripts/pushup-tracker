import type { Config } from 'drizzle-kit'

import 'dotenv/config'

export default {
	schema: './db/schema.ts',
	out: './migrations',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.DATABASE_URL!
	},
	verbose: true
} satisfies Config
