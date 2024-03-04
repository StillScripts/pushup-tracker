import { redirect } from 'next/navigation'

import { signout } from '@/app/(server)/actions/login'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/utils/supabase/server'

export default async function PrivatePage() {
	const supabase = createClient()

	const { data, error } = await supabase.auth.getUser()
	if (error ?? !data?.user) {
		redirect('/')
	}

	return (
		<form>
			<p>Hello {data.user.email}</p>
			<Button formAction={signout}>Sign Out</Button>
		</form>
	)
}
