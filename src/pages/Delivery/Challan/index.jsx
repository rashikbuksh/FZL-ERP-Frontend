import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useDeliveryChallan } from '@/state/Delivery';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import {
	DateTime,
	EditDelete,
	LinkOnly,
	LinkWithCopy,
	StatusButton,
} from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const navigate = useNavigate();
	const { data, isLoading, url, deleteData, updateData } =
		useDeliveryChallan();
	const info = new PageInfo('Challan', url, 'delivery__challan');
	const haveAccess = useAccess('delivery__challan');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'is_hand_delivery',
				header: (
					<span>
						Hand <br />
						Del.
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton size='btn-sm' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'gate_pass',
				header: (
					<span>
						Gate <br />
						Pass
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<StatusButton
							size='btn-sm'
							value={Number(info.getValue()) === 1}
						/>
					);
				},
			},
			{
				accessorKey: 'receive_status',
				header: 'Received',
				enableColumnFilter: false,
				cell: (info) => {
					const { gate_pass, receive_status } = info.row.original;

					const access = haveAccess.includes('click_receive_status');
					const overrideAccess = haveAccess.includes(
						'click_receive_status_override'
					);
					let permission = false;
					if (gate_pass) {
						if (!receive_status && access) permission = true;
						if (overrideAccess) permission = true;
					}

					return (
						<SwitchToggle
							checked={Number(info.getValue()) === 1}
							onChange={() => handelReceiveStatus(info.row.index)}
							disabled={!permission}
						/>
					);
				},
			},
			{
				accessorFn: (row) => format(row.delivery_date, 'dd/MM/yy'),
				id: 'delivery_date',
				header: 'Delivered On',
				enableColumnFilter: true,
				width: 'w-32',
				cell: (info) => {
					const { delivery_date } = info.row.original;
					return (
						<LinkOnly
							title={
								<DateTime date={delivery_date} isTime={false} />
							}
							id={format(new Date(delivery_date), 'yyyy-MM-dd')}
							uri='/delivery/challan-by-date'
						/>
					);
				},
			},
			{
				accessorKey: 'challan_number',
				header: 'ID',
				width: 'w-40',
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={uuid}
							uri='/delivery/challan'
						/>
					);
				},
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				width: 'w-40',
				cell: (info) => {
					const { order_info_uuid, item_for } = info.row.original;

					if (item_for === 'thread' || item_for === 'sample_thread') {
						return (
							<LinkWithCopy
								title={info.getValue()}
								id={order_info_uuid}
								uri='/thread/order-info'
							/>
						);
					}
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={info.getValue()}
							uri='/order/details'
						/>
					);
				},
			},
			{
				//* joining packing list numbers
				accessorFn: (row) =>
					row.packing_list_numbers
						.map((item) => item.packing_number)
						.join(', '),
				id: 'packing_list_numbers',
				header: 'Packing List',
				width: 'w-28',
				enableColumnFilter: false,
				cell: (info) => {
					const { packing_list_numbers } = info.row.original;

					return packing_list_numbers?.map((packingList) => {
						if (packingList === 'PL-') return '-';
						return (
							<LinkWithCopy
								key={packingList.packing_number}
								title={packingList.packing_number}
								id={packingList.packing_list_uuid}
								uri='/delivery/packing-list'
							/>
						);
					});
				},
			},

			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_carton_quantity',
				header: 'Carton QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_poly_quantity',
				header: 'Poly QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_quantity',
				header: 'Total QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'vehicle_name',
				header: 'Assign To',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'delivery_cost',
				header: 'Cost',
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
				header: 'Created At',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
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
					!haveAccess.includes('update') &&
					!haveAccess.includes('delete'),
				width: 'w-24',
				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelUpdate={handelUpdate}
						handelDelete={handelDelete}
						showDelete={haveAccess.includes('delete')}
						showUpdate={haveAccess.includes('update')}
					/>
				),
			},
		],
		[data]
	);

	// Receive Status
	const handelReceiveStatus = async (idx) => {
		const challan = data[idx];
		const status = challan?.receive_status == 1 ? 0 : 1;
		const updated_at = GetDateTime();

		await updateData.mutateAsync({
			url: `/delivery/challan/update-receive-status/${challan?.uuid}`,
			uuid: challan?.uuid,
			updatedData: { receive_status: status, updated_at },
			isOnCloseNeeded: false,
		});
	};

	// Gate Pass
	const handelGatePass = async (idx) => {
		const challan = data[idx];
		const status = challan?.gate_pass == 1 ? 0 : 1;
		const updated_at = GetDateTime();

		await updateData.mutateAsync({
			url: `/delivery/challan/${challan?.uuid}`,
			uuid: challan?.uuid,
			updatedData: { gate_pass: status, updated_at },
			isOnCloseNeeded: false,
		});
	};

	const handelAdd = () => navigate('/delivery/challan/entry');

	const handelUpdate = (idx) => {
		const uuid = data[idx]?.uuid;
		navigate(`/delivery/challan/${uuid}/update`);
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
			itemName: data[idx].name,
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
				accessor={haveAccess.includes('create')}
				handelAdd={handelAdd}
			/>

			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					{...{
						deleteItem,
						setDeleteItem,
						url,
						deleteData,
					}}
				/>
			</Suspense>
		</div>
	);
}
