import { useMemo } from 'react';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { DateTime, LinkWithCopy } from '@/ui';

export default function ZipperTable({ pi }) {
	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: false,
				cell: (info) => (
					<LinkWithCopy
						title={info.getValue()}
						id={info.getValue()}
						uri='/order/details'
					/>
				),
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: false,
				cell: (info) => {
					const { order_description_uuid, order_number } =
						info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={order_description_uuid}
							uri={`/order/details/${order_number}`}
						/>
					);
				},
			},
			{
				accessorKey: 'style',
				header: 'Style',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color',
				header: 'Color',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'size',
				header: 'Size (CM/INCH)',
				enableColumnFilter: false,
				cell: (info) => info.getValue()+` ${info.row.original.size_inch?'in':'cm'}`,
			},
			{
				accessorKey: 'pi_cash_quantity',
				header: 'QTY (PCS)',
				enableColumnFilter: false,
				cell: (info) =>info.getValue(),
			},
			{
				accessorKey: 'unit_price',
				header: 'Unit Price ($)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'value',
				header: 'Value ($)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
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
		[pi]
	);

	const totalQty = pi.reduce((a, b) => a + Number(b.pi_cash_quantity), 0);
	const totalValue = pi.reduce((a, b) => a + Number(b.value), 0);

	return (
		<ReactTableTitleOnly title='Zipper Details' data={pi} columns={columns}>
			<tr className='text-sm'>
				<td colSpan='5' className='py-2 text-right'>
					Total QTY
				</td>
				<td className='pl-3 text-left font-semibold'>{totalQty}</td>

				<td className='text-right'>Total Value</td>
				<td className='pl-3 text-left font-semibold'>
					${Number(totalValue).toLocaleString()}
				</td>
			</tr>
		</ReactTableTitleOnly>
	);
}
