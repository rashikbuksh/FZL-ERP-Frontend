export default function BodyTemplate({ title, header, children }) {
	return (
		<div className='text-secondary-content rounded bg-primary'>
			<div className='mr-2 flex items-center justify-between'>
				<span className='text-primary-content flex items-center gap-4 px-4 py-3 text-lg font-semibold capitalize'>
					{title}
				</span>
				{header}
			</div>
			<div className='text-secondary-content flex flex-col gap-1.5 rounded-b border border-primary/30 bg-white p-2 pb-4'>
				{children}
			</div>
		</div>
	);
}
