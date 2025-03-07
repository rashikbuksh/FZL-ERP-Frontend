import { useEffect, useMemo, useState } from 'react';
import Pdf from '@components/Pdf/SliderDieCastingProduction';
import { format } from 'date-fns';
import Cookies from 'js-cookie';
import { File } from 'lucide-react';

const HandlePDF = (props) => {
	const { filteredRows, title, pdfData } = props;
	const { extraData, pdf, filterTableHeader } = pdfData || {};
	const [startDate, setStartDate] = useState(() => {
		const cookieStartDate = Cookies.get('startDate');
		return cookieStartDate
			? format(new Date(cookieStartDate), 'dd/MM/yyyy')
			: '';
	});

	const [endDate, setEndDate] = useState(() => {
		const cookieEndDate = Cookies.get('endDate');
		return cookieEndDate
			? format(new Date(cookieEndDate), 'dd/MM/yyyy')
			: '';
	});

	useEffect(() => {
		let endDate = Cookies.get('endDate');
		endDate = endDate ? format(endDate, 'dd/MM/yyyy') : '';
		setEndDate(endDate);
	}, [Cookies.get('endDate')]);

	useEffect(() => {
		let startDate = Cookies.get('startDate');
		startDate = startDate ? new Date(startDate) : '';
		startDate && startDate.setDate(startDate.getDate() + 1);
		startDate = startDate ? format(startDate, 'dd/MM/yyyy') : '';
		setStartDate(startDate);
	}, [Cookies.get('startDate')]);

	const information_data = useMemo(() => {
		return filteredRows.map((row, index) => {
			const extraItem = extraData[index] || {};
			const extraKey = Object.keys(extraItem)[0];

			const rowData = {
				serial_number: index + 1,
				...(extraKey ? { [extraKey]: extraItem[extraKey] } : {}),
			};

			filterTableHeader.forEach((header) => {
				rowData[header] = row.original[header];
			});

			return rowData;
		});
	}, [filteredRows, filterTableHeader, extraData]);

	const information = useMemo(() => {
		return {
			startDate: startDate,
			endDate: endDate,
			data: information_data || [],
		};
	}, [startDate, endDate, information_data, filteredRows]);

	const [data, setData] = useState('');

	useEffect(() => {
		if (information && information?.data) {
			pdf(information)?.getDataUrl((dataUrl) => {
				setData(dataUrl);
			});
		}
	}, [filteredRows, information]);

	return (
		<iframe
			src={data}
			className='h-[40rem] w-full rounded-md border-none bg-red-300'
		/>
	);
};

export default HandlePDF;
