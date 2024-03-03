'use client'

import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { z } from 'zod'

import { createExerciseSet } from '@/app/(server)/routers/exercise-sets'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

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

export const ExerciseSetForm = ({
	defaultValues
}: {
	defaultValues?: ExerciseSet
}) => {
	// @ts-expect-error - I don't know
	const [state, action] = useFormState(createExerciseSet, {})
	const form = useForm<ExerciseSet>({
		resolver: zodResolver(exerciseSetFormSchema),
		defaultValues: {
			...defaultValues,
			date: new Date()
		}
	})

	useEffect(() => {
		alert(JSON.stringify(state))
	}, [state])

	return (
		<Form {...form}>
			<form
				action={async (formData: FormData) => {
					const valid = await form.trigger()
					if (!valid) return
					// @ts-expect-error - I don't know
					return action(formData)
				}}
				className="space-y-8"
			>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
					<div className="grid grid-cols-4 items-start gap-3 sm:grid-cols-5">
						<FormField
							control={form.control}
							name={'title'}
							render={({ field }) => (
								<FormItem className="col-span-2 sm:col-span-3">
									<FormLabel>Exercise Name</FormLabel>
									<FormControl>
										<Input placeholder="Push-ups" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="col-span-2 flex items-end space-x-1 sm:space-x-2">
							<FormField
								control={form.control}
								name={'sets'}
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Sets</FormLabel>
										<FormControl>
											<Input placeholder="1" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name={'reps'}
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Reps</FormLabel>
										<FormControl>
											<Input placeholder="10" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name={'title'}
								render={({ field }) => (
									<FormItem className="hidden">
										<FormLabel>ID</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
					<FormField
						control={form.control}
						name="date"
						render={({ field }) => (
							<FormItem className="flex flex-col space-y-4">
								<FormLabel>Session Date</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={'outline'}
												className={cn(
													'w-full pl-3 text-left font-normal',
													!field.value && 'text-muted-foreground'
												)}
											>
												{field.value ? (
													format(field.value, 'PPP')
												) : (
													<span>Pick a date</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											disabled={date =>
												date > new Date() || date < new Date('1900-01-01')
											}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Button className="w-full md:w-auto">Submit</Button>
			</form>
		</Form>
	)
}

export const ExerciseSetFormCard = ({
	defaultValues
}: {
	defaultValues?: ExerciseSet
}) => (
	<Card>
		<CardHeader>
			<CardTitle>Add New Exercise</CardTitle>
			<CardDescription>Record your progress with an exercise</CardDescription>
		</CardHeader>
		<CardContent>
			<ExerciseSetForm defaultValues={defaultValues} />
		</CardContent>
	</Card>
)
