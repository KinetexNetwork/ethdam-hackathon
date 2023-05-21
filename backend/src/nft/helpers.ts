import { ConfigService } from '@nestjs/config'
import {
	AMBASSADOR_BASE,
	AMBASSADOR_JUNIOR_IMAGE_COUNT,
	AMBASSADOR_LEGENDARY_IMAGE_COUNT,
	AMBASSADOR_MAGISTER_IMAGE_COUNT,
	AMBASSADOR_MASTER_IMAGE_COUNT,
	STONES_0_DUST,
	STONES_1_MINERAL,
	STONES_2_CRYSTAL,
	STONES_3_LIGHTNING,
} from 'src/constants/ipfs'

import * as rewardsDeploymentMumbai from '../deployments/mumbai/KinetexRewards.json'
import * as ambassadorDeploymentMumbai from '../deployments/mumbai/KinetexAmbassador.json'

export const randomIntRange = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1)) + min

export const randomInt = (num: number) => randomIntRange(0, num)

export type ERC721Attributes = {
	key: string
	trait_type: string
	value: string
	[key: string]: string
}

export type ERC721Metadata = {
	image: string
	name: string
	description: string
	attributes: Array<ERC721Attributes>
}

export const getLevel = (level: number) => {
	switch (level) {
		case 3:
			return 'LIGHTNING STONE'

		case 2:
			return 'CRYSTAL STONE'

		case 1:
			return 'MINERAL'

		default:
			return 'CRYSTAL DUST'
	}
}

export const getImage = (level: number) => {
	switch (level) {
		case 3:
			return STONES_3_LIGHTNING

		case 2:
			return STONES_2_CRYSTAL

		case 1:
			return STONES_1_MINERAL

		default:
			return STONES_0_DUST
	}
}

export const getRpc = (chain: string, configService: ConfigService): string => {
	switch (chain) {
		case 'mumbai':
			return configService.get('MUMBAI_RPC')

		default:
			return configService.get('GOERLI_RPC')
	}
}

export const getAlchemyKey = (
	chain: string,
	configService: ConfigService
): string => {
	switch (chain) {
		case 'mumbai':
			return configService.get('MUMBAI_KEY')

		default:
			return configService.get('GOERLI_KEY')
	}
}

export const getChainId = (chain: string): number => {
	switch (chain) {
		case 'mumbai':
			return 80001

		default:
			return 5
	}
}

export const getAlchemyName = (chain: string): string => {
	switch (chain) {
		case 'mumbai':
			return 'maticmum'

		default:
			return 'goerli'
	}
}

export const getRewardsAddress = (chain: string): string => {
	switch (chain) {
		default:
			return rewardsDeploymentMumbai.address
	}
}

export const getAmbassadorAddress = (chain: string): string => {
	switch (chain) {
		default:
			return ambassadorDeploymentMumbai.address
	}
}

export const getLevelAmbassador = (level: number) => {
	switch (level) {
		case 3:
			return 'LEGENDARY'

		case 2:
			return 'MAGISTER'

		case 1:
			return 'MASTER'

		default:
			return 'JUNIOR'
	}
}

export const getImageAmbassador = (level: number, levelId: number) => {
	const makePath = (l: number, lid: number) =>
		`ipfs://${AMBASSADOR_BASE}/${l}/${lid}.JPG`

	switch (level) {
		case 3:
			return makePath(level, levelId % AMBASSADOR_LEGENDARY_IMAGE_COUNT)

		case 2:
			return makePath(level, levelId % AMBASSADOR_MAGISTER_IMAGE_COUNT)

		case 1:
			return makePath(level, levelId % AMBASSADOR_MASTER_IMAGE_COUNT)

		default:
			return makePath(level, levelId % AMBASSADOR_JUNIOR_IMAGE_COUNT)
	}
}
