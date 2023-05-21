export type SupportedCollections = 'KinetexRewards' | 'KinetexAmbassador'

export interface NftInterface {
	readonly tokenId: number
	readonly owner: string
	readonly dust: number
	readonly level: number
	readonly levelId: number
	readonly type: SupportedCollections
}
