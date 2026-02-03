import { Suspense, useEffect, useState } from 'react';
import {
	useCommercialPI,
	useCommercialPIByOrderInfo,
	useCommercialPIByQuery,
	useCommercialPIDetailsByUUID,
	useCommercialPIEntry,
	useCommercialPThreadByOrderInfo,
} from '@/state/Commercial';
import { useAuth } from '@context/auth';
import { FormProvider } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router';
import { useAccess, useRHF } from '@/hooks';

import { DeleteModal } from '@/components/Modal';
import { Footer } from '@/components/Modal/ui';
import { ShowLocalToast } from '@/components/Toast';
import SubmitButton from '@/ui/Others/Button/SubmitButton';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import { PI_NULL, PI_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

import Header from './Header';
import Thread from './Thread';
import Zipper from './Zipper';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_all_orders')) {
		return `?is_cash=false`;
	}

	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `?is_cash=false&own_uuid=${userUUID}`;
	}

	return `?is_cash=false`;
};

export default function Index() {
	const { pi_uuid } = useParams();
	const haveAccess = useAccess('commercial__pi');
	const { user } = useAuth();
	const navigate = useNavigate();

	const { url: commercialPiEntryUrl } = useCommercialPIEntry();
	const { data: pi_details_by_uuid } = useCommercialPIDetailsByUUID(pi_uuid);

	const {
		url: commercialPiUrl,
		postData,
		updateData,
		deleteData,
	} = useCommercialPI();
	const { invalidateQuery } = useCommercialPIByQuery(
		getPath(haveAccess, user?.uuid),
		{
			enabled: !!user?.uuid,
		}
	);

	const isUpdate = pi_uuid !== undefined;

	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		useFieldArray,
		getValues,
		watch,
		setValue,
		context: form,
	} = useRHF(PI_SCHEMA, PI_NULL);

	//* dynamic fields
	const { fields: orderEntryField } = useFieldArray({
		control,
		name: 'pi_cash_entry',
	});

	const { fields: newOrderEntryField } = useFieldArray({
		control,
		name: 'new_pi_cash_entry',
	});

	const { fields: threadEntryField } = useFieldArray({
		control,
		name: 'pi_cash_entry_thread',
	});

	const { fields: newThreadEntryField } = useFieldArray({
		control,
		name: 'new_pi_cash_entry_thread',
	});

	useEffect(() => {
		if (isUpdate) {
			reset(pi_details_by_uuid);
		}
	}, [pi_details_by_uuid, isUpdate]);

	// * getting the deletable pi_cash_entry zipper
	useEffect(() => {
		if (!isUpdate) return;
		if (watch('order_info_uuids') === null) return;

		const updatedPiEntries = getValues('pi_cash_entry').map((item) => {
			if (!watch('order_info_uuids').includes(item.order_info_uuid)) {
				return {
					...item,
					isDeletable: true,
				};
			}

			return item;
		});

		setValue('pi_cash_entry', updatedPiEntries);
	}, [isUpdate, watch('order_info_uuids')]);

	// * getting the deletable pi_cash_entry thread
	useEffect(() => {
		if (!isUpdate) return;
		if (watch('thread_order_info_uuids') === null) return;

		const updatedPiEntries = getValues('pi_cash_entry_thread').map(
			(item) => {
				if (
					!watch('thread_order_info_uuids').includes(
						item.order_info_uuid
					)
				) {
					return {
						...item,
						isDeletable: true,
					};
				}

				return item;
			}
		);

		setValue('pi_cash_entry_thread', updatedPiEntries);
	}, [isUpdate, watch('thread_order_info_uuids')]);

	//* Fetch zipper entries by order info ids
	const { data: pi_cash_entry_by_order_info } = useCommercialPIByOrderInfo(
		isUpdate
			? `${watch('new_order_info_uuids')?.join(',')}`
			: `${watch('order_info_uuids')?.join(',')}`,
		watch('party_uuid'),
		watch('marketing_uuid'),
		isUpdate
			? watch('new_order_info_uuids')?.length > 0
				? ''
				: 'is_update=true'
			: ''
	);

	useEffect(() => {
		if (isUpdate) {
			if (pi_cash_entry_by_order_info?.pi_cash_entry?.length > 0) {
				setValue(
					'new_pi_cash_entry',
					pi_cash_entry_by_order_info?.pi_cash_entry
				);
			} else {
				setValue('new_pi_cash_entry', []);
			}
		} else {
			if (pi_cash_entry_by_order_info?.pi_cash_entry?.length > 0) {
				setValue(
					'pi_cash_entry',
					pi_cash_entry_by_order_info?.pi_cash_entry
				);
			} else {
				setValue('pi_cash_entry', []);
			}
		}
	}, [isUpdate, pi_cash_entry_by_order_info]);

	//* Fetch thread entries by thread order info ids
	const { data: pi_cash_entry_thread_by_order_info } =
		useCommercialPThreadByOrderInfo(
			isUpdate
				? `${watch('new_order_info_thread_uuids')?.join(',')}`
				: `${watch('thread_order_info_uuids')?.join(',')}`,
			watch('party_uuid'),
			watch('marketing_uuid'),
			isUpdate
				? watch('new_order_info_thread_uuids')?.length > 0
					? ''
					: 'is_update=true'
				: ''
		);

	useEffect(() => {
		if (isUpdate) {
			if (
				pi_cash_entry_thread_by_order_info?.pi_cash_entry_thread
					?.length > 0
			) {
				setValue(
					'new_pi_cash_entry_thread',
					pi_cash_entry_thread_by_order_info?.pi_cash_entry_thread
				);
			} else {
				setValue('new_pi_cash_entry_thread', []);
			}
		} else {
			if (
				pi_cash_entry_thread_by_order_info?.pi_cash_entry_thread
					?.length > 0
			) {
				setValue(
					'pi_cash_entry_thread',
					pi_cash_entry_thread_by_order_info?.pi_cash_entry_thread
				);
			} else {
				setValue('pi_cash_entry_thread', []);
			}
		}
	}, [isUpdate, pi_cash_entry_thread_by_order_info]);

	//* Submit
	const onSubmit = async (data) => {
		const {
			pi_cash_entry,
			pi_cash_entry_thread,
			new_pi_cash_entry,
			new_pi_cash_entry_thread,
			...rest
		} = data;

		//* Update item
		if (isUpdate) {
			const updated_order_info_uuids = JSON.stringify(
				rest?.order_info_uuids?.concat(rest?.new_order_info_uuids)
			);
			const updated_order_info_thread_uuids = JSON.stringify(
				rest?.thread_order_info_uuids?.concat(
					rest?.new_order_info_thread_uuids
				)
			);
			const commercialPiData = {
				order_info_uuids: updated_order_info_uuids,
				thread_order_info_uuids: updated_order_info_thread_uuids,
				merchandiser_uuid: rest?.merchandiser_uuid,
				factory_uuid: rest?.factory_uuid,
				bank_uuid: rest?.bank_uuid,
				validity: rest?.validity,
				payment: rest?.payment,
				remarks: rest?.remarks,
				weight: rest?.weight,
				pi_date: rest?.pi_date,
				cross_weight: rest?.cross_weight,
				is_rtgs: rest?.is_rtgs,
				updated_by: user?.uuid,
				updated_at: GetDateTime(),
				is_inch: rest?.is_inch,
			};

			//* pi entry update
			let updatedableCommercialPiEntryPromises = pi_cash_entry
				?.filter(
					(item) => item.pi_cash_quantity > 0 && !item.isDeletable
				)
				.map(async (item) => {
					if (item.uuid && item.pi_cash_quantity >= 0) {
						const updatedData = {
							pi_cash_quantity: item.pi_cash_quantity,
							is_checked: item.is_checked,
							updated_by: user?.uuid,
							updated_at: GetDateTime(),
						};

						return updateData.mutateAsync({
							url: `${commercialPiEntryUrl}/${item?.uuid}`,
							updatedData: updatedData,
							uuid: item.uuid,
							isOnCloseNeeded: false,
						});
					}
					return null;
				});

			//* pi entry delete
			let deleteableCommercialPiEntryPromises = pi_cash_entry
				?.filter((item) => item.isDeletable)
				.map(async (item) =>
					deleteData.mutateAsync({
						url: `${commercialPiEntryUrl}/${item?.uuid}`,
						isOnCloseNeeded: false,
					})
				);

			//* pi entry new
			const newPiEntryData =
				new_pi_cash_entry?.length > 0
					? [...new_pi_cash_entry]
							.filter(
								(item) => item.is_checked && item.quantity > 0
							)
							.map((item) => ({
								...item,
								uuid: nanoid(),
								is_checked: true,
								sfg_uuid: item?.sfg_uuid,
								pi_cash_quantity: item?.pi_cash_quantity,
								pi_cash_uuid: rest.uuid,
								created_at: GetDateTime(),
								remarks: item?.remarks || null,
							}))
					: [];

			const newPiEntryPromises = newPiEntryData.map((item) =>
				postData.mutateAsync({
					url: commercialPiEntryUrl,
					newData: item,
					isOnCloseNeeded: false,
				})
			);

			//* pi thread entry update
			let updatedableCommercialPiEntryThreadPromises =
				pi_cash_entry_thread
					?.filter(
						(item) => item.pi_cash_quantity > 0 && !item.isDeletable
					)
					.map(async (item) => {
						if (item.uuid && item.pi_cash_quantity >= 0) {
							const updatedData = {
								pi_cash_quantity: item.pi_cash_quantity,
								is_checked: item.is_checked,
								updated_by: user?.uuid,
								updated_at: GetDateTime(),
							};

							return updateData.mutateAsync({
								url: `${commercialPiEntryUrl}/${item?.uuid}`,
								updatedData: updatedData,
								uuid: item.uuid,
								isOnCloseNeeded: false,
							});
						}
						return null;
					});

			//* pi thread entry delete
			let deleteableCommercialPiEntryThreadPromises = pi_cash_entry_thread
				?.filter((item) => item.isDeletable)
				.map(async (item) =>
					deleteData.mutateAsync({
						url: `${commercialPiEntryUrl}/${item?.uuid}`,
						isOnCloseNeeded: false,
					})
				);

			//* pi thread entry new
			const newPiEntryThreadData =
				new_pi_cash_entry_thread?.length > 0
					? new_pi_cash_entry_thread
							?.filter(
								(item) => item.is_checked && item.quantity > 0
							)
							?.map((item) => ({
								...item,
								uuid: nanoid(),
								is_checked: true,
								pi_cash_quantity: item?.pi_cash_quantity,
								pi_cash_uuid: rest.uuid,
								created_at: GetDateTime(),
								remarks: item?.remarks || null,
							}))
					: [];

			const newPiEntryThreadPromises = newPiEntryThreadData.map((item) =>
				postData.mutateAsync({
					url: commercialPiEntryUrl,
					newData: item,
					isOnCloseNeeded: false,
				})
			);

			try {
				const commercialPiPromise = await updateData.mutateAsync({
					url: `/commercial/pi-cash/${data?.uuid}`,
					updatedData: commercialPiData,
					uuid: data.uuid,
					isOnCloseNeeded: false,
				});

				const updatedId = commercialPiPromise?.data?.[0]?.updatedId;

				await Promise.all([
					...updatedableCommercialPiEntryPromises,
					...newPiEntryPromises,
					...deleteableCommercialPiEntryPromises,
					...updatedableCommercialPiEntryThreadPromises,
					...newPiEntryThreadPromises,
					...deleteableCommercialPiEntryThreadPromises,
				])
					.then(() => reset(Object.assign({}, PI_NULL)))
					.then(() => {
						invalidateQuery();
						navigate(`/commercial/pi/${updatedId}`);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		//* Add new item
		var new_pi_uuid = nanoid();
		const created_at = GetDateTime();

		const commercialPiData = {
			...rest,
			uuid: new_pi_uuid,
			order_info_uuids: JSON.stringify(rest?.order_info_uuids),
			thread_order_info_uuids: JSON.stringify(
				rest?.thread_order_info_uuids
			),
			created_at,
			created_by: user.uuid,
			is_pi: 1,
		};

		const commercialPiEntryData =
			pi_cash_entry
				?.filter((item) => item.is_checked && item.quantity > 0)
				.map((item) => ({
					...item,
					uuid: nanoid(),
					is_checked: true,
					sfg_uuid: item?.sfg_uuid,
					pi_cash_quantity: item?.pi_cash_quantity,
					pi_cash_uuid: new_pi_uuid,
					created_at,
					remarks: item?.remarks || null,
				})) || [];

		const commercialPiThreadEntryData =
			pi_cash_entry_thread
				?.filter((item) => item.is_checked && item.quantity > 0)
				.map((item) => ({
					...item,
					uuid: nanoid(),
					is_checked: true,
					sfg_uuid: item?.sfg_uuid,
					pi_cash_quantity: item?.pi_cash_quantity,
					pi_cash_uuid: new_pi_uuid,
					created_at,
					remarks: item?.remarks || null,
				})) || [];

		if (
			commercialPiEntryData.length === 0 &&
			commercialPiThreadEntryData.length === 0
		) {
			ShowLocalToast({
				type: 'warning',
				message: 'Select Zipper or Thread Order to create a PI Entry',
			});
		} else {
			//* create new /commercial/pi
			await postData.mutateAsync({
				url: commercialPiUrl,
				newData: commercialPiData,
				isOnCloseNeeded: false,
			});

			//* create new /commercial/pi-entry
			const commercial_pi_cash_entry_promises =
				commercialPiEntryData?.map((item) =>
					postData.mutateAsync({
						url: commercialPiEntryUrl,
						newData: item,
						isOnCloseNeeded: false,
					})
				);

			//* create new /commercial/pi-entry-thread
			const commercial_pi_cash_entry_thread_promises =
				commercialPiThreadEntryData.map((item) =>
					postData.mutateAsync({
						url: commercialPiEntryUrl,
						newData: item,
						isOnCloseNeeded: false,
					})
				);

			try {
				await Promise.all([
					...commercial_pi_cash_entry_promises,
					...commercial_pi_cash_entry_thread_promises,
				])
					.then(() => reset(Object.assign({}, PI_NULL)))
					.then(() => {
						invalidateQuery();
						navigate(`/commercial/pi`);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}
		}
	};

	//* Check if order_number is valid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	return (
		<FormProvider {...form}>
			<form
				className='flex flex-col gap-4'
				onSubmit={handleSubmit(onSubmit)}
				noValidate
			>
				<Header
					{...{
						register,
						errors,
						control,
						getValues,
						Controller,
						isUpdate,
						watch,
						reset,
					}}
				/>

				{/* ZIPPER */}
				<Zipper
					{...{
						watch,
						getValues,
						control,
						errors,
						isUpdate,
						setValue,
						register,
						orderEntryField,
						newOrderEntryField,
						deleteData,
					}}
				/>

				{/* THREAD */}
				<Thread
					{...{
						watch,
						getValues,
						control,
						errors,
						isUpdate,
						setValue,
						register,
						threadEntryField,
						newThreadEntryField,
						deleteData,
					}}
				/>

				<Footer buttonClassName='!btn-primary' />
			</form>

			<Suspense>
				<DeleteModal
					modalId={'pi_cash_entry_delete'}
					title={'Order Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={orderEntryField}
					uri={`/order/entry`}
				/>
			</Suspense>
			<DevTool control={control} placement='top-left' />
		</FormProvider>
	);
}
