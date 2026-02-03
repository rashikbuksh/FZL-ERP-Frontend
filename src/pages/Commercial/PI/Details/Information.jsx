import { useEffect, useState } from 'react';
import { PDF } from '@/assets/icons';
import { format } from 'date-fns';

import PiPdf from '@/components/Pdf/PI';
import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { StatusButton } from '@/ui';

import { DollarToWord } from '@/lib/NumToWord';

export default function Information({ pi, dataForCommercial = null }) {
	const {
		uuid,
		id,
		lc_uuid,
		lc_number,
		order_info_uuids,
		marketing_uuid,
		marketing_name,
		party_uuid,
		party_name,
		merchandiser_uuid,
		merchandiser_name,
		factory_uuid,
		factory_name,
		bank_uuid,
		bank_name,
		bank_swift_code,
		bank_address,
		bank_routing_no,
		factory_address,
		validity,
		payment,
		weight,
		cross_weight,
		created_by,
		created_by_name,
		created_at,
		pi_date,
		updated_at,
		remarks,
		pi_cash_entry,
		pi_cash_entry_thread,
		is_inch,
	} = pi;

	const getUniqueValues = (field, arr = []) =>
		Array.from(new Set(arr?.map((item) => item[field]))).join(', ');

	const buyers = getUniqueValues('buyer_name', pi_cash_entry);
	const orderNumbersZipper = getUniqueValues('order_number', pi_cash_entry);
	const orderNumbersThread = getUniqueValues(
		'order_number',
		pi_cash_entry_thread
	);
	const countLengthThreads = getUniqueValues(
		'count_length_name',
		pi_cash_entry_thread
	);

	const stylesZipper = getUniqueValues('style', pi_cash_entry);
	const stylesThread = getUniqueValues('style', pi_cash_entry_thread);

	const [data, setData] = useState('');

	const pi_info = {
		...pi,
		pi_number: id,
		date: format(new Date(created_at), 'dd/MM/yy'),
		total_quantity: pi_cash_entry.reduce((a, b) => a + b.pi_quantity, 0),
		total_value: pi_cash_entry.reduce((a, b) => a + Number(b.value), 0),
		total_value_in_words: DollarToWord(
			pi_cash_entry.reduce((a, b) => Number(a) + Number(b.value), 0)
		),
		buyer_names: buyers,
		order_numbers: orderNumbersZipper,
		styles: stylesZipper,
	};

	useEffect(() => {
		PiPdf(pi_info).then((res) => setData(res));
	}, [pi]);

	const handleDownload = async () => {
		if (!dataForCommercial) return;
		try {
			// Handle data URLs and normal URLs by fetching and creating a blob
			if (dataForCommercial.startsWith('data:')) {
				const res = await fetch(dataForCommercial);
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `${id || 'pi'}.pdf`;
				document.body.appendChild(a);
				a.click();
				a.remove();
				URL.revokeObjectURL(url);
				return;
			}

			const response = await fetch(dataForCommercial);
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			const contentDisposition = response.headers.get(
				'content-disposition'
			);
			let filename = `${id || 'pi'}.pdf`;
			if (contentDisposition) {
				const match = /filename\*?="?([^";]+)"?/.exec(
					contentDisposition
				);
				if (match) filename = match[1];
			}
			const a = document.createElement('a');
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		} catch (err) {
			console.error('Download failed, opening in new tab', err);
			window.open(dataForCommercial, '_blank');
		}
	};

	const renderItems = () => {
		const total_zipper = pi_cash_entry.reduce(
			(a, b) => ({
				company: a.company + Number(b.company_value),
				party: a.party + Number(b.value),
			}),
			{
				company: 0,
				party: 0,
			}
		);

		const total_thread = pi_cash_entry_thread.reduce(
			(a, b) => ({
				company: a.company + Number(b.company_value),
				party: a.party + Number(b.value),
			}),
			{
				company: 0,
				party: 0,
			}
		);
		const basicInfo = [
			{
				label: 'PI No',
				value: id,
			},
			{
				label: 'LC No',
				value: lc_number,
			},
			{
				label: 'O/N',
				value: (
					<div className='flex flex-wrap gap-2'>
						{orderNumbersZipper
							.split(',')
							.filter(Boolean)
							.map((e) => (
								<span
									key={e}
									className='badge badge-secondary badge-sm h-5'
								>
									{e}
								</span>
							))}

						{orderNumbersThread
							.split(',')
							.filter(Boolean)
							.map((e) => (
								<span
									key={e}
									className='badge badge-secondary badge-sm h-5'
								>
									{e}
								</span>
							))}
					</div>
				),
			},

			{
				label: 'Styles',
				value: (
					<div className='flex flex-wrap gap-2'>
						{stylesZipper}, {stylesThread}
					</div>
				),
			},
			{
				label: 'Count Length',
				value: (
					<div className='flex flex-wrap gap-2'>
						{countLengthThreads}
					</div>
				),
			},
			{
				label: 'Show Inch Btn',
				value: <StatusButton size='btn-xs' value={is_inch} />,
			},
			{
				label: 'Value ($)',
				value: (
					pi_cash_entry.reduce(
						(a, b) => Number(a) + Number(b.value),
						0
					) +
					pi_cash_entry_thread.reduce(
						(a, b) => Number(a) + Number(b.value),
						0
					)
				).toFixed(2),
			},
			{
				label: 'Payment',
				value: payment + ' Days',
			},
			{
				label: 'Validity',
				value: validity + ' Days',
			},
			{
				label: 'Net Weight',
				value: weight + ' Kg',
			},
			{
				label: 'Gross Weight',
				value: cross_weight + ' Kg',
			},
		];

		const bankDetails = [
			{
				label: 'Bank',
				value: bank_name,
			},

			{
				label: 'Bank Routing No',
				value: bank_routing_no,
			},
			{
				label: 'Bank Swift Code',
				value: bank_swift_code,
			},
			{
				label: 'Bank Address',
				value: bank_address,
			},
		];

		const otherInfo = [
			{
				label: 'Buyers',
				value: buyers,
			},
			{
				label: 'Party',
				value: party_name,
			},
			{
				label: 'Merchandiser',
				value: merchandiser_name,
			},
			{
				label: 'Marketing',
				value: marketing_name,
			},
			{
				label: 'Factory',
				value: factory_name,
			},
			{
				label: 'Factory Address',
				value: factory_address,
			},
		];

		const created_details = [
			{
				label: 'Created By',
				value: created_by_name,
			},
			{
				label: 'Created At',
				value: format(new Date(created_at), 'dd/MM/yy'),
			},
			{
				label: 'PI Created At',
				value: pi_date ? format(new Date(pi_date), 'dd/MM/yy') : '---',
			},
			{
				label: 'Updated At',
				value: format(new Date(updated_at), 'dd/MM/yy'),
			},
			{
				label: 'Remarks',
				value: remarks,
			},
		];

		const price_details = [
			{
				label: 'Total Party price',
				value: (total_zipper.party + total_thread.party).toFixed(2),
			},
			{
				label: 'Total Company Price',
				value: (total_zipper.company + total_thread.company).toFixed(2),
			},
			{
				label: 'Total Over Price',
				value: Math.abs(
					total_zipper.company +
						total_thread.company -
						(total_zipper.party + total_thread.party)
				).toFixed(2),
			},
		];

		return {
			basicInfo,
			bankDetails,
			otherInfo,
			created_details,
			price_details,
		};
	};

	const renderButtons = () => {
		return [
			<button
				key='pdf'
				type='button'
				className='btn btn-accent btn-sm rounded-badge'
				onClick={handleDownload}
			>
				<PDF className='w-4' /> PDF
			</button>,
		];
	};

	return (
		<SectionContainer buttons={renderButtons()} title={'Information'}>
			<div className='grid grid-cols-1 lg:grid-cols-5'>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Basic Info'}
					items={renderItems().basicInfo}
				/>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Party Details'}
					items={renderItems().otherInfo}
				/>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Bank Details'}
					items={renderItems().bankDetails}
				/>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Created Details'}
					items={renderItems().created_details}
				/>
				<RenderTable
					className={'border-secondary/30'}
					title={'Price Details'}
					items={renderItems().price_details}
				/>
			</div>
		</SectionContainer>
	);
}
