/**
 *? Effective React Query Keys
 ** https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
 ** https://tkdodo.eu/blog/leveraging-the-query-function-context#query-key-factories
 **/

export const orderQK = {
	all: () => ['order'],

	// details
	details: () => [...orderQK.all(), 'details'],
	detail: (uuid) => [...orderQK.details(), uuid],
	detailByOrderNumber: (orderNumber) => [...orderQK.details(), orderNumber],
	detailsByOrderDescription: (orderNumber, uuid) => [
		...orderQK.details(),
		orderNumber,
		uuid,
	],

	// Description
	descriptions: () => [...orderQK.all(), 'description'],
	description: (uuid) => [...orderQK.descriptions(), uuid],

	// Entry
	entries: () => [...orderQK.all(), 'entries'],
	entry: (uuid) => [...orderQK.entries(), uuid],

	// info
	infos: () => [...orderQK.all(), 'info'],
	info: (id) => [...orderQK.infos(), id],
	infoByUUID: (uuid) => [...orderQK.info(), uuid],

	// buyers
	buyers: () => [...orderQK.all(), 'buyer'], // [order, buyer]
	buyer: (uuid) => [...orderQK.buyers(), uuid], // [order, buyer, uuid]

	// marketing
	marketings: () => [...orderQK.all(), 'marketing'],
	marketing: (uuid) => [...orderQK.marketings(), uuid],

	// marketing
	factories: () => [...orderQK.all(), 'factory'],
	factory: (uuid) => [...orderQK.factories(), uuid],

	// merchandisers
	merchandisers: () => [...orderQK.all(), 'merchandisers'],
	merchandiser: (uuid) => [...orderQK.merchandisers(), uuid],
	//Party
	party: () => [...orderQK.all(), 'party'],
	partyByUUID: (uuid) => [...orderQK.party(), uuid],
	//properties
	properties: () => [...orderQK.all(), 'properties'],
	propertiesByUUID: (uuid) => [...orderQK.party(), uuid],
};

export const adminQK = {
	all: () => ['admin'],

	// departments
	departments: () => [...adminQK.all(), 'departments'],
	department: (uuid) => [...adminQK.departments(), uuid],

	// designation
	designations: () => [...adminQK.all(), 'designations'],
	designation: (uuid) => [...adminQK.designations(), uuid],

	// users
	users: () => [...adminQK.all(), 'users'],
	user: (uuid) => [...adminQK.users(), uuid],
};

export const commercialQK = {
	all: () => ['commercial'],

	// bank
	banks: () => [...commercialQK.all(), 'bank'],
	bank: (uuid) => [...commercialQK.banks(), uuid],

	// pi
	pis: () => [...commercialQK.all(), 'pi'],
	pi: (uuid) => [...commercialQK.pis(), uuid],
	piByOrderInfo: (orderId, partyId, marketingId) => [
		...commercialQK.pis(),
		orderId,
		partyId,
		marketingId,
	],

	// pi-entry
	piEntries: () => [...commercialQK.all(), 'pi-entry'],
	piEntry: (uuid) => [...commercialQK.piEntries(), uuid],

	// lc
	lcs: () => [...commercialQK.all(), 'lc'],
	lc: (uuid) => [...commercialQK.lcs(), uuid],
	lcPi: (uuid) => [...commercialQK.all(), 'lc-pi', uuid],
	lcNumber: (uuid) => [...commercialQK.all(), 'lc-number', uuid],
};

// Material Query Keys
export const materialQK = {
	all: () => ['material'],

	// section
	sections: () => [...materialQK.all(), 'section'],
	section: (uuid) => [...materialQK.sections(), uuid],

	// types
	types: () => [...materialQK.all(), 'type'],
	type: (uuid) => [...materialQK.types(), uuid],

	// infos
	infos: () => [...materialQK.all(), 'info'],
	info: (uuid) => [...materialQK.infos(), uuid],

	// trx
	trxs: () => [...materialQK.all(), 'trx'],
	trx: (uuid) => [...materialQK.trxs(), uuid],

	// stock to sfg
	stockToSGFs: () => [...materialQK.all(), 'stock-to-sfg'],
	stockToSFG: (uuid) => [...materialQK.stockToSGFs(), uuid],

	// *TrxAgainstOrderDescription//
	trxAgainstOrderDescriptions: () => [
		...materialQK.all(),
		'trx-against-order-description',
	],
	trxAgainstOrderDescription: (uuid) => [
		...materialQK.trxAgainstOrderDescriptions(),
		uuid,
	],
};

