import { z } from 'zod'

export const exerciseSetFormSchema = z.object({
	date: z
		.date({ invalid_type_error: 'Must be a valid date' })
		.describe('The date in which the exercise set occurred'),
	title: z
		.string()
		.min(1, { message: 'Required field' })
		.describe('The name of the exercise'),
	sets: z.coerce
		.number()
		.describe('The number of reps the user did for this exercise'),
	reps: z.coerce
		.number()
		.describe('The number of sets of reps that the user did for this exercise')
})

export type ExerciseSet = z.infer<typeof exerciseSetFormSchema>
