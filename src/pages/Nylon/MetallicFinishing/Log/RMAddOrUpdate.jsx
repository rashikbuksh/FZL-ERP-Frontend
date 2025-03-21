import { useAuth } from '@/context/auth';
import { useCommonMaterialUsed, useCommonTapeRM } from '@/state/Common';
import { useNylonMetallicFinishingRM } from '@/state/Nylon';
import { useOtherMaterial } from '@/state/Other';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { ShowLocalToast } from '@/components/Toast';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import {
	RM_MATERIAL_USED_EDIT_NULL,
	RM_MATERIAL_USED_EDIT_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';
import getTransactionArea from '@/util/TransactionArea';

export default function Index({
	modalId = '',
	updateFinishingRMLog = {
		uuid: null,
		section: null,
		used_quantity: null,
		n_t_cutting: null,
		n_stopper: null,
		wastage: null,
	},
	setUpdateFinishingRMLog,
}) {
	const { url, updateData } = useCommonMaterialUsed();
	const { invalidateQuery: invalidateFinishingRM } =
		useNylonMetallicFinishingRM();
	const { data: material } = useOtherMaterial();

	const MAX_QUANTITY =
		updateFinishingRMLog?.section === 'n_t_cutting'
			? Number(updateFinishingRMLog?.n_t_cutting)
			: Number(updateFinishingRMLog?.n_stopper);
	// const schema = {
	// 	...RM_MATERIAL_USED_EDIT_SCHEMA,
	// 	used_quantity:
	// 		RM_MATERIAL_USED_EDIT_SCHEMA.used_quantity.max(MAX_QUANTITY),
	// };

	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
		watch,
		context,
	} = useRHF(RM_MATERIAL_USED_EDIT_SCHEMA, RM_MATERIAL_USED_EDIT_NULL);

	useFetchForRhfReset(
		`${url}/${updateFinishingRMLog?.uuid}`,
		updateFinishingRMLog?.uuid,
		reset
	);
	let MAX_PROD =
		MAX_QUANTITY +
		Number(updateFinishingRMLog?.used_quantity) +
		(Number(updateFinishingRMLog?.wastage) - watch('wastage'));
	let MAX_WASTAGE =
		MAX_QUANTITY +
		Number(updateFinishingRMLog?.wastage) +
		(Number(updateFinishingRMLog?.used_quantity) - watch('used_quantity'));
	const onClose = () => {
		setUpdateFinishingRMLog((prev) => ({
			...prev,
			uuid: null,
			section: null,
			used_quantity: null,
			n_t_cutting: null,
			n_stopper: null,
			wastage: null,
		}));
		reset(RM_MATERIAL_USED_EDIT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		if (MAX_WASTAGE < watch('wastage')) {
			ShowLocalToast({
				type: 'error',
				message: 'Beyond Stock',
			});
			return;
		}
		// Update item
		if (updateFinishingRMLog?.uuid !== null) {
			const updatedData = {
				...data,
				material_name: updateFinishingRMLog?.material_name,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateFinishingRMLog?.uuid}`,
				uuid: updateFinishingRMLog?.uuid,
				updatedData,
				onClose,
			});
			invalidateFinishingRM();

			return;
		}
	};

	const transactionArea = getTransactionArea();

	return (
		<AddModal
			id={modalId}
			title={`Metallic Finishing RM Log of ${updateFinishingRMLog?.material_name}`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label='section' title='Section' errors={errors}>
				<Controller
					name={'section'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Section'
								options={transactionArea}
								value={transactionArea?.find(
									(item) => item.value == getValues('section')
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled='1'
							/>
						);
					}}
				/>
			</FormField>
			<JoinInput
				label='used_quantity'
				sub_label={`Max: ${MAX_PROD}`}
				unit={
					material?.find(
						(inItem) => inItem.value == getValues(`material_uuid`)
					)?.unit
				}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				sub_label={`Max: ${MAX_WASTAGE}`}
				unit={
					material?.find(
						(inItem) => inItem.value == getValues(`material_uuid`)
					)?.unit
				}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
