import { login, signup } from '@/app/(server)/actions/login'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
	return (
		<form>
			<Card className="mx-auto mt-16 max-w-[320px]">
				<CardHeader>
					<CardTitle>Sign In</CardTitle>
				</CardHeader>
				<CardContent>
					<Label className="mt-4" htmlFor="email">
						Email:
					</Label>
					<Input id="email" name="email" type="email" required />
					<Label className="mt-4" htmlFor="password">
						Password:
					</Label>
					<Input id="password" name="password" type="password" required />
				</CardContent>
				<CardFooter className="gap-4">
					<Button formAction={login}>Log in</Button>
					<Button formAction={signup}>Sign up</Button>
				</CardFooter>
			</Card>
		</form>
	)
}
