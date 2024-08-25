import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { useAccess } from '@/hooks';
import { useSliderDashboardInfo } from '@/state/Slider';

import { DateTime, EditDelete } from '@/ui';
import PageContainer from '@/ui/Others/PageContainer';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));

export default function Index() {
	const { data, isLoading, url, deleteData } = useSliderDashboardInfo();
	const info = new PageInfo('Info', url, 'slider__dashboard_info');
	const haveAccess = useAccess('slider__dashboard_info');

	const breadcrumbs = [
		{
			label: 'Slider',
			isDisabled: true,
		},
		{
			label: 'Dashboard',
			isDisabled: true,
		},
		{
			label: 'Info',
			href: '/slider/dashboard/info',
		},
	];

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'item_name',
				header: 'Item',
				enableColumnFilter: false,
				cell: (info) => {
					const { is_logo_puller, is_logo_body } =
						info?.row?.original;

					const renderBadges = () => {
						const badges = [
							{
								label: 'Logo Body',
								isActive: is_logo_body === 1,
							},
							{
								label: 'Logo Puller',
								isActive: is_logo_puller === 1,
							},
						];

						return badges;
					};

					return (
						<div>
							<span>{info.getValue()}</span>

							{renderBadges().length > 0 && (
								<div className='mt-1 flex w-max max-w-[200px] flex-wrap gap-2'>
									{renderBadges()
										.filter((b) => b.isActive)
										.map((e) => (
											<div
												key={e.label}
												className='badge badge-secondary badge-sm'>
												{e.label}
											</div>
										))}
								</div>
							)}
						</div>
					);
				},
			},
			{
				accessorKey: 'zipper_number_name',
				header: 'Zipper Number',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'end_type_name',
				header: 'End Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: 'end_type_short_name',
			// 	header: 'End Type Short',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'lock_type_name',
				header: 'Lock Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: 'lock_type_short_name',
			// 	header: 'Lock Type Short',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'puller_type_name',
				header: 'Puller Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'puller_color_name',
				header: 'Puller Color',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'puller_link_name',
				header: 'Puller Link',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'slider_name',
				header: 'Slider',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'slider_body_shape_name',
				header: 'Slider Body Shape',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'slider_link_name',
				header: 'Slider Link',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'coloring_type_name',
				header: 'Coloring Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'logo_type_name',
				header: 'Logo Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'order_quantity',
				header: 'Order Quantity',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()).toFixed(0),
			},
			{
				accessorKey: 'body_quantity',
				header: 'Body Quantity',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()).toFixed(0),
			},
			{
				accessorKey: 'cap_quantity',
				header: 'Cap Quantity',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()).toFixed(0),
			},
			{
				accessorKey: 'puller_quantity',
				header: 'Puller Quantity',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()).toFixed(0),
			},
			{
				accessorKey: 'link_quantity',
				header: 'Link Quantity',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()).toFixed(0),
			},
			{
				accessorKey: 'sa_prod',
				header: 'SA Prod',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()).toFixed(0),
			},
			{
				accessorKey: 'coloring_stock',
				header: 'Coloring Stock',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()).toFixed(0),
			},
			{
				accessorKey: 'coloring_prod',
				header: 'Coloring Prod',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()).toFixed(0),
			},
			{
				accessorKey: 'trx_to_finishing',
				header: 'Trx To Finishing',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()).toFixed(0),
			},
			{
				accessorKey: 'u_top_quantity',
				header: 'U Top Quantity',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()).toFixed(0),
			},
			{
				accessorKey: 'h_bottom_quantity',
				header: 'H Bottom Quantity',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()).toFixed(0),
			},
			{
				accessorKey: 'box_pin_quantity',
				header: 'Box Pin Quantity',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()).toFixed(0),
			},
			{
				accessorKey: 'two_way_pin_quantity',
				header: 'Two Way Pin Quantity',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()).toFixed(0),
			},

			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created At',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},

			{
				accessorKey: 'action',
				header: 'Action',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('update'),
				cell: (info) => {
					const uuid = info.row.original?.uuid;
					return (
						<EditDelete
							handelUpdate={() => handelUpdate(uuid)}
							handelDelete={() => handelDelete(info.row.id)}
							showDelete={haveAccess.includes('delete')}
						/>
					);
				},
			},
		],
		[data]
	);

	// Update
	const [updateInfo, setUpdateInfo] = useState({
		uuid: null,
	});

	// Update
	const handelUpdate = (uuid) => {
		setUpdateInfo((prev) => ({
			...prev,
			uuid,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
	};

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handelDelete = (idx) => {
		setDeleteItem((prev) => ({
			...prev,
			itemId: data[idx].uuid,
			itemName: data[idx].item_name.replace(/ /g, '_'),
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<PageContainer title='Info Lists' breadcrumbs={breadcrumbs}>
			<ReactTable
				title={info.getTitle()}
				accessor={false}
				data={data}
				columns={columns}
				extraClass={'py-0.5'}
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateInfo,
						setUpdateInfo,
					}}
				/>
			</Suspense>

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
		</PageContainer>
	);
}