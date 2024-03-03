/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createAI, createStreamableUI, getMutableAIState } from 'ai/rsc'
import OpenAI from 'openai'
import { z } from 'zod'

import { exerciseSetFormSchema } from '@/app/(server)/routers/exercise-sets'
import { ExerciseSetFormCard } from '@/components/forms/exercise-set-form'
import {
	BotCard,
	BotMessage,
	spinner,
	SystemMessage
} from '@/components/llm-stocks'
import { StocksSkeleton } from '@/components/llm-stocks/stocks-skeleton'
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import {
	formatNumber,
	runAsyncFnWithoutBlocking,
	runOpenAICompletion,
	sleep
} from '@/lib/utils'

import 'server-only'

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY ?? ''
})

async function confirmPurchase(symbol: string, price: number, amount: number) {
	'use server'

	const aiState = getMutableAIState<typeof AI>()

	const purchasing = createStreamableUI(
		<div className="inline-flex items-start gap-1 md:items-center">
			{spinner}
			<p className="mb-2">
				Purchasing {amount} ${symbol}...
			</p>
		</div>
	)

	const systemMessage = createStreamableUI(null)

	runAsyncFnWithoutBlocking(async () => {
		// You can update the UI at any point.
		await sleep(1000)

		purchasing.update(
			<div className="inline-flex items-start gap-1 md:items-center">
				{spinner}
				<p className="mb-2">
					Purchasing {amount} ${symbol}... working on it...
				</p>
			</div>
		)

		await sleep(1000)

		purchasing.done(
			<div>
				<p className="mb-2">
					You have successfully purchased {amount} ${symbol}. Total cost:{' '}
					{formatNumber(amount * price)}
				</p>
			</div>
		)

		systemMessage.done(
			<SystemMessage>
				You have purchased {amount} shares of {symbol} at ${price}. Total cost ={' '}
				{formatNumber(amount * price)}.
			</SystemMessage>
		)

		aiState.done([
			...aiState.get(),
			{
				role: 'system',
				content: `[User has purchased ${amount} shares of ${symbol} at ${price}. Total cost = ${
					amount * price
				}]`
			}
		])
	})

	return {
		purchasingUI: purchasing.value,
		newMessage: {
			id: Date.now(),
			display: systemMessage.value
		}
	}
}

async function submitUserMessage(content: string) {
	'use server'

	const aiState = getMutableAIState<typeof AI>()
	aiState.update([
		...aiState.get(),
		{
			role: 'user',
			content
		}
	])

	const reply = createStreamableUI(
		<BotMessage className="items-center">{spinner}</BotMessage>
	)

	const completion = runOpenAICompletion(openai, {
		model: 'gpt-3.5-turbo',
		stream: true,
		messages: [
			{
				role: 'system',
				content: `\
				You are a personal trainer. People may ask you for recommendations about certain physical exercises. 
				They might also record exercise sessions, for example, I did 3 sets of push-ups and 15 reps in each set.
				If you want to list exercises, call \`list_exercises\`.
				If you want to record an exercise session, call \`record_exercise_set\`.
`
			},
			...aiState.get().map((info: any) => ({
				role: info.role,
				content: info.content,
				name: info.name
			}))
		],
		functions: [
			{
				name: 'list_exercises',
				description:
					'List three popular exercises that are helpful for building strength, fitness, or other physical attributes that the user wants to improve.',
				parameters: z.object({
					exercises: z.array(
						z.object({
							name: z.string().describe('The name of the exercise'),
							description: z
								.string()
								.describe(
									'A brief summary of the exercise and body parts involved'
								)
						})
					)
				})
			},
			{
				name: 'record_exercise_set',
				description:
					'Record the title of an exercise, and the number of sets and reps a user has done of that exercise. The date should default to today if it is not specified. If they do not specific the number of sets, then default to 1',
				parameters: z.object({
					exerciseSet: exerciseSetFormSchema
				})
			},
			{
				name: 'get_events',
				description:
					'List funny imaginary events between user highlighted dates that describe stock activity.',
				parameters: z.object({
					events: z.array(
						z.object({
							date: z
								.string()
								.describe('The date of the event, in ISO-8601 format'),
							headline: z.string().describe('The headline of the event'),
							description: z.string().describe('The description of the event')
						})
					)
				})
			}
		],
		temperature: 0
	})

	completion.onTextContent((content: string, isFinal: boolean) => {
		reply.update(<BotMessage>{content}</BotMessage>)
		if (isFinal) {
			reply.done()
			aiState.done([...aiState.get(), { role: 'assistant', content }])
		}
	})

	completion.onFunctionCall('record_exercise_set', async ({ exerciseSet }) => {
		reply.update(
			<BotCard>
				<StocksSkeleton />
			</BotCard>
		)

		await sleep(1000)

		reply.done(
			<BotCard>
				<ExerciseSetFormCard defaultValues={exerciseSet} />
			</BotCard>
		)

		aiState.done([
			...aiState.get(),
			{
				role: 'function',
				name: 'record_exercise_set',
				content: JSON.stringify(exerciseSet)
			}
		])
	})

	completion.onFunctionCall(
		'list_exercises',
		async ({
			exercises
		}: {
			exercises: { name: string; description: string }[]
		}) => {
			reply.update(
				<BotCard>
					<StocksSkeleton />
				</BotCard>
			)

			await sleep(1000)

			reply.done(
				<BotCard>
					<div className="flex flex-wrap gap-4 ">
						{exercises.map(exercise => (
							<Card key={exercise.name} className="w-full max-w-[360px]">
								<CardHeader>
									<CardTitle>{exercise.name}</CardTitle>
									<CardDescription>{exercise.description}</CardDescription>
								</CardHeader>
							</Card>
						))}
					</div>
				</BotCard>
			)

			aiState.done([
				...aiState.get(),
				{
					role: 'function',
					name: 'list_exercises',
					content: JSON.stringify(exercises)
				}
			])
		}
	)

	return {
		id: Date.now(),
		display: reply.value
	}
}

// Define necessary types and create the AI.

const initialAIState: {
	role: 'user' | 'assistant' | 'system' | 'function'
	content: string
	id?: string
	name?: string
}[] = []

const initialUIState: {
	id: number
	display: React.ReactNode
}[] = []

export const AI = createAI({
	actions: {
		submitUserMessage,
		confirmPurchase
	},
	initialUIState,
	initialAIState
})