// Purchase Query Keys
export const purchaseQK = {
	all: () => ['purchase'],

	// vendor
	vendors: () => [...purchaseQK.all(), 'vendors'],
	vendor: (uuid) => [...purchaseQK.vendors(), uuid],

	// description
	descriptions: () => [...purchaseQK.all(), 'description'],
	description: (uuid) => [...purchaseQK.descriptions(), uuid],

	// entry
	entries: () => [...purchaseQK.all(), 'entries'],
	entry: (uuid) => [...purchaseQK.entries(), uuid],

	// details
	details: () => [...purchaseQK.all(), 'details'],
	detail: (uuid) => [...purchaseQK.details(), uuid],
};

//Library
export const libraryQK = {
	all: () => ['library'],
	// users
	users: () => [...libraryQK.all(), 'users'],
	userByUUID: (uuid) => [...libraryQK.users(), uuid],
	// policies
	policies: () => [...libraryQK.all(), 'policies'],
	policyByUUID: (uuid) => [...libraryQK.policies(), uuid],
};

//Common
export const commonQK = {
	all: () => ['common'],

	// * tapeSFG
	tapeSFG: () => [...commonQK.all(), 'tape/SFG'],
	tapeSFGByUUID: (uuid) => [...commonQK.tapeSFG(), uuid],
	// * tapeProduction
	tapeProduction: () => [...commonQK.all(), 'tape/production'],
	tapeProductionByUUID: (uuid) => [...commonQK.tapeProduction(), uuid],

	// * tapeToCoil
	tapeToCoil: () => [...commonQK.all(), 'tape/to-coil'],
	tapeToCoilByUUID: (uuid) => [...commonQK.tapeToCoil(), uuid],
	// * tapeRM
	tapeRM: () => [...commonQK.all(), 'tape/rm'],
	tapeRMByUUID: (uuid) => [...commonQK.tapeRM(), uuid],

	// * tapeRMLog
	tapeRMLog: () => [...commonQK.all(), 'tape/rm-log'],
	tapeRMLogByUUID: (uuid) => [...commonQK.tapeRMLog(), uuid],

	// *  Order Against Tape RM Log * //
	orderAgainstTapeRMLog: () => [
		...commonQK.all(),
		'tape/order/against/rm-log',
	],
	orderAgainstTapeRMLogByUUID: (uuid) => [
		...commonQK.orderAgainstTapeRMLog(),
		uuid,
	],
	// * coilSFG
	coilSFG: () => [...commonQK.all(), 'coil/SFG'],
	coilSFGByUUID: (uuid) => [...commonQK.coilSFG(), uuid],

	// * coilProduction
	coilProduction: () => [...commonQK.all(), 'coil/production'],
	coilProductionByUUID: (uuid) => [...commonQK.coilProduction(), uuid],

	// * coilRM
	coilRM: () => [...commonQK.all(), 'coil/rm'],
	coilRMByUUID: (uuid) => [...commonQK.coilRM(), uuid],
	// * coilRMLog
	coilRMLog: () => [...commonQK.all(), 'coil/rm-log'],
	coilRMLogByUUID: (uuid) => [...commonQK.coilRMLog(), uuid],
	// * materialUsed
	materialUsed: () => [...commonQK.all(), 'material/used'],
	materialUsedByUUID: (uuid) => [...commonQK.materialUsed(), uuid],

	// * Coil Order Against Coil RM Log * //
	orderAgainstCoilRMLog: () => [
		...commonQK.all(),
		'coil/order/against/rm-log',
	],
	orderAgainstCoilRMLogByUUID: (uuid) => [
		...commonQK.orderAgainstCoilRMLog(),
		uuid,
	],
	// * MATERIAL TRX *//
	materialTrx: () => [...commonQK.all(), 'material/trx'],
	materialTrxByUUID: (uuid) => [...commonQK.materialTrx(), uuid],

	// * Coil to Dyeing
	coilToDyeing: () => [...commonQK.all(), 'coil/to-dyeing'],
	coilToDyeingByUUID: (uuid) => [...commonQK.coilToDyeing(), uuid],

	// * Tape to Dyeing
	tapeToDyeing: () => [...commonQK.all(), 'tape/to-dyeing'],
	tapeToDyeingByUUID: (uuid) => [...commonQK.tapeToDyeing(), uuid],
};

