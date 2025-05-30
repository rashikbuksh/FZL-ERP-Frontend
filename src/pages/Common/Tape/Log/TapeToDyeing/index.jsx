import { useMemo, useState } from 'react';
import { useCommonTapeSFG, useCommonTapeToDyeing } from '@/state/Common';
import { useOtherOrderDescription } from '@/state/Other';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { CustomLink, DateTime, EditDelete, SimpleDatePicker } from '@/ui';

import PageInfo from '@/util/PageInfo';

import AddOrUpdate from './AddOrUpdate';

export default function Index() {
	const [date, setDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());
	const { data, deleteData, isLoading } = useCommonTapeToDyeing(
		format(date, 'yyyy-MM-dd'),
		format(toDate, 'yyyy-MM-dd')
	);
	const info = new PageInfo('Tape -> Dyeing', '/zipper/tape-coil-to-dyeing');
	const { invalidateQuery: invalidateCommonTapeSFG } = useCommonTapeSFG();

	const haveAccess = useAccess('common__coil_log');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'name',
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
				accessorKey: 'trx_quantity',
				header: (
					<span>
						Stock
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
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
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
					!haveAccess.includes('click_update_sfg') &&
					!haveAccess.includes('click_delete_sfg'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes('click_delete_sfg')}
							showUpdate={haveAccess.includes('click_update_sfg')}
						/>
					);
				},
			},
		],
		[data]
	);

	const { data: order_id } = useOtherOrderDescription();

	// Update
	const [entry, setEntry] = useState({
		uuid: null,
		trx_quantity: null,
		tape_prod: null,
		remarks: null,
	});

	const handelUpdate = (idx) => {
		setEntry((prev) => ({
			...prev,
			uuid: data[idx].uuid,
			trx_quantity: data[idx].trx_quantity,
			tape_prod: data[idx].tape_prod,
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
			itemName:
				data[idx].order_number + ' - ' + data[idx].item_description,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columns}
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
						order_id,
						entry,
						setEntry,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					deleteData={deleteData}
					invalidateQuery={invalidateCommonTapeSFG}
					url={`/zipper/tape-coil-to-dyeing`}
				/>
			</Suspense>
		</div>
	);
}
