import { useEffect } from 'react';

import PageInfo from '@/util/PageInfo';

import Thread from './Thread';
import Zipper from './Zipper';

export default function Index() {
	const info = new PageInfo(
		'Order Sheet Send & Receive',
		'/report/order-sheet-sr',
		'report__order_sheet_sr'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div className='flex flex-col gap-8'>
			<Zipper />
			<Thread />
		</div>
	);
}
