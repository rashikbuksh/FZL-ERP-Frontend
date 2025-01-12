import createGlobalState from '.';
import { reportQK } from './QueryKeys';

//* Stock
export const useReportStock = (from, to, { enabled = false }) =>
	createGlobalState({
		queryKey: reportQK.stock(from, to),
		url: `/report/material-stock-report?from_date=${from}&to_date=${to}`,
		enabled,
	});
export const useProductionReportDateWise = (
	from = '',
	to = '',
	query,
	{ enabled = false } = {}
) =>
	createGlobalState({
		queryKey: reportQK.productionReportDateWise(from, to, query),
		url:
			`/report/daily-production-report?from_date=${from}&to_date=${to}&` +
			query,
		enabled: !!from && !!to && enabled,
	});
export const useProductionStatementReport = (
	from = '',
	to = '',
	party = '',
	marketing = '',
	type = ''
) =>
	createGlobalState({
		queryKey: reportQK.productionReportStatementReport(
			from,
			to,
			party,
			marketing,
			type
		),
		url: `/report/delivery-statement-report?from_date=${from}&to_date=${to}&party=${party}&marketing=${marketing}&type=${type}`,
		enabled: !!from && !!to,
	});

export const useZipperProduction = (query, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.zipperProduction(query),
		url: '/report/zipper-production-status-report?' + query,
		enabled,
	});

export const useThreadProduction = (query, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.threadProduction(query),
		url: '/report/thread-production-batch-wise-report?' + query,
		enabled,
	});

export const useDailyChallan = (query, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.dailyChallan(query),
		url: '/report/daily-challan-report?' + query,
		enabled,
	});

export const usePIRegister = (
	query,
	{ enabled = false } = { enabled: false }
) =>
	createGlobalState({
		queryKey: reportQK.piRegister(query),
		url: '/report/pi-register-report?' + query,
		enabled,
	});

export const usePIToBeSubmitted = (
	query,
	{ enabled = false } = { enabled: false }
) =>
	createGlobalState({
		queryKey: reportQK.piToBeSubmitted(query),
		url: '/report/pi-to-be-register-report?' + query,
		enabled,
	});

export const useLC = (url, { enabled = false } = {}) => {
	return createGlobalState({
		queryKey: reportQK.lc(url),
		url,
		enabled,
	});
};

export const useProductionReport = (url, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.productionReport(url),
		url: `/report/production-report-${url}`,
		enabled,
	});
export const useDeliveryStatement = (url, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.deliveryStatement(url),
		url: `/report/delivery-statement-report?` + url,
		enabled,
	});

export const useProductionReportThreadPartyWise = (
	query,
	{ enabled = false } = {}
) =>
	createGlobalState({
		queryKey: reportQK.productionReportThreadPartyWise(query),
		url: `/report/production-report-thread-party-wise?` + query,
		enabled,
	});

export const useSample = (date, is_sample = 1) =>
	createGlobalState({
		queryKey: reportQK.sample(date, is_sample),
		url: `/report/sample-report-by-date?date=${date}&is_sample=${is_sample}`,
	});
export const useSampleCombined = (date, is_sample = 1) =>
	createGlobalState({
		queryKey: reportQK.sampleCombined(date, is_sample),
		url: `/report/sample-report-by-date-combined?date=${date}&is_sample=${is_sample}`,
	});
