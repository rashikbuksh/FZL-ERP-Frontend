import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';

import { DateTime } from '@/ui';
import { useMemo } from 'react';

export default function Index({ recipe_entry }) {
	// console.log(recipe_entry);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'material_name',
				header: 'Dyes',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'quantity',
				header: 'Quantity (Solution %)',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[recipe_entry]
	);

	return (
		<ReactTableTitleOnly
			title='Details'
			data={recipe_entry}
			columns={columns}
		/>
	);
}
