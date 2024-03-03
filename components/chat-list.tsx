import { ExerciseSetFormCard } from './forms/exercise-set-form'

export function ChatList({
	messages
}: {
	messages: { id: number; display: React.ReactNode }[]
}) {
	if (!messages.length) {
		return null
	}

	return (
		<div className="relative mx-auto max-w-2xl px-4">
			{messages.map((message, index) => (
				<div key={index} className="pb-4">
					{message.display}
				</div>
			))}
			<ExerciseSetFormCard />
		</div>
	)
}
