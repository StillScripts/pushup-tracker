'use server'

import { db } from '@/db/connection'
import { exerciseEvents, exerciseSets } from '@/db/schema'
import { createClient } from '@/lib/utils/supabase/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createExerciseSet = async (state: any, formData: FormData) => {
	const supabase = createClient()

	const { data } = await supabase.auth.getUser()
	const defaultEvent = await db
		.insert(exerciseEvents)
		.values({
			notes: '',
			userId: data.user?.id ?? ''
		})
		.returning()
	const exerciseEventId = defaultEvent ? defaultEvent[0]?.id : null
	if (exerciseEventId) {
		await db.insert(exerciseSets).values({
			exerciseEventId,
			exerciseTitle: formData.get('title') as string,
			sets: parseInt(formData.get('sets') as string),
			reps: parseInt(formData.get('reps') as string)
		})
		return {
			success: true,
			data: {
				title: formData.get('title'),
				sets: formData.get('sets'),
				reps: formData.get('reps')
			}
		}
	} else {
		return {
			success: true
		}
	}
}
