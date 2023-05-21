export interface TokenCrypto {
	chain_id: string
	address: string
	symbol: string
	name: string
	icon: string
	decimals: number
	eip2612: boolean
}

export interface TokenListCrypto {
	tokens: TokenCrypto[]
}

export interface BlockchainCrypto {
	symbol: string
	name: string
	chain_id: string
	icon: string
}

export interface BlockchainListCrypto {
	blockchains: BlockchainCrypto[]
}
