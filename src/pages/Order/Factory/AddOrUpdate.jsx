import { useAuth } from '@/context/auth';
import { useOrderFactory } from '@/state/Order';
import { useOtherFactoryByPartyUUID, useOtherParty } from '@/state/Other';
import { useFetchForRhfReset, useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, ReactSelect, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { FACTORY_NULL, FACTORY_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateFactory = {
		uuid: null,
	},
	setUpdateFactory,
}) {
	const { url, updateData, postData } = useOrderFactory();
	const { invalidateQuery: invalidateFactoryByPartyUUID } =
		useOtherFactoryByPartyUUID();
	const {
		register,
		handleSubmit,
		errors,
		reset,
		Controller,
		control,
		getValues,
		context,
	} = useRHF(FACTORY_SCHEMA, FACTORY_NULL);

	const { data: party } = useOtherParty();

	const { user } = useAuth();
	useFetchForRhfReset(
		`/public/factory/${updateFactory?.uuid}`,
		updateFactory?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateFactory((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(FACTORY_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		let party_name = party.find(
			(item) => item.value === data.party_uuid
		).label;
		// Update item
		if (updateFactory?.uuid !== null && updateFactory?.uuid !== undefined) {
			const updatedData = {
				...data,
				party_name: party_name,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateFactory?.uuid}`,
				uuid: updateFactory?.uuid,
				updatedData,
				onClose,
			});

			return;
		}

		// Add item
		const updatedData = {
			...data,
			uuid: nanoid(),
			party_name: party_name,
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});
		invalidateFactoryByPartyUUID();
	};

	return (
		<AddModal
			id={modalId}
			title={updateFactory?.uuid !== null ? 'Update Factory' : 'Factory'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label='party_uuid' title='Party' errors={errors}>
				<Controller
					name={'party_uuid'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Party'
								options={party}
								value={party?.filter(
									(item) =>
										item.value === getValues('party_uuid')
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
							/>
						);
					}}
				/>
			</FormField>
			<Input label='name' {...{ register, errors }} />
			<Input label='phone' {...{ register, errors }} />
			<Textarea label='address' rows={2} {...{ register, errors }} />
			<Textarea label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
