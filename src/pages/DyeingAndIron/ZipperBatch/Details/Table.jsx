import { useMemo } from 'react';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { DateTime } from '@/ui';

export default function Index({ batch_entry }) {
	const columns = useMemo(
		() => [
			// {
			// 	accessorKey: 'recipe_name',
			// 	header: 'Recipe Name',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'style',
				header: 'Style',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'color',
				header: 'Color',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'size',
				header: 'Size (CM)',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'order_quantity',
				header: 'Order Quantity',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'balance_quantity',
				header: 'Balanced Batch',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'quantity',
				header: 'Batch QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'given_production_quantity',
				header: 'Production QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'given_production_quantity_in_kg',
				header: 'Production QTY (Kg)',
				enableColumnFilter: false,
				cell: (info) =>info.getValue(),
			},
			{
				accessorKey: 'batch_remarks',
				header: 'Remarks',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
		],
		[batch_entry]
	);

	return (
		<ReactTableTitleOnly
			title='Details'
			data={batch_entry}
			columns={columns}
		/>
	);
}
