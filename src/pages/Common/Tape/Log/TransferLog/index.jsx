import React, { useMemo, useState } from 'react';
import {
	useCommonCoilToStockLog,
	useCommonTapeSFG,
	useCommonTapeToCoil,
	useCommonTapeTransfer,
} from '@/state/Common';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { CustomLink, DateTime, EditDelete, SimpleDatePicker } from '@/ui';

import PageInfo from '@/util/PageInfo';

import AddOrUpdate from './AddOrUpdate';

export default function TapeToCoil() {
	const [date, setDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());
	const { data, isLoading, url, deleteData } = useCommonTapeTransfer(
		format(date, 'yyyy-MM-dd'),
		format(toDate, 'yyyy-MM-dd')
	);
	const info = new PageInfo('Tape -> Transfer', 'tape-to-coil-trx');
	const haveAccess = useAccess('common__tape_log');
	const { invalidateQuery: invalidateCommonTapeSFG } = useCommonTapeSFG();
	const columns = useMemo(
		() => [
			{
				accessorKey: 'tape_coil_name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'item_name',
				header: 'Item',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'order_type',
				header: 'Type',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'zipper_number_name',
				header: 'Zipper',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
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
				accessorKey: 'trx_quantity_in_meter',
				header: (
					<span>
						Quantity
						<br />
						(M)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => (info.getValue() > 0 ? info.getValue() : '---'),
			},
			{
				accessorKey: 'trx_quantity',
				header: (
					<span>
						Quantity
						<br />
						(KG)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
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
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden:
					!haveAccess.includes('click_update_transfer') &&
					!haveAccess.includes('click_delete_transfer'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes(
								'click_delete_transfer'
							)}
							showUpdate={haveAccess.includes(
								'click_update_transfer'
							)}
						/>
					);
				},
			},
		],
		[data]
	);

	// Update
	const [updateTapeLog, setUpdateTapeLog] = useState({
		uuid: null,
		type_of_zipper: null,
		tape_or_coil_stock_id: null,
		trx_quantity: null,
		stock_quantity: null,
	});

	const handelUpdate = (idx) => {
		const selected = data[idx];
		setUpdateTapeLog((prev) => ({
			...prev,
			...selected,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Delete
	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handelDelete = (idx) => {
		setDeleteItem((prev) => ({
			...prev,
			itemId: data[idx].uuid,
			itemName: data[idx].type_of_zipper,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columns}
				extraClass='py-2'
				showDateRange={false}
				extraButton={
					<div className='flex items-center gap-2'>
						<SimpleDatePicker
							className='h-[2.34rem] w-32'
							key={'Date'}
							value={date}
							placeholder='Date'
							onChange={(data) => {
								setDate(data);
							}}
							selected={date}
						/>
						<SimpleDatePicker
							className='h-[2.34rem] w-32'
							key={'toDate'}
							value={toDate}
							placeholder='To'
							onChange={(data) => {
								setToDate(data);
							}}
							selected={toDate}
						/>
					</div>
				}
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateTapeLog,
						setUpdateTapeLog,
					}}
				/>
			</Suspense>

			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					invalidateQuery={invalidateCommonTapeSFG}
					url='/zipper/dyed-tape-transaction-from-stock'
					{...{
						deleteItem,
						setDeleteItem,

						deleteData,
					}}
				/>
			</Suspense>
		</div>
	);
}
