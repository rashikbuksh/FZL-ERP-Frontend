import {
	useOtherBank,
	useOtherFactoryByPartyUUID,
	useOtherLcByPartyUUID,
	useOtherMarketing,
	useOtherMerchandiserByPartyUUID,
	useOtherParty,
} from '@/state/Other';
import { useParams } from 'react-router';
import { useAccess } from '@/hooks';

import { DateInput } from '@/ui/Core';
import {
	CheckBox,
	FormField,
	JoinInput,
	ReactSelect,
	SectionEntryBody,
	Textarea,
} from '@/ui';

export default function Header({
	register,
	errors,
	control,
	getValues,
	Controller,
	isUpdate,
	watch,
	reset,
}) {
	const { pi_uuid } = useParams();
	const haveAccess = useAccess('commercial__pi');
	const is_lc_input_manual_access = haveAccess.includes(
		'input_manual_lc_pi_access'
	);
	const { data: bank } = useOtherBank();
	const { data: party } = useOtherParty(
		'marketing=' + watch('marketing_uuid') + '&is_cash=false'
	);
	const { data: marketing } = useOtherMarketing();

	const { data: merchandiser } = useOtherMerchandiserByPartyUUID(
		watch('party_uuid')
	);
	const { data: factory } = useOtherFactoryByPartyUUID(watch('party_uuid'));
	const { data: lc } = useOtherLcByPartyUUID(watch('party_uuid'));

	return (
		<SectionEntryBody
			title='PI Information'
			header={
				<div className='rounded-md bg-primary px-1'>
					<CheckBox
						title='RTGS'
						label='is_rtgs'
						text='text-primary-content'
						{...{ register, errors }}
					/>
					<CheckBox
						title='Show Inch'
						label='is_inch'
						text='text-primary-content'
						{...{ register, errors }}
					/>
					{is_lc_input_manual_access && (
						<CheckBox
							title='LC Input Manual'
							label='is_lc_input_manual'
							text='text-primary-content'
							{...{ register, errors }}
						/>
					)}
				</div>
			}
		>
			<div className='grid grid-cols-1 gap-2 sm:grid-cols-5 sm:gap-4'>
				<FormField label='lc_id' title='LC' errors={errors}>
					<Controller
						name='lc_uuid'
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select LC'
									options={lc}
									value={lc?.find(
										(item) =>
											item.value == getValues('lc_uuid')
									)}
									onChange={(e) => {
										onChange(e.value);
									}}
									isDisabled={
										!is_lc_input_manual_access ||
										!watch('is_lc_input_manual')
									}
								/>
							);
						}}
					/>
				</FormField>
				<FormField
					label='marketing_uuid'
					title='Marketing'
					errors={errors}
				>
					<Controller
						name='marketing_uuid'
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Marketing'
									options={marketing}
									value={marketing?.find(
										(item) =>
											item.value ==
											getValues('marketing_uuid')
									)}
									onChange={(e) => {
										onChange(e.value);
										reset({
											marketing_uuid: e.value,
											party_uuid: '',
											merchandiser_uuid: '',
											factory_uuid: '',
										});
									}}
									isDisabled={pi_uuid != undefined}
								/>
							);
						}}
					/>
				</FormField>
				<FormField label='party_uuid' title='Party' errors={errors}>
					<Controller
						name='party_uuid'
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Party'
									options={party}
									value={
										party?.filter(
											(item) =>
												item.value ==
												watch('party_uuid')
										) || null
									}
									onChange={(e) => {
										onChange(e.value);
									}}
									isDisabled={pi_uuid != undefined}
								/>
							);
						}}
					/>
				</FormField>
				<FormField
					label='merchandiser_uuid'
					title='Merchandiser'
					errors={errors}
				>
					<Controller
						name='merchandiser_uuid'
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Merchandiser'
									options={merchandiser}
									value={
										merchandiser?.find(
											(item) =>
												item.value ==
												watch('merchandiser_uuid')
										) || null
									}
									onChange={(e) => onChange(e.value)}
									// isDisabled={pi_uuid != undefined}
								/>
							);
						}}
					/>
				</FormField>
				<DateInput
					label='pi_date'
					Controller={Controller}
					control={control}
					selected={watch('pi_date')}
					{...{ register, errors }}
				/>
			</div>

			<div className='grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4 xl:grid-cols-6'>
				<FormField label='factory_uuid' title='Factory' errors={errors}>
					<Controller
						name='factory_uuid'
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Factory'
									options={factory}
									value={
										factory?.filter(
											(item) =>
												item.value ==
												watch('factory_uuid')
										) || null
									}
									onChange={(e) => onChange(e.value)}
									// isDisabled={pi_uuid != undefined}
								/>
							);
						}}
					/>
				</FormField>
				<FormField label='bank_uuid' title='Bank' errors={errors}>
					<Controller
						name='bank_uuid'
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Bank'
									options={bank}
									value={bank?.find(
										(item) =>
											item.value == getValues('bank_uuid')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
				<JoinInput
					label='validity'
					unit='DAYS'
					{...{ register, errors }}
				/>
				<JoinInput
					label='payment'
					unit='DAYS'
					{...{ register, errors }}
				/>
				<JoinInput
					title='Net weight'
					label='weight'
					unit='KG'
					{...{ register, errors }}
				/>
				<JoinInput
					title='Gross weight'
					label='cross_weight'
					unit='KG'
					{...{ register, errors }}
				/>
			</div>

			<Textarea label='remarks' {...{ register, errors }} />
		</SectionEntryBody>
	);
}