// * LabDip * //
export const labDipQK = {
	all: () => ['labDip'],
	// recipe
	recipe: () => [...labDipQK.all(), 'recipe'],
	recipeByUUID: (uuid) => [...labDipQK.recipe(), uuid],

	// info
	info: () => [...labDipQK.all(), 'info'],
	infoByUUID: (uuid) => [...labDipQK.info(), uuid],

	// * RM
	LabDipRM: () => [...labDipQK.all(), 'rm'],
	LabDipRMByUUID: (uuid) => [...labDipQK.LabDipRM(), uuid],

	// * RM Log
	LabDipRMLog: () => [...labDipQK.all(), 'rm-log'],
	LabDipRMLogByUUID: (uuid) => [...labDipQK.LabDipRMLog(), uuid],

	// * Order Against lab_dip RM Log * //
	orderAgainstLabDipRMLog: () => [
		...labDipQK.all(),
		'lab_dip/order-against-rm-log',
	],
	orderAgainstLabDipRMLogByUUID: (uuid) => [
		...labDipQK.orderAgainstLabDipRMLog(),
		uuid,
	],
	// * Shade Recipe
	shadeRecipe: () => [...labDipQK.all(), 'shade-recipe'],
	shadeRecipeByUUID: (uuid) => [...labDipQK.shadeRecipe(), uuid],
	// * Shade Recipe Description
	shadeRecipeDescription: () => [
		...labDipQK.all(),
		'shade-recipe/description',
	],
	shadeRecipeDescriptionByUUID: (uuid) => [
		...labDipQK.shadeRecipeDescription(),
		uuid,
	],
	// * Shade Recipe Entry
	shadeRecipeEntry: () => [...labDipQK.all(), 'shade-recipe/entry'],
	shadeRecipeEntryByUUID: (uuid) => [...labDipQK.shadeRecipeEntry(), uuid],
};

// * Dyeing

export const dyeingQK = {
	all: () => ['dyeing'],

	// * RM
	dyeingRM: () => [...dyeingQK.all(), 'rm'],
	dyeingRMByUUID: (uuid) => [...dyeingQK.dyeingRM(), uuid],

	// * RM Log
	dyeingRMLog: () => [...dyeingQK.all(), 'rm-log'],
	dyeingRMLogByUUID: (uuid) => [...dyeingQK.dyeingRMLog(), uuid],

	// * swatch
	swatch: () => [...dyeingQK.all(), 'swatch'],
	swatchByUUID: (uuid) => [...dyeingQK.swatch(), uuid],

	// * planning
	planning: () => [...dyeingQK.all(), 'planning'],
	planningByUUID: (uuid) => [...dyeingQK.planning(), uuid],

	// *  batch
	batch: () => [...dyeingQK.all(), 'batch'],
	batchByUUID: (uuid) => [...dyeingQK.batch(), uuid],

	// * Thread Batch
	threadBatch: () => [...dyeingQK.all(), 'thread-batch'],
	threadBatchByUUID: (uuid) => [...dyeingQK.threadBatch(), uuid],
	//* Thread Batch Entry
	threadBatchEntry: () => [...dyeingQK.all(), 'thread-batch-entry'],
	threadBatchEntryByUUID: (uuid) => [...dyeingQK.threadBatchEntry(), uuid],

	// * Order Against dyeing RM Log * //
	orderAgainstDyeingRMLog: () => [
		...dyeingQK.all(),
		'dyeing/order-against-rm-log',
	],
	orderAgainstDyeingRMLogByUUID: (uuid) => [
		...dyeingQK.orderAgainstDyeingRMLog(),
		uuid,
	],
	//* Dyeing Transfer
	dyeingTransfer: () => [...dyeingQK.all(), 'dyeing-transfer'],
	dyeingTransferByUUID: (uuid) => [...dyeingQK.dyeingTransfer(), uuid],
};

