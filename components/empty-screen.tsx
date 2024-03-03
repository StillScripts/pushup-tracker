import { ExternalLink } from '@/components/external-link'
import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
	{
		heading: 'What are some popular exercises?',
		message: 'What are some popular exercises?'
	},
	{
		heading: 'Record 3 sets of 20 Push-ups',
		message: 'Record 3 sets of 20 Push-ups'
	},
	{
		heading: 'Record 2 sets of 30 Calf-raises',
		message: 'Record 2 sets of 30 Calf-raises'
	}
]

export function EmptyScreen({
	submitMessage
}: {
	submitMessage: (message: string) => void
}) {
	return (
		<div className="mx-auto max-w-2xl px-4">
			<div className="mb-4 rounded-lg border bg-background p-8">
				<h1 className="mb-2 text-lg font-semibold">
					Welcome to AI Personal Trainer!
				</h1>
				<p className="mb-2 leading-normal text-muted-foreground">
					You can get information about popular exercises and record your own
					exercise progress.
				</p>
				<p className="mb-2 leading-normal text-muted-foreground">
					The demo is built with{' '}
					<ExternalLink href="https://nextjs.org">Next.js</ExternalLink> and the{' '}
					<ExternalLink href="https://sdk.vercel.ai/docs">
						Vercel AI SDK
					</ExternalLink>
					.
				</p>
				<p className="leading-normal text-muted-foreground">Try an example:</p>
				<div className="mb-4 mt-4 flex flex-col items-start space-y-2">
					{exampleMessages.map((message, index) => (
						<Button
							key={index}
							variant="link"
							className="h-auto p-0 text-base"
							onClick={async () => {
								submitMessage(message.message)
							}}
						>
							<IconArrowRight className="mr-2 text-muted-foreground" />
							{message.heading}
						</Button>
					))}
				</div>
			</div>
			<p className="text-center text-[0.8rem] leading-normal text-muted-foreground">
				Note: This is not professional health advice.
			</p>
		</div>
	)
}
