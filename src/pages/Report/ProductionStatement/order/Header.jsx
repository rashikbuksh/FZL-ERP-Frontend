import { useAuth } from '@/context/auth';
import { useOtherMarketing, useOtherParty } from '@/state/Other';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import {
	FormField,
	ReactSelect,
	SectionEntryBody,
	SimpleDatePicker,
} from '@/ui';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return ``;
};

export default function Header({
	from = '',
	to = '',
	party = '',
	marketing = '',
	type = '',
	setFrom = () => {},
	setTo = () => {},
	setParty = () => {},
	setMarketing = () => {},
	setType = () => {},
}) {
	const haveAccess = useAccess('report__production_statement');
	const { user } = useAuth();
	const { data: marketings } = useOtherMarketing();
	const { data: parties } = useOtherParty(
		`${getPath(haveAccess, user?.uuid) ? `${getPath(haveAccess, user?.uuid)}` : ''}`
	);
	const types = [
		{ label: 'Nylon', value: 'nylon' },
		{ label: 'Vislon', value: 'vislon' },
		{ label: 'Metal', value: 'metal' },
		{ label: 'Thread', value: 'thread' },
		{ label: 'Zipper', value: 'zipper' },
	];

	return (
		<div>
			<SectionEntryBody title={'Order Statement Report'}>
				<div className='flex gap-2'>
					<FormField label='' title='From'>
						<SimpleDatePicker
							key={'from'}
							value={from}
							placeholder='From'
							onChange={(data) => {
								setFrom(format(data, 'yyyy-MM-dd'));
							}}
							selected={from}
						/>
					</FormField>
					<FormField label='' title='To'>
						<SimpleDatePicker
							key={'to'}
							value={to}
							placeholder='To'
							onChange={(data) => {
								setTo(format(data, 'yyyy-MM-dd'));
							}}
							selected={to}
						/>
					</FormField>
				</div>
				<div className='flex gap-2'>
					<FormField label='' title='Party'>
						<ReactSelect
							placeholder='Select Party'
							options={parties}
							value={parties?.find((item) => item.value == party)}
							onChange={(e) => {
								setParty(e.value);
							}}
						/>
					</FormField>
					{!haveAccess.includes('show_own_orders') && (
						<FormField label='' title='Marketing'>
							<ReactSelect
								placeholder='Select Marketing'
								options={marketings}
								value={marketings?.find(
									(item) => item.value == marketing
								)}
								onChange={(e) => {
									setMarketing(e.value);
								}}
							/>
						</FormField>
					)}

					<FormField label='' title='Type'>
						<ReactSelect
							placeholder='Select Type'
							options={types}
							value={types?.find((item) => item.value == type)}
							onChange={(e) => {
								setType(e.value);
							}}
						/>
					</FormField>
				</div>
			</SectionEntryBody>
		</div>
	);
}