// * Nylon
export const nylonQK = {
	all: () => ['nylon'],

	// * Metallic Finishing
	// * RM

	nylonMetallicFinishingRM: () => [...nylonQK.all(), 'rm'],
	nylonMetallicFinishingRMByUUID: (uuid) => [
		...nylonQK.nylonMetallicFinishingRM(),
		uuid,
	],

	//* RM Log
	nylonMetallicFinishingRMLog: () => [...nylonQK.all(), 'rm-log'],
	nylonMetallicFinishingRMLogByUUID: (uuid) => [
		...nylonQK.nylonMetallicFinishingRMLog(),
		uuid,
	],

	// * Order Against nylonFinishing RM Log * //
	orderAgainstNylonFinishingRMLog: () => [
		...nylonQK.all(),
		'nylonFinishing/order-against-rm-log',
	],
	orderAgainstNylonFinishingRMLogByUUID: (uuid) => [
		...nylonQK.orderAgainstNylonFinishingRMLog(),
		uuid,
	],
	//*Tape Log
	nylonMetallicTapeLog: () => [...nylonQK.all(), 'metallic-tape-log'],
	nylonMetallicTapeLogByUUID: (uuid) => [...nylonQK.nylonTapeLog(), uuid],
	//*Plastic Finishing
	nylonPlasticFinishingTapeLog: () => [...nylonQK.all(), 'plastic-tape-log'],
	nylonPlasticFinishingTapeLogByUUID: (uuid) => [
		...nylonQK.nylonPlasticFinishingTapeLog(),
	],
};
// *Vislon
export const vislonQK = {
	all: () => ['vislon'],
	//* Teeth Molding

	// * RM
	VislonTMRM: () => [...vislonQK.all(), 'tm-rm'],
	VislonTMRMByUUID: (uuid) => [...vislonQK.VislonTMRM(), uuid],

	// * RM Log
	VislonTMRMLog: () => [...vislonQK.all(), 'tm-rm-log'],
	VislonTMRMLogByUUID: (uuid) => [...vislonQK.VislonTMRMLog(), uuid],

	// * Order Against vislonTMRMLog * //// * Order Against vislonTM RM Log * //
	orderAgainstVislonTMRMLog: () => [
		...vislonQK.all(),
		'vislonTM/order-against-rm-log',
	],
	orderAgainstVislonTMRMLogByUUID: (uuid) => [
		...vislonQK.orderAgainstVislonTMRMLog(),
		uuid,
	],

	// * Finishing

	//*RM
	VislonFinishingRM: () => [...vislonQK.all(), 'fin-rm'],
	VislonFinishingRMByUUID: (uuid) => [
		...vislonQK.VislonFinishingRM(),
		'rm',
		uuid,
	],

	//*RM Log
	VislonFinishingRMLog: () => [...vislonQK.all(), 'fin-rm-log'],
	VislonFinishingRMLogByUUID: (uuid) => [
		...vislonQK.VislonFinishingRMLog(),
		'rm-log',
		uuid,
	],

	// * Order Against vislonFinishing RM Log * //
	orderAgainstVislonFinishingRMLog: () => [
		...vislonQK.all(),
		'vislonFinishing/order-against-rm-log',
	],
	orderAgainstVislonFinishingRMLogByUUID: (uuid) => [
		...vislonQK.orderAgainstVislonFinishingRMLog(),
		uuid,
	],

	// * Vislon Teeth Molding Production combined data
	vislonTMP: () => [...vislonQK.all(), 'vislonTMP'],
	vislonTMPByUUID: (uuid) => [...vislonQK.vislonTMP(), uuid],

	// * Vislon Teeth Molding Transaction combined data
	vislonTMT: () => [...vislonQK.all(), 'vislonTMT'],
	vislonTMTByUUID: (uuid) => [...vislonQK.vislonTMT(), uuid],

	// * Vislon Teeth Molding Production Entry
	vislonTMPEntry: () => [...vislonQK.all(), 'vislonTMPEntry'],
	vislonTMPEntryByUUID: (uuid) => [...vislonQK.vislonTMPEntry(), uuid],

	// * Vislon Teeth Molding Transaction Entry
	vislonTMTEntry: () => [...vislonQK.all(), 'vislonTMTEntry'],
	vislonTMTEntryByUUID: (uuid) => [...vislonQK.vislonTMTEntry(), uuid],

	// * Vislon Teeth Molding Production Log
	vislonTMPLog: () => [...vislonQK.all(), 'vislonTMPLog'],
	vislonTMPLogByUUID: (uuid) => [...vislonQK.vislonTMPLog(), uuid],

	// * Vislon Teeth Molding Transaction Log
	vislonTMTLog: () => [...vislonQK.all(), 'vislonTMTLog'],
	vislonTMTLogByUUID: (uuid) => [...vislonQK.vislonTMTLog(), uuid],
	//* Vislon Teeth Molding Tape Log
	vislonTMTapeLog: () => [...vislonQK.all(), 'vislonTMTapeLog'],
	vislonTMTapeLogByUUID: (uuid) => [...vislonQK.vislonTMTapeLog(), uuid],
};

