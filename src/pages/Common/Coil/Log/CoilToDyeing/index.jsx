import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { useAccess, useFetch } from '@/hooks';
import { useCommonCoilSFG, useCommonCoilToDyeing } from '@/state/Common';
import { DateTime, EditDelete } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { useMemo, useState } from 'react';
import AddOrUpdate from './AddOrUpdate';

export default function Index() {
	const { data, deleteData, isLoading } = useCommonCoilToDyeing();
	const info = new PageInfo('Coil -> Dyeing', '/zipper/tape-coil-to-dyeing');
	const { invalidateQuery: invalidateCommonCoilSFG } = useCommonCoilSFG();
	console.log(data);

	const haveAccess = useAccess('common__coil_log');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
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
				cell: (info) => Number(info.getValue()),
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
	console.log({
		data,
	});

	const [entryUUID, setEntryUUID] = useState({
		uuid: null,
		max_trf_qty: null,
	});

	const handelUpdate = (idx) => {
		setEntryUUID((prev) => ({
			...prev,
			uuid: data[idx]?.uuid,
			max_trf_qty: data[idx]?.max_trf_qty,
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
	invalidateCommonCoilSFG();

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable title={info.getTitle()} data={data} columns={columns} />
			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						entryUUID,
						setEntryUUID,
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
					url={`/zipper/tape-coil-to-dyeing`}
				/>
			</Suspense>
		</div>
	);
}
