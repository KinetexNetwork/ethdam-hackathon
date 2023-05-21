import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { BigNumber, ethers } from 'ethers'
import { Model } from 'mongoose'
import { KinetexRewards } from 'src/typechain'
import {
	ERC721Metadata,
	getAlchemyKey,
	getAlchemyName,
	getAmbassadorAddress,
	getChainId,
	getImage,
	getImageAmbassador,
	getLevel,
	getLevelAmbassador,
	getRewardsAddress,
} from './helpers'
import { NftModel } from './nft.model'
import {
	AMBASSADOR_DESCRIPTION,
	REWARDS_DESCRIPTION,
} from 'src/constants/metadata'
import { KinetexAmbassador } from 'src/typechain/KinetexAmbassador'

import * as rewardsDeployment from '../deployments/mumbai/KinetexRewards.json'
import * as ambassadorDeployment from '../deployments/mumbai/KinetexAmbassador.json'

@Injectable()
export class NftService {
	rewards: KinetexRewards
	ambassador: KinetexAmbassador
	provider: ethers.providers.JsonRpcProvider
	signer: ethers.Signer
	wallet: ethers.Wallet

	constructor(
		@InjectModel(NftModel.name)
		private readonly nftModel: Model<NftModel>,
		private configService: ConfigService
	) {
		const chain = configService.get('CHAIN')

		this.provider = new ethers.providers.AlchemyProvider(
			{ name: getAlchemyName(chain), chainId: getChainId(chain) },
			getAlchemyKey(chain, configService)
		)

		this.wallet = new ethers.Wallet(
			configService.get('ETH_PK'),
			this.provider
		)

		this.signer = this.wallet.connect(this.provider)

		this.rewards = new ethers.Contract(
			getRewardsAddress(chain),
			rewardsDeployment.abi,
			this.signer
		) as KinetexRewards

		this.ambassador = new ethers.Contract(
			getAmbassadorAddress(chain),
			ambassadorDeployment.abi,
			this.signer
		) as KinetexAmbassador
	}

	async grantReward(
		to: string,
		attribute: string,
		nonce: string
	): Promise<string> {
		const message = ethers.utils.solidityPack(
			['address', 'uint256', 'uint256'],
			[to, BigNumber.from(attribute), BigNumber.from(nonce)]
		)
		const hash = ethers.utils.solidityKeccak256(['bytes'], [message])
		return await this.signer.signMessage(ethers.utils.arrayify(hash))
	}

	async getAmbassadorMetadata(tokenId: number) {
		const description = AMBASSADOR_DESCRIPTION

		const nft = await this.nftModel.findOne({
			tokenId,
			type: 'KinetexAmbassador',
		})

		if (nft) {
			const levelName = getLevelAmbassador(nft.level)

			return {
				image: getImageAmbassador(nft.level, nft.levelId),
				name: `${levelName} #${nft.levelId}`,
				description,
				attributes: [
					{
						key: 'level',
						trait_type: 'LEVEL',
						value: levelName,
					},
				],
			} as ERC721Metadata
		}

		const token = BigNumber.from(tokenId.toString())

		try {
			const owner = await this.ambassador.ownerOf(token)

			if (owner !== ethers.constants.AddressZero) {
				const level = await this.ambassador.getLevel(token)
				const levelName = getLevelAmbassador(level)
				const levelId = (
					await this.ambassador.levelId(token)
				).toNumber()

				await this.nftModel.create({
					owner,
					tokenId,
					type: 'KinetexAmbassador',
					level,
					levelId,
				})

				return {
					image: getImageAmbassador(level, levelId),
					name: `${levelName} #${levelId}`,
					description,
					attributes: [
						{
							key: 'level',
							trait_type: 'LEVEL',
							value: levelName,
						},
					],
				} as ERC721Metadata
			}
		} catch (error) {}

		return {
			image: getImageAmbassador(0, 0),
			name: `JUNIOR #${0}`,
			description,
			attributes: [
				{
					key: 'level',
					trait_type: 'LEVEL',
					value: 'JUNIOR',
				},
			],
		} as ERC721Metadata
	}

	async getRewardsMetadata(tokenId: number) {
		const nft = await this.nftModel.findOne({
			tokenId,
			type: 'KinetexRewards',
		})
		const getImageLink = (level: number) => `ipfs://${getImage(level)}`
		const description = REWARDS_DESCRIPTION

		if (nft) {
			const level = getLevel(nft.level)

			return {
				image: getImageLink(nft.level),
				name: level,
				description,
				attributes: [
					{
						key: 'dust',
						trait_type: 'DUST',
						value: nft.dust.toString(),
					},
					{
						key: 'level',
						trait_type: 'LEVEL',
						value: level,
					},
				],
			} as ERC721Metadata
		}

		const attributes = await this.rewards.getAttributes(
			BigNumber.from(tokenId)
		)

		const level = getLevel(attributes.level)
		const image = getImageLink(attributes.level)

		if (attributes.dust.gt(BigNumber.from('0'))) {
			const owner = await this.rewards.ownerOf(BigNumber.from(tokenId))

			const nft = await this.nftModel.create({
				tokenId,
				dust: attributes.dust.toNumber(),
				level: attributes.level,
				owner,
			})

			return {
				image: image,
				name: level,
				description,
				attributes: [
					{
						key: 'dust',
						trait_type: 'DUST',
						value: nft.dust.toString(),
					},
					{
						key: 'level',
						trait_type: 'LEVEL',
						value: level,
					},
				],
			} as ERC721Metadata
		}

		return {
			image: image,
			name: level,
			description,
			attributes: [
				{
					key: 'dust',
					trait_type: 'DUST',
					value: 0,
				},
				{
					key: 'level',
					trait_type: 'LEVEL',
					value: level,
				},
			],
		} as ERC721Metadata
	}
}
