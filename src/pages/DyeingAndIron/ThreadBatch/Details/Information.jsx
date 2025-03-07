import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { DateTime } from '@/ui';

export default function Information({ batch, water_capacity }) {
	const {
		batch_id,
		production_date,
		category,
		coning_created_at,
		coning_created_by,
		coning_updated_at,
		coning_supervisor_name,
		coning_operator_name,
		coning_machines,
		coning_created_by_name,
		created_at,
		created_by_name,
		drying_created_at,
		drying_updated_at,
		dyeing_created_at,
		dyeing_updated_at,
		dyeing_supervisor_name,
		dyeing_supervisor,
		dyeing_operator_name,
		dyeing_operator,
		is_drying_complete,
		lab_created_at,
		lab_created_by,
		lab_created_by_name,
		lab_updated_at,
		machine_name,
		slot,
		machine_uuid,
		pass_by_name,
		reason,
		status,
		shift,
		remarks,
		updated_at,
		uuid,
		yarn_issue_created_at,
		yarn_issue_created_by_name,
		yarn_issue_updated_at,
		total_yarn_quantity,
	} = batch;

	const renderItems = () => {
		const yarn_issues = [
			{
				label: 'Batch No',
				value: batch_id,
			},
			{
				label: 'Quantity',
				value: total_yarn_quantity,
			},
			{
				label: 'Volume',
				value: Number(
					parseFloat(total_yarn_quantity) * parseFloat(water_capacity)
				).toFixed(3),
			},

			{
				label: 'Created By',
				value: yarn_issue_created_by_name,
			},
			{
				label: 'Created At',
				value: <DateTime date={yarn_issue_created_at} />,
			},
			{
				label: 'Updated At',
				value: <DateTime date={yarn_issue_updated_at} />,
			},
		];

		const conneing = [
			{
				label: 'Machine',
				value: coning_machines,
			},

			{
				label: 'Operator',
				value: coning_operator_name,
			},
			{
				label: 'Supervisor',
				value: coning_supervisor_name,
			},
			{
				label: 'Created By',
				value: coning_created_by_name,
			},

			{
				label: 'Created At',
				value: <DateTime date={coning_created_at} />,
			},

			{
				label: 'Updated At',
				value: <DateTime date={coning_updated_at} />,
			},
		];

		const dying = [
			{
				label: 'Status',
				value: status,
			},
			{
				label: 'Category',
				value: category,
			},
			{
				label: 'Machine',
				value: machine_name,
			},
			{
				label: 'Water Capacity',
				value: Number(water_capacity).toFixed(3),
			},
			{
				label: 'Slot',
				value: slot === 0 ? '-' : 'Slot ' + slot,
			},
		];

		const others = [
			{
				label: 'Operator',
				value: dyeing_operator_name,
			},
			{
				label: 'Supervisor',
				value: dyeing_supervisor_name,
			},

			{
				label: 'Pass By',
				value: pass_by_name,
			},
			{
				label: 'Shift',
				value: shift,
			},

			{
				label: 'Reason',
				value: reason,
			},
			{
				label: 'Production Date',
				value: <DateTime date={production_date} isTime={false} />,
			},
			{
				label: 'Created At',
				value: <DateTime date={dyeing_created_at} isTime={false} />,
			},
			{
				label: 'Updated At',
				value: <DateTime date={dyeing_updated_at} isTime={false} />,
			},
		];

		return {
			yarn_issues,
			conneing,
			dying,
			others,
		};
	};

	return (
		<SectionContainer title={'Information'}>
			<div className='grid grid-cols-1 border-secondary/30 lg:grid-cols-4'>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Conneing'}
					items={renderItems().conneing}
				/>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Yarn Issues'}
					items={renderItems().yarn_issues}
				/>

				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Dyeing'}
					items={renderItems().dying}
				/>
				<RenderTable
					className={'border-secondary/30'}
					title={'Others'}
					items={renderItems().others}
				/>
			</div>
		</SectionContainer>
	);
}
