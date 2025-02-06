import { sidebarRoutes } from '@/routes';
import { NavLink } from 'react-router-dom';

import cn from '@/lib/cn';
import { HOSTED_SERVER } from '@/lib/secret';

const isProduction = process.env.NODE_ENV === 'production';

const BrandLogo = ({ className, ...props }) => {
	const route = sidebarRoutes[0];

	return (
		<NavLink
			className={cn(
				'flex items-center justify-center text-2xl font-bold text-primary-content md:text-4xl',
				className
			)}
			to={route?.path}
			{...props}
		>
			FZL
			{!isProduction ? (
				<span className='text-error'>({HOSTED_SERVER})</span>
			) : (
				''
			)}
		</NavLink>
	);
};

export default BrandLogo;
