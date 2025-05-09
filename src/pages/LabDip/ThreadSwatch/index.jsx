import { useMemo, useState } from 'react';
import { useOtherShadeRecipe } from '@/state/Other';
import { useThreadSwatch } from '@/state/Thread';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import {
	DateTime,
	LinkWithCopy,
	ReactSelect,
	StatusButton,
	StatusSelect,
} from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

export default function Index() {
	const [status, setStatus] = useState('pending');
	const [status2, setStatus2] = useState('incomplete_order');
	const options = [
		{ value: 'all', label: 'All' },
		{ value: 'pending', label: 'Pending' },
		{ value: 'completed', label: 'Completed' },
	];

	const options2 = [
		{ value: 'complete_order', label: 'Complete Order' },
		{ value: 'incomplete_order', label: 'Incomplete Order' },
	];

	const { data, updateData, isLoading } = useThreadSwatch(
		status2 === 'complete_order'
			? `order_type=${status2}`
			: `type=${status}&order_type=${status2}`
	);
	const info = new PageInfo(
		'LabDip/Thread Swatch',
		'order/swatch',
		'lab_dip__thread_swatch'
	);
	const haveAccess = useAccess('lab_dip__thread_swatch');

	// * fetching the data
	const { data: shade_recipe } = useOtherShadeRecipe();

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={uuid}
							uri='/thread/order-info'
						/>
					);
				},
			},

			{
				accessorKey: 'style',
				header: 'Style',
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color',
				header: 'Color',
				width: 'w-24',
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'count_length_name',
				header: 'Count Length',
				width: 'w-24',

				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: 'po',
			// 	header: 'PO',
			// 	width: 'w-40',

			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'bleaching',
				header: 'Bleaching',
				width: 'w-16',

				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'order_quantity',
				header: (
					<span>
						Quantity
						<br />
						(Cone)
					</span>
				),
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => {
					const { is_batch_created } = row;
					if (is_batch_created) {
						return 'Yes';
					}
					if (!is_batch_created) {
						return 'No';
					}
				},
				id: 'is_dyeing_batch_entry',
				header: 'Dyeing Batch Created',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton
						className={'btn-xs'}
						value={info.row.original.is_batch_created}
					/>
				),
			},
			{
				accessorKey: 'recipe_name',
				header: 'Swatch Status',
				width: 'min-w-60',
				enableColumnFilter: false,
				cell: (info) => {
					const { recipe_uuid, bleaching } = info.row.original;
					const { uuid } = info.row.original;

					const swatchAccess = haveAccess.includes(
						'click_swatch_status'
					);
					const swatchAccessOverride = haveAccess.includes(
						'click_swatch_status_override'
					);

					return (
						<ReactSelect
							className={'input-xs'}
							key={recipe_uuid}
							placeholder='Select order info uuid'
							options={
								shade_recipe?.filter(
									(item) =>
										(item.bleaching == bleaching &&
											item.thread_order_info_uuid ===
												uuid) ||
										item.label === '---'
								) ?? []
							}
							value={shade_recipe?.filter(
								(item) => item.value == recipe_uuid
							)}
							onChange={(e) =>
								handleSwatchStatus(e, info.row.index)
							}
							isDisabled={
								swatchAccessOverride
									? false
									: recipe_uuid === null && swatchAccess
										? false
										: true
							}
							menuPortalTarget={document.body}
						/>
					);
				},
			},
			{
				accessorFn: (row) => {
					if (row.swatch_approval_date === null) return '---';

					return format(row.swatch_approval_date, 'dd/MM/yyyy');
				},
				id: 'swatch_approval_date',
				header: (
					<span>
						Approval <br />
						Date
					</span>
				),
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime date={info.row.original.swatch_approval_date} />
				),
			},
		],
		[data, shade_recipe, haveAccess]
	);

	const handleSwatchStatus = async (e, idx) => {
		await updateData.mutateAsync({
			url: `/thread/order-entry/${data[idx]?.order_entry_uuid}`,
			updatedData: {
				recipe_uuid: e.value,
				swatch_approval_date: GetDateTime(),
			},
			isOnCloseNeeded: false,
		});
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columns}
				extraButton={
					<>
						{status2 === 'incomplete_order' && (
							<StatusSelect
								options={options}
								status={status}
								setStatus={setStatus}
							/>
						)}
						<StatusSelect
							options={options2}
							status={status2}
							setStatus={setStatus2}
						/>
					</>
				}
			/>
		</div>
	);
}
