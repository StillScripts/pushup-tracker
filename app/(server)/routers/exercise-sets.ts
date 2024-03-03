// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createExerciseSet = async (state: any, formData: FormData) => {
	return {
		success: true,
		data: {
			title: formData.get('title'),
			sets: formData.get('sets'),
			reps: formData.get('reps')
		}
	}
}
