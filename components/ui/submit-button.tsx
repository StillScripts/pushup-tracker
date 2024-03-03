'use client'
import type { ComponentProps } from 'react'
import { useFormStatus } from 'react-dom'

import { Button } from './button'

export const SubmitButton = ({
	children,
	...props
}: ComponentProps<typeof Button>) => {
	const { pending } = useFormStatus()
	return (
		<Button {...props} disabled={pending}>
			{pending ? 'Loading...' : children}
		</Button>
	)
}
