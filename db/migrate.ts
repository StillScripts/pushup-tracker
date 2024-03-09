import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

import 'dotenv/config'

const handleMigration = async () => {
	const connectionString = process.env.DATABASE_URL!
	const sql = postgres(connectionString, { max: 1 })
	const db = drizzle(sql)

	await migrate(db, { migrationsFolder: 'migrations' })

	await sql.end()
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
handleMigration()
