import { relations, sql } from 'drizzle-orm'
import {
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar
} from 'drizzle-orm/pg-core'
import { v4 as uuidv4 } from 'uuid'

export const exerciseCategory = pgEnum('exercise_category', [
	'distance',
	'sport',
	'reps'
])

const createdAndUpdated = {
	createdAt: timestamp('created_at')
		.default(sql`now()`)
		.notNull(),
	updatedAt: timestamp('updated_at')
		.default(sql`now()`)
		.notNull()
}

/**
 * TABLES
 */

/** Table for storing extra data on users. The id matches the auth id */
export const users = pgTable('users', {
	id: uuid('id').primaryKey(),
	fullName: text('full_name')
})

/** Table for storing a single exercise event, like swimming 50 laps of 25m pool  */
export const exerciseEvents = pgTable('exercise_events', {
	id: uuid('id')
		.notNull()
		.primaryKey()
		.$defaultFn(() => uuidv4()),
	date: timestamp('date')
		.default(sql`now()`)
		.notNull(),
	notes: text('notes'),
	exerciseCategory: exerciseCategory('exercise_category'),
	userId: uuid('userId')
		.notNull()
		.references(() => users.id)
})

/** Table for storing an exercise session, like a gym ab workout session */
export const exerciseSessions = pgTable('exercise_sessions', {
	id: uuid('id')
		.notNull()
		.primaryKey()
		.$defaultFn(() => uuidv4()),
	date: timestamp('date')
		.default(sql`now()`)
		.notNull(),
	notes: text('notes'),
	userId: uuid('userId')
		.notNull()
		.references(() => users.id)
})

/** Table for storing each set in an exercise session */
export const exerciseSets = pgTable('exercise_sets', {
	id: uuid('id')
		.notNull()
		.primaryKey()
		.$defaultFn(() => uuidv4()),
	reps: integer('reps'),
	sets: integer('sets').default(1),
	// By default it will be an event unless an exercise session is created
	exerciseEventId: uuid('exercise_event_id').references(
		() => exerciseSessions.id
	),
	exerciseSessionId: uuid('exercise_session_id').references(
		() => exerciseSessions.id
	),
	exerciseTitle: varchar('exercise_title', { length: 255 }).notNull(),
	...createdAndUpdated
})

/**
 * RELATIONS
 */

/** An exercise session will be tied to one user but can have many sets */
export const exerciseSessionsRelations = relations(
	exerciseSessions,
	({ many, one }) => ({
		exerciseSets: many(exerciseSets),
		user: one(users, {
			fields: [exerciseSessions.userId],
			references: [users.id]
		})
	})
)

/** An exercise session will be tied to one user and one exercise set */
export const exerciseEventsRelations = relations(exerciseEvents, ({ one }) => ({
	exerciseSets: one(exerciseSets),
	user: one(users, {
		fields: [exerciseEvents.userId],
		references: [users.id]
	})
}))

/** An exercise set will always be linked to one exercise */
export const exerciseSetsRelations = relations(exerciseSets, ({ one }) => ({
	exerciseEvent: one(exerciseEvents, {
		fields: [exerciseSets.exerciseSessionId],
		references: [exerciseEvents.id]
	}),
	exerciseSessions: one(exerciseSessions, {
		fields: [exerciseSets.exerciseSessionId],
		references: [exerciseSessions.id]
	})
}))

/** User can have many exercise events and sessions */
export const usersRelations = relations(users, ({ many }) => ({
	exerciseEvents: many(exerciseSessions),
	exerciseSessions: many(exerciseSessions)
}))
