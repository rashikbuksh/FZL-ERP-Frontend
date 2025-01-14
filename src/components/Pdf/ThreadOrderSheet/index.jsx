import {
	DEFAULT_FONT_SIZE,
	tableLayoutStyle,
	xMargin,
} from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('color', 'Color'),
	getTable('style', 'Style'),
	getTable('count_length_name', 'Count Length'),
	getTable('bleaching', 'Bleaching'),
	getTable('quantity', 'Quantity (cone)', 'right'),
	getTable('expected_yarn', 'Yarn Req.', 'right'),
	getTable('remarks', 'Remarks'),
];

export default function Index(orderInfo) {
	const headerHeight = 180;
	let footerHeight = 50;
	let { order_info_entry } = orderInfo;

	const calculateSummary = (order_info_entry) => {
		let totalQuantity = 0;
		const uniqueColors = new Set();
		let totalExpectedYarn = 0;

		order_info_entry.forEach((item) => {
			totalQuantity += parseFloat(item.quantity);
			uniqueColors.add(item.color);
			totalExpectedYarn += Number(item['max_weight']) * item['quantity'];
		});

		return {
			totalQuantity: totalQuantity.toFixed(4),
			uniqueColorsCount: uniqueColors.size,
			totalExpectedYarn: totalExpectedYarn.toFixed(2),
		};
	};
	order_info_entry = order_info_entry.map((item) => ({
		...item,
		bleaching: item.bleaching === 'bleach' ? 'Bleach' : 'Non-Bleach',
		quantity: Number(item.quantity) || 0,
	}));

	const { totalQuantity, uniqueColorsCount, totalExpectedYarn } =
		calculateSummary(order_info_entry);

	const pdfDocGenerator = pdfMake.createPdf({
		...DEFAULT_A4_PAGE({
			xMargin,
			headerHeight,
			footerHeight,
		}),

		// * Page Header
		header: {
			table: getPageHeader(orderInfo),
			layout: 'noBorders',
			margin: [xMargin, 30, xMargin, 0],
		},
		// * Page Footer
		footer: (currentPage, pageCount) => ({
			table: getPageFooter({
				currentPage,
				pageCount,
			}),
			margin: [xMargin, 2],
			fontSize: DEFAULT_FONT_SIZE - 2,
		}),

		// * Main Table
		content: [
			{
				table: {
					headerRows: 1,
					widths: ['*', '*', 70, 50, '*', '*', '*'],
					body: [
						// * Header
						TableHeader(node),

						// * Body
						...order_info_entry?.map((item) =>
							node.map((nodeItem) => ({
								text:
									nodeItem.field == 'expected_yarn'
										? item['max_weight'] * item['quantity']
										: item[nodeItem.field],
								style: nodeItem.cellStyle,
								alignment: nodeItem.alignment,
							}))
						),
						[
							{
								text: `Total Color: ${Number(uniqueColorsCount)}`,
								bold: true,
								colSpan: 2,
							},
							{},
							{},
							{
								text: `Total QTY: ${Number(totalQuantity)}`,
								alignment: 'right',
								bold: true,
								colSpan: 2,
							},
							{},
							{
								text: `Total Y.Req.: ${Number(totalExpectedYarn)}`,
								alignment: 'right',
								bold: true,
							},
							{},
						],
					],
				},
				// layout: 'lightHorizontalLines',
				layout: tableLayoutStyle,
			},
		],
	});

	return pdfDocGenerator;
}
