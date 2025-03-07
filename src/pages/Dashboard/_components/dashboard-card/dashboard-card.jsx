import React from 'react';
import { NumericFormat } from 'react-number-format';

import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

const DashboardCard = ({
	title,
	subtitle,
	totalValue = 0,
	pendingValue = 0,
}) => {
	return (
		<Card className='flex flex-col justify-between overflow-hidden'>
			<CardHeader className='px-3 py-2'>
				<CardDescription>{title}</CardDescription>
				<CardTitle className='text-3xl font-medium'>
					<NumericFormat
						displayType={'text'}
						prefix='US $'
						value={totalValue}
						thousandSeparator
						thousandsGroupStyle={'thousand'}
						decimalScale={2}
					/>
				</CardTitle>
			</CardHeader>

			<CardFooter className='flex items-center bg-neutral-100 px-3 py-2'>
				<CardDescription>
					{subtitle} :{' '}
					<NumericFormat
						displayType={'text'}
						prefix='$'
						value={pendingValue}
						thousandSeparator
						thousandsGroupStyle={'thousand'}
						decimalScale={2}
					/>
				</CardDescription>
			</CardFooter>
		</Card>
	);
};

export default DashboardCard;
