import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth';
import {
	useSliderAssemblyProduction,
	useSliderColoringProduction,
	useSliderDashboardInfo,
	useSliderDieCastingStock,
	useSliderDieCastingTransferAgainstOrder,
	useSliderDieCastingTransferAgainstStock,
	useSliderDiecastingTrxLog,
} from '@/state/Slider';
import { FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useRHF } from '@/hooks';

import { Footer } from '@/components/Modal/ui';
import TableNoData from '@/components/Table/_components/TableNoData';
import { ShowLocalToast } from '@/components/Toast';
import { DynamicField, Input } from '@/ui';

import cn from '@/lib/cn';
import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import GetDateTime from '@/util/GetDateTime';
import {
	SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_NULL,
	SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_SCHEMA,
} from '@/util/Schema';

import Header from './Header';

const getBadges = (index, getValues) => {
	const badges = [
		{
			label: 'Body',
			isActive: Number(getValues(`stocks[${index}].is_body`)) === 1,
		},
		{
			label: 'Puller',
			isActive: Number(getValues(`stocks[${index}].is_puller`)) === 1,
		},
		{
			label: 'Link',
			isActive: Number(getValues(`stocks[${index}].is_link`)) === 1,
		},
		{
			label: 'Cap',
			isActive: Number(getValues(`stocks[${index}].is_cap`)) === 1,
		},
		{
			label: 'H Bottom',
			isActive: Number(getValues(`stocks[${index}].is_h_bottom`)) === 1,
		},
		{
			label: 'U Top',
			isActive: Number(getValues(`stocks[${index}].is_u_top`)) === 1,
		},

		{
			label: 'Box Pin',
			isActive: Number(getValues(`stocks[${index}].is_box_pin`)) === 1,
		},

		{
			label: 'Two Way Pin',
			isActive:
				Number(getValues(`stocks[${index}].is_two_way_pin`)) === 1,
		},
	];

	return badges;
};