// * Metal

export const metalQK = {
	all: () => ['metal'],

	//* Teeth Molding

	// * Transaction Log
	metalTMTrxLog: () => [...metalQK.all(), 'tm-trx-log'],
	metalTMTrxLogByUUID: (uuid) => [...metalQK.all(), 'tm-trx-log', uuid],

	// * PRODUCTION Log
	metalTMProductionLog: () => [...metalQK.all(), 'tm-production-log'],
	metalTMProductionLogByUUID: (uuid) => [
		...metalQK.all(),
		'tm-production-log',
		uuid,
	],
	// * Tape Log

	metalTMTapeLog: () => [...metalQK.all(), 'tm-tape-log'],
	metalTMTapeLogByUUID: (uuid) => [...metalQK.all(), 'tm-tape-log', uuid],

	//* Tape Log

	metalTMTapeLog: () => [...metalQK.all(), 'tm-tape-log'],
	metalTMTapeLogByUUID: (uuid) => [...metalQK.all(), 'tm-tape-log', uuid],

	// * PRODUCTION
	metalTMProduction: () => [...metalQK.all(), 'tm-production'],

	// * RM
	metalTMRM: () => [...metalQK.all(), 'tm-rm'],
	metalTMRMByUUID: (uuid) => [...metalQK.metalTMRM(), uuid],

	// * RM Log
	metalTMRMLog: () => [...metalQK.all(), 'tm-rm-log'],
	metalTMRMLogByUUID: (uuid) => [...metalQK.metalTMRMLog(), uuid],

	// * Order Against Metal TM RM Log * //
	orderAgainstMetalTMRMLog: () => [
		...metalQK.all(),
		'metalTM/order-against-rm-log',
	],
	orderAgainstMetalTMRMLogByUUID: (uuid) => [
		...metalQK.orderAgainstMetalTMRMLog(),
		uuid,
	],

	// * Finishing

	//*RM
	metalFinishingRM: () => [...metalQK.all(), 'fin-rm'],
	metalFinishingRMByUUID: (uuid) => [...metalQK.metalFinishingRM(), uuid],

	//*RM Log
	metalFinishingRMLog: () => [...metalQK.all(), 'fin-rm-log'],
	metalFinishingRMLogByUUID: (uuid) => [
		...metalQK.metalFinishingRMLog(),
		uuid,
	],

	// * Order Against metalFinishing RM Log * //
	orderAgainstMetalFinishingRMLog: () => [
		...metalQK.all(),
		'metalFinishing/order-against-rm-log',
	],
	orderAgainstMetalFinishingRMLogByUUID: (uuid) => [
		...metalQK.orderAgainstmetalFinishingRMLog(),
		uuid,
	],

	//* Teeth Coloring
	// * PRODUCTION
	metalTCProduction: () => [...metalQK.all(), 'tc-production'],

	// * Transaction Log
	metalTCTrxLog: () => [...metalQK.all(), 'tc-trx-log'],
	metalTCTrxLogByUUID: (uuid) => [...metalQK.all(), 'tc-trx-log', uuid],

	// * PRODUCTION Log
	metalTCProductionLog: () => [...metalQK.all(), 'tc-production-log'],
	metalTCProductionLogByUUID: (uuid) => [
		...metalQK.all(),
		'tc-production-log',
		uuid,
	],

	// * RM
	metalTCRM: () => [...metalQK.all(), 'tc-rm'],
	metalTCRMByUUID: (uuid) => [...metalQK.metalTCRM(), uuid],

	// * RM Log
	metalTCRMLog: () => [...metalQK.all(), 'tc-rm-log'],
	metalTCRMLogByUUID: (uuid) => [...metalQK.metalTCRMLog(), uuid],
	// * Order Against metalTC RM Log * //
	orderAgainstMetalTCRMLog: () => [
		...metalQK.all(),
		'metalTC/order-against-rm-log',
	],
	orderAgainstMetalTCRMLogByUUID: (uuid) => [
		...metalQK.orderAgainstMetalTCRMLog(),
		uuid,
	],
};

// *Slider

