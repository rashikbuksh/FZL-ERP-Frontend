import { lazy, useMemo, useState } from 'react';
import { useMetalTCProduction } from '@/state/Metal';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { CustomLink, LinkWithCopy, StatusButton, Transfer } from '@/ui';

import PageInfo from '@/util/PageInfo';

const Production = lazy(() => import('./Production'));
const Transaction = lazy(() => import('./Transaction'));

export default function Index() {
	const { data, isLoading } = useMetalTCProduction();
	const info = new PageInfo(
		'Teeth Coloring Production',
		'sfg/by/teeth_coloring_prod/by/metal',
		'metal__teeth_coloring_production'
	);
	const haveAccess = useAccess('metal__teeth_coloring_production');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'batch_number',
				header: 'Batch No.',
				enableColumnFilter: true,
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/planning/finishing-batch/${info.row.original.finishing_batch_uuid}`}
						openInNewTab={true}
					/>
				),
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/order/details/${info.getValue()}`}
						openInNewTab={true}
					/>
				),
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: true,
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/order/details/${info.row.original.order_number}/${info.row.original.order_description_uuid}`}
						openInNewTab={true}
					/>
				),
			},
			{
				accessorKey: 'tape',
				header: 'Tape',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: 'slider',
			// 	header: 'Slider',
			// 	enableColumnFilter: false,
			// 	width: 'w-32',
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'order_type',
				header: 'Type',
				enableColumnFilter: true,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: true,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'is_waterproof',
				header: 'Waterproof',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => (
					<StatusButton size='btn-sm' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'style',
				header: 'Style',
				width: 'w-32',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'color',
				header: 'Color',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'color_ref',
				header: 'Color Ref',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'size',
				header: 'Size',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'batch_quantity',
				header: <span>Batch QTY</span>,
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'teeth_coloring_stock',
				header: 'Teeth Coloring Stock',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'balance_quantity',
				header: <span>Balance (PCS)</span>,
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'actions_add_production',
				header: 'Add Production',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_production'),
				cell: (info) => {
					const { balance_quantity, teeth_coloring_stock } =
						info.row.original;
					return (
						<Transfer
							onClick={() => handelProduction(info.row.index)}
							disabled={
								Math.min(
									Number(balance_quantity),
									Number(teeth_coloring_stock)
								) <= 0
									? true
									: false
							}
						/>
					);
				},
			},
			{
				accessorKey: 'total_production_quantity',
				header: (
					<span>
						Total Production
						<br />
						(PCS)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: 'actions_add_transaction',
			// 	header: 'Trx Transaction',
			// 	enableColumnFilter: false,
			// 	enableSorting: false,
			// 	hidden: !haveAccess.includes('click_transaction'),
			// 	cell: (info) => (
			// 		<Transfer
			// 			onClick={() => handelTransaction(info.row.index)}
			// 		/>
			// 	),
			// },
			// {
			// 	accessorKey: 'total_trx_quantity',
			// 	header: (
			// 		<span>
			// 			Total Transaction
			// 			<br />
			// 			(PCS)
			// 		</span>
			// 	),
			// 	enableColumnFilter: false,
			// 	cell: (info) => Number(info.getValue()),
			// },
		],
		[data]
	);

	const [updateTeethColoringProd, setUpdateTeethColoringProd] = useState({
		sfg_uuid: null,
		order_number: null,
		item_description: null,
		style_color_size: null,
		order_quantity: null,
		balance_quantity: null,
		teeth_coloring_prod: null,
		teeth_coloring_stock: null,
		total_trx_quantity: null,
		metal_teeth_coloring: null,
	});
	const handelProduction = (idx) => {
		const val = data[idx];
		setUpdateTeethColoringProd((prev) => ({
			...prev,
			...val,
		}));

		window['TeethColoringProdModal'].showModal();
	};

	const [updateTeethColoringTRX, setUpdateTeethColoringTRX] = useState({
		uuid: null,
		sfg_uuid: null,
		trx_quantity_in_kg: null,
		trx_quantity_in: null,
		trx_from: null,
		trx_to: null,
		remarks: '',
	});
	const handelTransaction = (idx) => {
		const val = data[idx];
		setUpdateTeethColoringTRX((prev) => ({
			...prev,
			...val,
		}));

		window['TeethColoringTrxModal'].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
			<ReactTable title={info.getTitle()} data={data} columns={columns} />
			<Suspense>
				<Production
					modalId='TeethColoringProdModal'
					{...{
						updateTeethColoringProd,
						setUpdateTeethColoringProd,
					}}
				/>
			</Suspense>
			<Suspense>
				<Transaction
					modalId='TeethColoringTrxModal'
					{...{
						updateTeethColoringTRX,
						setUpdateTeethColoringTRX,
					}}
				/>
			</Suspense>
		</div>
	);
}
