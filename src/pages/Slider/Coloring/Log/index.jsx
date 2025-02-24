import { useEffect } from 'react';

import ProductionLog from './ProductionLog';
import RMOrderAgainstLog from './RMOrderAgainstLog';
import RMTransferLog from './RMTransferLog';
import TransactionLog from './TransactionLog';

export default function Index() {
	useEffect(() => {
		document.title = 'Coloring Log';
	}, []);
	return (
		<div>
			<ProductionLog />
			<hr className='border-2 border-dashed border-secondary-content' />
			<TransactionLog />
			<hr className='border-2 border-dashed border-secondary-content' />
			<RMTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			{/* <RMOrderAgainstLog /> */}
		</div>
	);
}