export const sliderQK = {
	all: () => ['slider'],
	// *Slider Assembly

	// * RM
	sliderAssemblyRM: () => [...sliderQK.all(), 'assembly-rm'],
	sliderAssemblyRMByUUID: (uuid) => [...sliderQK.sliderAssemblyRM(), uuid],

	// * RM Log
	sliderAssemblyRMLog: () => [...sliderQK.all(), 'assembly-rm-log'],
	sliderAssemblyRMLogByUUID: (uuid) => [
		...sliderQK.sliderAssemblyRMLog(),
		uuid,
	],

	//* Slider/Dashboard--> (INFO)
	sliderDashboardInfo: () => [...sliderQK.all(), 'dashboard-info'],
	sliderDashboardInfoByUUID: (uuid) => [
		...sliderQK.sliderDashboardInfo(),
		uuid,
	],

	//* Die Casting --> (STOCK)
	sliderDieCastingStock: () => [...sliderQK.all(), 'dc-stock'],
	sliderDieCastingStockByUUID: (uuid) => [
		...sliderQK.sliderDieCastingStock(),
		uuid,
	],
	sliderDieCastingStockByOrderNumbers: (...uuid) => [
		...sliderQK.sliderDieCastingStock(),
		...uuid,
	],

	//* Die Casting --> (TRANSFER)
	sliderDieCastingTransfer: () => [...sliderQK.all(), 'dc-transfer'],
	sliderDieCastingTransferByUUID: (uuid) => [
		...sliderQK.sliderDieCastingStock(),
		uuid,
	],

	//* Die Casting --> (PRODUCTION)
	sliderDieCastingProduction: () => [...sliderQK.all(), 'dc-production'],
	sliderDieCastingProductionByUUID: (uuid) => [
		...sliderQK.sliderDieCastingProduction(),
		uuid,
	],

	// * Order Against sliderAssembly RM Log * //
	orderAgainstSliderAssemblyRMLog: () => [
		...sliderQK.all(),
		'sliderAssembly/order-against-rm-log',
	],
	orderAgainstSliderAssemblyRMLogByUUID: (uuid) => [
		...sliderQK.orderAgainstSliderAssemblyRMLog(),
		uuid,
	],

	//* Die Casting
	// * RM
	sliderDieCastingRM: () => [...sliderQK.all(), 'dc-rm'],
	sliderDieCastingRMByUUID: (uuid) => [
		...sliderQK.sliderDieCastingRM(),
		uuid,
	],

	// * RM Log
	sliderDieCastingRMLog: () => [...sliderQK.all(), 'dc-rm-log'],
	sliderDieCastingRMLogByUUID: (uuid) => [
		...sliderQK.sliderDieCastingRMLog(),
		uuid,
	],
	// * Order Against dieCasting RM Log * //
	orderAgainstDieCastingRMLog: () => [
		...sliderQK.all(),
		'dieCasting/order-against-rm-log',
	],
	orderAgainstDieCastingRMLogByUUID: (uuid) => [
		...sliderQK.orderAgainstDieCastingRMLog(),
		uuid,
	],

	//* Coloring
	// * RM
	sliderColoringRM: () => [...sliderQK.all(), 'c-rm'],
	sliderColoringRMByUUID: (uuid) => [...sliderQK.sliderColoringRM(), uuid],

	// * RM Log
	sliderColoringRMLog: () => [...sliderQK.all(), 'c-rm-log'],
	sliderColoringRMLogByUUID: (uuid) => [
		...sliderQK.sliderColoringRMLog(),
		uuid,
	],
	// * Order Against sliderColor RM Log * //
	orderAgainstSliderColorRMLog: () => [
		...sliderQK.all(),
		'sliderFinishing/order-against-rm-log',
	],
	orderAgainstSliderColorRMLogByUUID: (uuid) => [
		...sliderQK.orderAgainstSliderColorRMLog(),
		uuid,
	],

	// * Slider Assembly Production
	sliderAssemblyProduction: () => [...sliderQK.all(), 'assembly-production'],
	sliderAssemblyProductionByUUID: (uuid) => [
		...sliderQK.sliderAssemblyProduction(),
		uuid,
	],

	// * Slider Assembly Production Entry
	sliderAssemblyProductionEntry: () => [
		...sliderQK.all(),
		'assembly-production-entry',
	],
	sliderAssemblyProductionEntryByUUID: (uuid) => [
		...sliderQK.sliderAssemblyProductionEntry(),
		uuid,
	],

	// * Slider Assembly Transfer Entry
	sliderAssemblyTransferEntry: () => [
		...sliderQK.all(),
		'assembly-transfer-entry',
	],
	sliderAssemblyTransferEntryByUUID: (uuid) => [
		...sliderQK.sliderAssemblyTransferEntry(),
		uuid,
	],
};
//* Delivery

