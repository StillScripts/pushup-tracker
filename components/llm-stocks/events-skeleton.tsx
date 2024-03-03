export const EventsSkeleton = () => {
	return (
		<div className="-mt-2 flex flex-col gap-2 overflow-scroll py-4 sm:flex-row">
			<div className="flex max-w-96 flex-shrink-0 flex-col rounded-md bg-zinc-900 p-4">
				<div className="mb-1 w-fit rounded-md bg-zinc-700 text-sm text-transparent">
					{'xxxxx'}
				</div>
				<div className="mb-1 w-fit rounded-md bg-zinc-700 text-transparent">
					{'xxxxxxxxxxx'}
				</div>
				<div className="h-[42px] w-auto rounded-md bg-zinc-700 text-transparent sm:w-[352px]"></div>
			</div>
		</div>
	)
}
