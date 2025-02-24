import { useAuth } from '@/context/auth';
import {
	useCommonCoilProduction,
	useCommonCoilSFG,
	useCommonTapeAssign,
} from '@/state/Common';
import { useOtherTapeCoil } from '@/state/Other';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { ShowLocalToast } from '@/components/Toast';
import { Input, JoinInput } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	COIL_PROD_NULL,
	COIL_PROD_SCHEMA,
	NUMBER_DOUBLE_REQUIRED,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateCoilProd = {
		uuid: null,
		item_name: null,
		production_quantity: null,
		zipper_number: null,
		type_of_zipper: null,
		tape_or_coil_stock_id: null,
	},
	setUpdateCoilProd,
}) {
	const { user } = useAuth();
	const { postData } = useCommonCoilSFG();
	const { invalidateQuery: invalidateCommonCoilProduction } =
		useCommonCoilProduction();

	const { invalidateQuery: invalidateOtherTapeCoil } = useOtherTapeCoil();

	const MAX_PRODUCTION_QTY = updateCoilProd?.trx_quantity_in_coil;

	const schema = {
		...COIL_PROD_SCHEMA,
		production_quantity: NUMBER_DOUBLE_REQUIRED.moreThan(
			0,
			'Must be greater than 0'
		),
		wastage: NUMBER_DOUBLE_REQUIRED.min(0, 'Can not be negative'),
	};

	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		schema,
		COIL_PROD_NULL
	);

	const MAX_WASTAGE = MAX_PRODUCTION_QTY - watch('production_quantity');

	const onClose = () => {
		setUpdateCoilProd((prev) => ({
			...prev,
			uuid: null,
			item_name: null,
			production_quantity: null,
			zipper_number: null,
			type_of_zipper: null,
			tape_or_coil_stock_id: null,
		}));
		reset(COIL_PROD_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// if (MAX_WASTAGE < watch('wastage')) {
		// 	ShowLocalToast({
		// 		type: 'error',
		// 		message: 'Beyond Stock',
		// 	});
		// 	return;
		// }
		const section = 'coil';
		// Update item
		const updatedData = {
			...data,
			section,
			uuid: nanoid(),
			tape_coil_uuid: updateCoilProd?.uuid,
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};
		await postData.mutateAsync({
			url: `/zipper/tape-coil-production`,
			newData: updatedData,
			onClose,
		});
		invalidateCommonCoilProduction();
		invalidateOtherTapeCoil();
	};

	return (
		<AddModal
			id={'CoilProdModal'}
			title={`Coil Production: ${
				updateCoilProd?.type_of_zipper
					? updateCoilProd?.type_of_zipper.toUpperCase()
					: ''
			}`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label='production_quantity'
				sub_label={`Max: ${Number(MAX_PRODUCTION_QTY)}`}
				placeholder={`Max: ${Number(MAX_PRODUCTION_QTY)}`}
				unit='KG'
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				sub_label={`Max: ${MAX_PRODUCTION_QTY - watch('production_quantity') < 0 ? 0 : MAX_PRODUCTION_QTY - watch('production_quantity')}`}
				placeholder={`Max: ${MAX_PRODUCTION_QTY - watch('production_quantity') < 0 ? 0 : MAX_PRODUCTION_QTY - watch('production_quantity')}`}
				unit='KG'
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
