export type GetBalanceDictMetaParams = {
	addresses?: string[]
	by?: BalanceDictKeySegmentMeta[]
	glue?: BalanceDictKeyGlueMeta
}

export type GetBalanceListMetaParams = { addresses?: string[] }

export type GetPriceListMetaParams = { fiat?: string }

export type GetFiatListMetaParams = { fiats?: string[] }

export type ValidationErrorMetaLocItem = string | number

export interface ValidationErrorMeta {
	loc: ValidationErrorMetaLocItem[]
	msg: string
	type: string
}

export interface PriceListMeta {
	fiat: FiatInfoMeta
	prices: PriceInfoMeta[]
}

/**
 * An enumeration.
 */
export type PriceDictKeySegmentMeta =
	(typeof PriceDictKeySegmentMeta)[keyof typeof PriceDictKeySegmentMeta]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PriceDictKeySegmentMeta = {
	chain_id: 'chain_id',
	address: 'address',
} as const

/**
 * An enumeration.
 */
export type PriceDictKeyGlueMeta =
	(typeof PriceDictKeyGlueMeta)[keyof typeof PriceDictKeyGlueMeta]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PriceDictKeyGlueMeta = {
	slash: 'slash',
	colon: 'colon',
	plus: 'plus',
	minus: 'minus',
} as const

export type GetPriceDictMetaParams = {
	fiat?: string
	by?: PriceDictKeySegmentMeta[]
	glue?: PriceDictKeyGlueMeta
}

export type PriceDictMetaPrices = { [key: string]: DecimalAmountMeta }

export interface HTTPValidationErrorMeta {
	detail?: ValidationErrorMeta[]
}

/**
 * An enumeration.
 */
export type FiatFormatMeta =
	(typeof FiatFormatMeta)[keyof typeof FiatFormatMeta]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const FiatFormatMeta = {
	sign_amount: 'sign_amount',
	amount_sign: 'amount_sign',
} as const

export interface FiatInfoMeta {
	name: string
	symbol: string
	sign: string
	decimals: number
	separator: string
	format: FiatFormatMeta
}

export interface PriceDictMeta {
	fiat: FiatInfoMeta
	prices: PriceDictMetaPrices
}

export interface FiatListMeta {
	fiats: FiatInfoMeta[]
}

export interface DecimalAmountMeta {
	v: string
	d: number
}

export interface PriceInfoMeta {
	chain_id: string
	address: string
	price: DecimalAmountMeta
}

export interface BalanceInfoMeta {
	address: string
	assets: AssetBalanceMeta[]
}

export interface BalanceListMeta {
	balances: BalanceInfoMeta[]
}

/**
 * An enumeration.
 */
export type BalanceDictKeySegmentMeta =
	(typeof BalanceDictKeySegmentMeta)[keyof typeof BalanceDictKeySegmentMeta]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BalanceDictKeySegmentMeta = {
	chain_id: 'chain_id',
	address: 'address',
} as const

/**
 * An enumeration.
 */
export type BalanceDictKeyGlueMeta =
	(typeof BalanceDictKeyGlueMeta)[keyof typeof BalanceDictKeyGlueMeta]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BalanceDictKeyGlueMeta = {
	slash: 'slash',
	colon: 'colon',
	plus: 'plus',
	minus: 'minus',
} as const

export type BalanceDictMetaBalances = {
	[key: string]: { [key: string]: DecimalAmountMeta }
}

export interface BalanceDictMeta {
	balances: BalanceDictMetaBalances
}

export interface AssetBalanceMeta {
	chain_id: string
	address: string
	balance: DecimalAmountMeta
}