export const deliveryQk = {
	all: () => ['delivery'],
	// *RM
	deliveryRM: () => [...deliveryQk.all(), 'rm'],
	deliveryRMByUUID: (uuid) => [...deliveryQk.deliveryRM(), uuid],

	// *RM Log
	deliveryRMLog: () => [...deliveryQk.all(), 'rm-log'],
	deliveryRMLogByUUID: (uuid) => [...deliveryQk.deliveryRMLog(), uuid],

	// *  Order Against Delivery RM Log * //
	orderAgainstDeliveryRMLog: () => [
		...deliveryQk.all(),
		'order-against-rm-log',
	],
	orderAgainstDeliveryRMLogByUUID: (uuid) => [
		...deliveryQk.orderAgainstDeliveryRMLog(),
		uuid,
	],
};
//Thread

export const threadQK = {
	all: () => ['thread'],

	//Count-length
	countLength: () => [...threadQK.all(), 'count-length'],
	countLengthByUUID: (uuid) => [...threadQK.countLength(), uuid],

	//Machine
	machine: () => [...threadQK.all(), 'machine'],
	machineByUUID: (uuid) => [...threadQK.machine(), uuid],

	//Order-info
	orderInfo: () => [...threadQK.all(), 'order-info'],
	orderInfoByUUID: (uuid) => [...threadQK.orderInfo(), uuid],

	//Order-info-entry
	orderInfoEntry: () => [...threadQK.all(), 'order-info-entry'],
	orderInfoEntryByUUID: (uuid) => [...threadQK.orderInfoEntry(), uuid],

	//Swatch
	swatch: () => [...threadQK.all(), 'swatch'],
	swatchByUUID: (uuid) => [...threadQK.swatch(), uuid],

	//DyesCategory
	dyesCategory: () => [...threadQK.all(), 'dyes-category'],
	dyesCategoryByUUID: (uuid) => [...threadQK.dyesCategory(), uuid],

	//Programs
	programs: () => [...threadQK.all(), 'programs'],
	programsByUUID: (uuid) => [...threadQK.programs(), uuid],
};

//* OTHER QUERY KEYS

export const otherQK = {
	all: () => ['other'],
	party: () => [...otherQK.all(), 'party'],
	buyer: () => [...otherQK.all(), 'buyer'],
	marketing: () => [...otherQK.all(), 'marketing'],
	order: () => [...otherQK.all(), 'order'],
	orderEntry: () => [...otherQK.all(), 'order-entry'],
	vendor: () => [...otherQK.all(), 'vendor'],
	bank: () => [...otherQK.all(), 'bank'],
	material: () => [...otherQK.all(), 'material'],
	materialSection: () => [...otherQK.all(), 'material-section'],
	materialType: () => [...otherQK.all(), 'material-type'],
	department: () => [...otherQK.all(), 'department'],
	labDip: () => [...otherQK.all(), 'lab-dip'],
	sliderItem: () => [...otherQK.all(), 'slider-item'],
	lcByPartyUUID: (uuid) => [...otherQK.all(), 'lc-by-party', uuid],
	pi: () => [...otherQK.all(), 'pi'],
	orderDescriptionByOrderNumber: (orderNumber) => [
		...otherQK.all(),
		'order-description-by-order-number',
		orderNumber,
	],
	orderPropertiesByTypeName: (typeName) => [
		...otherQK.all(),
		'properties-by-type-name',
		typeName,
	],
	orderNumberByMarketingAndPartyUUID: (marketingUUID, partyUUID) => [
		...otherQK.all(),
		'number-by-marketing-and-party',
		marketingUUID,
		partyUUID,
	],
	marketingUser: () => [...otherQK.all(), 'marketing-user'],
	merchandiserByPartyUUID: (uuid) => [
		...otherQK.all(),
		'merchandiser-by-party',
		uuid,
	],
	factoryByPartyUUID: (uuid) => [...otherQK.all(), 'factory-by-party', uuid],
};