const Index = () => {
	const navigate = useNavigate();
	const r_saveBtn = useRef();
	const { user } = useAuth();
	const {
		data: stocks,
		postData,
		invalidateQuery: invalidateQueryStocks,
	} = useSliderDieCastingStock();
	const { invalidateQuery: invalidateQueryStock } =
		useSliderDieCastingTransferAgainstStock();
	const { invalidateQuery: invalidateQueryOrder } =
		useSliderDieCastingTransferAgainstOrder();
	const { invalidateQuery: invalidateQueryInfo } = useSliderDashboardInfo();
	const { invalidateQuery: invalidateColoringProdQuery } =
		useSliderColoringProduction();
	const { invalidateQuery: invalidateProdQuery } =
		useSliderAssemblyProduction();
	const { invalidateQuery: invalidateTrxLog } = useSliderDiecastingTrxLog();

	const {
		register,
		handleSubmit,
		errors,
		control,
		useFieldArray,
		getValues,
		setValue,
		Controller,
		watch,
		reset,
		context: form,
	} = useRHF(
		SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_SCHEMA,
		SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_NULL
	);

	const { fields: stockFields } = useFieldArray({
		control,
		name: 'stocks',
	});

	const onSubmit = async (data) => {
		// * ADD data
		const created_at = GetDateTime();

		const batch_entry = [...data?.stocks]
			.filter((item) => item.assigned_quantity > 0)
			.map((item) => ({
				uuid: nanoid(),
				die_casting_uuid: item.uuid,
				quantity: item.assigned_quantity,
				weight: item.assigned_weight,
				remarks: item.remarks,
				created_by: user?.uuid,
				created_at,
			}));

		if (batch_entry.length === 0) {
			ShowLocalToast({
				type: 'error',
				message: 'Select at least one item to proceed.',
			});
		} else {
			if (data.order_description_uuid) {
				let promises = [
					...batch_entry.map(
						async (item) =>
							await postData.mutateAsync({
								url: '/slider/die-casting-transaction',
								newData: {
									...item,
									stock_uuid: data.order_description_uuid,
									trx_quantity: item.quantity,
								},
								isOnCloseNeeded: false,
							})
					),
				];

				await Promise.all(promises)
					.then(() => {
						reset(
							Object.assign(
								{},
								SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_NULL
							)
						);
						invalidateQueryOrder();
						invalidateQueryInfo();
						invalidateColoringProdQuery();
						invalidateProdQuery();
						navigate(`/slider/die-casting/transfer`);
					})
					.catch((err) => console.error(err));

				return;
			}
			let promises = [
				...batch_entry.map(
					async (item) =>
						await postData.mutateAsync({
							url: '/slider/trx-against-stock',
							newData: item,
							isOnCloseNeeded: false,
						})
				),
			];

			await Promise.all(promises)
				.then(() => {
					reset(
						Object.assign(
							{},
							SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_NULL
						)
					);
					invalidateQueryStock();
					invalidateQueryStocks();
					invalidateTrxLog();
					navigate(`/slider/die-casting/transfer`);
				})
				.catch((err) => console.error(err));

			return;
		}
		return;
	};

	useEffect(() => {
		setValue(
			'stocks',
			stocks?.filter(
				(field) =>
					watch('section') === 'coloring'
						? !allowedTypes.includes(field.type) // Include if 'coloring'
						: allowedTypes.includes(field.type) // Exclude if not 'coloring'
			)
		);
	}, [stocks, watch('section')]);

	const rowClass =
		'group px-3 py-2 whitespace-nowrap text-left text-sm font-normal tracking-wide';
	const thClass =
		'group cursor-pointer select-none whitespace-nowrap bg-secondary px-3 py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300';

	const allowedTypes = ['body', 'cap', 'puller', 'link'];

	return (
		<FormProvider {...form}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className='flex flex-col gap-6'>
				<Header
					{...{
						register,
						errors,
						control,
						getValues,
						Controller,
					}}
				/>
				<DynamicField
					title={`Entry Details`}
					tableHead={
						<>
							{[
								'Name',
								'Item Name',
								'Zipper No',
								'Type',
								'End Type',
								'Puller',
								'Logo',
								'Slider Body',
								'Slider Link',
								'Stopper Type',
								'Quantity',
								'Weight (KG)',
								'Assigned QTY (PCS)',
								'Assigned Weight (KG)',
								'Remarks',
							].map((item) => {
								return (
									<th
										key={item}
										scope='col'
										className={thClass}>
										{item}
									</th>
								);
							})}{' '}
						</>
					}>
					{stockFields.length === 0 && <TableNoData colSpan={11} />}
					{/* (watch('section') === 'coloring' || watch('section') === 'assembly' && stockFields.length > 0) */}

					{stockFields.length > 0 &&
						stockFields?.map((item, index) => {
							return (
								<tr key={item.id}>
									{/*  Name */}
									<td className={cn('w-[150px]', rowClass)}>
										<span>{item.name}</span>

										<div className='mt-1 flex max-w-[200px] flex-wrap gap-1 gap-y-2'>
											{getBadges(index, getValues)
												?.filter(
													(item) => item.isActive
												)
												.map((badge) => (
													<div
														key={badge.label}
														className='badge badge-secondary badge-sm'>
														{badge.label}
													</div>
												))}
										</div>
									</td>

									{/* Item Name */}
									<td className={cn('w-24', rowClass)}>
										{item.item_name}
									</td>

									{/* Zipper Name */}
									<td className={cn('w-24', rowClass)}>
										{item.zipper_number_name}
									</td>

									{/* Tyoe Name */}
									<td className={cn('w-24', rowClass)}>
										{item.type
											.split('_') // Split the string by underscores
											.map(
												(word) =>
													word
														.charAt(0)
														.toUpperCase() +
													word.slice(1)
											) // Capitalize the first letter of each word
											.join(' ')}
									</td>

									{/* End Type */}
									<td className={cn('w-24', rowClass)}>
										{item.end_type_name}
									</td>

									{/* Puller Type */}
									<td className={cn('w-24', rowClass)}>
										{item.puller_type_name}
									</td>

									{/* Logo */}
									<td className={cn('w-24', rowClass)}>
										{item.logo_type_name}
									</td>

									{/* Slider Body Shape Name */}
									<td className={cn('w-24', rowClass)}>
										{item.slider_body_shape_name}
									</td>

									{/* Puller Link Name */}
									<td className={cn('w-24', rowClass)}>
										{item.slider_link_name}
									</td>

									{/* Stopper Type */}
									<td className={cn('w-24', rowClass)}>
										{item.stopper_type_name}
									</td>
									{/* Quantity */}
									<td className={cn('w-24', rowClass)}>
										{Number(item.quantity)}
									</td>
									{/* Weight */}
									<td className={cn('w-24', rowClass)}>
										{Number(item.weight)}
									</td>
									{/* PROVIDED QTY */}
									<td className={cn('w-24', rowClass)}>
										<Input
											label={`stocks[${index}].assigned_quantity`}
											is_title_needed='false'
											register={register}
											dynamicerror={
												errors?.[`stocks`]?.[index]
													?.assigned_quantity
											}
											onChange={(e) => {
												setValue(
													`stocks[${index}].assigned_weight`,
													(
														(Number(item.weight) /
															Number(
																item.quantity
															)) *
														Number(e.target.value)
													).toFixed(4)
												);
											}}
										/>
									</td>
									{/* PROVIDED QTY */}
									<td className={cn('w-24', rowClass)}>
										{/* <Input
										label={`stocks[${index}].assigned_weight`}
										is_title_needed='false'
										register={register}
										dynamicerror={
											errors?.[`stocks`]?.[index]
												?.assigned_weight
										}
										disabled={true}
									/> */}
										{watch(
											`stocks[${index}].assigned_weight`
										)}
									</td>
									{/* remarks */}
									<td className={cn('w-24', rowClass)}>
										<Input
											label={`stocks[${index}].remarks`}
											is_title_needed='false'
											register={register}
										/>
									</td>
								</tr>
							);
						})}
				</DynamicField>
				<Footer buttonClassName='!btn-primary' />
				<DevTool control={control} placement='top-left' />
			</form>
		</FormProvider>
	);
};

export default Index;
