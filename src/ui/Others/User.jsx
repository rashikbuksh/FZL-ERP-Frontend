import { useMemo } from 'react';
import { useAuth } from '@/context/auth';
import { useNetworkState } from '@uidotdev/usehooks';

const User = ({ avatar = false }) => {
	const auth = useAuth();
	const userInfo = useMemo(() => auth?.user, [auth?.user]);
	const isOnline = useNetworkState().online;

	const userInfos = [
		{
			label: userInfo?.name,
			className: 'truncate capitalize',
		},
		{
			label: userInfo?.department,
			className: 'text-[.6rem] capitalize text-primary-content/70',
		},
	];

	return (
		<div className='relative flex flex-1 flex-shrink-0 items-center gap-2'>
			{/* <div className={cn('avatar', isOnline ? 'online' : 'offline')}>
				<div className='size-10 rounded-full'>
					<img
						className='object-cover'
						src='https://avatar.iran.liara.run/public/job/operator/male'
					/>
				</div>
			</div> */}

			<div className='flex flex-col items-start'>
				{userInfos.map(({ label, className }) => (
					<span key={className} className={className}>
						{label}
					</span>
				))}
			</div>
		</div>
	);
};

export default User;
