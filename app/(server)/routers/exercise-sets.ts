import { sleep } from '@/lib/utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createExerciseSet = async (state: any, formData: FormData) => {
	await sleep(1000)
	return {
		success: true,
		data: {
			title: formData.get('title'),
			sets: formData.get('sets'),
			reps: formData.get('reps')
		}
	}
}
