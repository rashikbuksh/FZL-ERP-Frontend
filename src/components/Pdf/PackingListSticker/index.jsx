import { format } from 'date-fns';
import { color } from 'framer-motion';

import {
	DEFAULT_FONT_SIZE,
	tableLayoutStyle,
	xMargin,
} from '@/components/Pdf/ui';
import {
	CUSTOM_PAGE,
	DEFAULT_A4_PAGE,
	getTable,
	TableHeader,
} from '@/components/Pdf/utils';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('item_description', 'Item'),
	getTable('style', 'Style'),
	getTable('color', 'Color'),
	getTable('size', 'Size', 'right'),
	getTable('quantity', 'Qty(pcs)', 'right'),
	getTable('poli_quantity', 'Poly', 'right'),
];

export default function Index(data) {
	const getDateFormate = (date) => format(new Date(date), 'dd/MM/yyyy');
	let { packing_list_entry } = data;
	let totalQuantity = packing_list_entry?.reduce((acc, item) => {
		const quantity = parseInt(item.quantity, 10) || 0;
		return acc + quantity;
	}, 0);
	let totalPoly = packing_list_entry?.reduce((acc, item) => {
		const quantity = parseInt(item.poli_quantity, 10) || 0;
		return acc + quantity;
	}, 0);
	data?.packing_list_entry?.map((item) => {
		item.size = `${item.is_inch === 1 ? `${item.size} in` : `${item.size} cm`}`;
	});
	const pdfDocGenerator = pdfMake.createPdf({
		...CUSTOM_PAGE({
			xMargin,
		}),

		// * Main Table
		content: [
			{
				table: {
					headerRows: 1,
					widths: [40, '*', '*', 25, 30, 20],
					body: [
						[
							{
								text: 'Fortune Zipper LTD',
								style: 'header',
								bold: true,
								alignment: 'center',
								colSpan: 6,
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
							{},
							{},
							{},
							{},
							{},
						],
						[
							{
								text: 'O/N',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
							{
								text: `${data?.order_number}`,

								fontSize: DEFAULT_FONT_SIZE - 2,
								colSpan: 2,
							},
							{},
							{
								text: 'Date',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
							{
								text: `${getDateFormate(data?.created_at)}`,

								fontSize: DEFAULT_FONT_SIZE - 2,
								colSpan: 2,
							},
							{},
						],
						[
							{
								text: 'C/N',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
							{
								text: `${data?.packing_list_wise_rank}-(${data?.packing_number})`,

								fontSize: DEFAULT_FONT_SIZE - 2,
								colSpan: 2,
							},
							{},
							{
								text: 'Weight',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
							{
								text: `${data?.carton_weight} Kg`,

								fontSize: DEFAULT_FONT_SIZE - 2,
								colSpan: 2,
							},
							{},
						],
						[
							{
								text: 'Factory',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
							{
								text: `${data?.factory_name}`,

								fontSize: DEFAULT_FONT_SIZE - 2,
								colSpan: 2,
							},
							{},
							{
								text: 'Buyer',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
							{
								text: `${data?.buyer_name}`,

								fontSize: DEFAULT_FONT_SIZE - 2,
								colSpan: 2,
							},
							{},
						],
						// * Header
						TableHeader(node, DEFAULT_FONT_SIZE - 2, '#000000'),

						// * Body
						...packing_list_entry?.map((item) =>
							node.map((nodeItem) => ({
								text: item[nodeItem.field],
								style: nodeItem.cellStyle,
								alignment: nodeItem.alignment,
								fontSize: DEFAULT_FONT_SIZE - 2,
							}))
						),
						[
							{
								text: `Total`,
								alignment: 'right',
								colSpan: 4,
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
							{},
							{},
							{},
							{
								text: totalQuantity,
								bold: true,
								alignment: 'right',
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
							{
								text: totalPoly,
								bold: true,
								alignment: 'right',
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
						],
					],
				},
				// layout: 'lightHorizontalLines',
				//layout: tableLayoutStyle,
			},
		],
	});

	return pdfDocGenerator;
}