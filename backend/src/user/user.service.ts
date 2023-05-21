import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import axios, { AxiosInstance } from 'axios'
import { ethers } from 'ethers'
import { Model } from 'mongoose'
import { RewardSettingsService } from 'src/reward-settings/reward-settings.service'
import { SwapV3 } from 'src/types/kinetexV3'
import { UserModel } from './order.model'
import { PriceListMeta } from 'src/types/kinetexMeta'
import { TokenCrypto, TokenListCrypto } from 'src/types/kinetexCrypto'
import {
	Crew3Level,
	getLastWeekUsdVolume,
	getLevelFromCrew3,
	getSwapRewards,
	getSwapsByWeek,
} from './helpers'
import { UserInfoDTO } from './dto/user-info.dto'
import { GetRewardsDTO, ReferralRewards } from './dto/get-rewards.dto'
import { GetVolumeDTO } from './dto/get-volume.dto'
import { NftService } from 'src/nft/nft.service'
import {
	AmbassadorSignaturesDTO,
	RewardSignaturesDTO,
} from './dto/get-signatures.dto'
import * as dayjs from 'dayjs'

@Injectable()
export class UserService {
	kinetexV3Client: AxiosInstance
	kinetexMetaClient: AxiosInstance
	kinetexCryptoClient: AxiosInstance
	crew3Client: AxiosInstance

	constructor(
		@InjectModel(UserModel.name)
		private readonly userModel: Model<UserModel>,
		private rewardSettingsService: RewardSettingsService,
		private nftService: NftService,
		private configService: ConfigService
	) {
		this.kinetexV3Client = axios.create({
			baseURL: this.configService.get<string>('KINETEX_V3_BASE_URL'),
			headers: {
				'E-Authorization':
					this.configService.get<string>('KINETEX_API_V3_KEY'),
			},
		})
		this.kinetexMetaClient = axios.create({
			baseURL: this.configService.get<string>('KINETEX_META_BASE_URL'),
			headers: {
				accept: 'application/json',
			},
		})
		this.kinetexCryptoClient = axios.create({
			baseURL: this.configService.get<string>('KINETEX_CRYPTO_BASE_URL'),
			headers: {
				accept: 'application/json',
			},
		})
		this.crew3Client = axios.create({
			baseURL: this.configService.get<string>('CREW3_API_BASE_URL'),
			headers: {
				'x-api-key': this.configService.get<string>(
					'CREW3_API_KEY_KINETEX'
				),
			},
		})
	}

	async verifyMessage({ message, address, signature }) {
		try {
			const signerAddr = ethers.utils.verifyMessage(message, signature)
			if (signerAddr !== address) {
				return false
			}
			return true
		} catch (err) {
			return false
		}
	}

	async getSwaps(bountyId: string) {
		const user = await this.getByBountyId(bountyId)
		return (
			await this.kinetexV3Client.get(`addresses/${user.address}/swaps`)
		).data
	}

	async getSwapsByAddress(address: string) {
		const swaps: SwapV3[] = (
			await this.kinetexV3Client.get(`addresses/${address}/swaps`)
		).data.swaps

		return swaps
	}

	async getCrew3User(address: string) {
		const crew3Info = await this.crew3Client.get(
			`users?ethAddress=${address}`
		)

		return crew3Info.data
	}

	async getPrices() {
		const prices: PriceListMeta = (
			await this.kinetexMetaClient.get('prices/list?fiat=usd')
		).data

		return prices
	}

	async getTokens() {
		const prices: TokenListCrypto = (
			await this.kinetexCryptoClient.get('tokens/')
		).data

		return prices.tokens
	}

	async getUsdVolumeLastWeekByAddress(address: string) {
		const promises = [
			this.getSwapsByAddress(address),
			this.getPrices(),
			this.getTokens(),
		]

		// @ts-ignore
		const [swaps, prices, tokens]: [
			SwapV3[],
			PriceListMeta,
			TokenCrypto[]
		] = await Promise.all(promises)

		const { usdVolumeToActivate, swapsToActivate } =
			await this.rewardSettingsService.getRewardSettings()

		if (swaps.length === 0) {
			return {
				volume: { v: '0', d: 1 },
				count: 0,
				isEligible:
					BigInt(0) >= BigInt(usdVolumeToActivate) &&
					0 >= swapsToActivate,
				usdVolumeToActivate,
				swapsToActivate,
			} as GetVolumeDTO
		}

		const { volume, count } = getLastWeekUsdVolume(swaps, prices, tokens)
		const usdVolume = BigInt(volume.v) / BigInt(10) ** BigInt(volume.d)
		const isEligible =
			usdVolume >= BigInt(usdVolumeToActivate) && count >= swapsToActivate

		return {
			volume,
			count,
			isEligible,
			usdVolumeToActivate,
			swapsToActivate,
		} as GetVolumeDTO
	}

	async getRewardsByBountyId(bountyId: string) {
		const user = await this.getByBountyId(bountyId)

		if (user) {
			return await this.getRewardsByAddress(user.address)
		}

		return new HttpException('User not found', HttpStatus.NOT_FOUND)
	}

	async getRewardsByAddress(address: string) {
		const user = await this.getByAddress(address)
		const swaps = await this.getSwapsByAddress(address)
		const rewardSettings =
			await this.rewardSettingsService.getRewardSettings()

		const totalReferrals = await this.getReferralsCountByAddress(address)
		const activeReferrals = await this.getActiveReferralsByAddress(address)
		const crew3User = await this.getCrew3User(address)

		const crew3Level = crew3User?.level || 0
		const crew3Rewards = crew3User?.xp || 0

		const level = getLevelFromCrew3(crew3Level)

		if (
			(crew3User?.level || crew3User?.xp) &&
			(crew3Level !== user.crew3Level ||
				crew3Rewards !== user.crew3Rewards)
		) {
			await user.update({
				$set: {
					crew3Level,
					crew3Rewards,
				},
			})
		}

		const referralRewards: ReferralRewards = {
			totalRewards: activeReferrals.length * rewardSettings.perReferral,
			totalReferrals,
			activeReferrals: activeReferrals.length,
			referrals: activeReferrals.map((referral) => ({
				address: referral.address,
				createdAt: referral.activatedAt.toString(),
			})),
		}

		if (swaps.length === 0) {
			return {
				totalRewards:
					referralRewards.totalRewards -
					user.rewardsSpent +
					user.crew3Rewards,
				referralRewards: referralRewards,
				swapRewards: {
					totalRewards: 0,
					totalSwaps: 0,
					weekly: {},
				},
				crew3Level,
				crew3Rewards,
				spentRewards: user.rewardsSpent,
				level,
			} as GetRewardsDTO
		}

		const { swapsByWeek } = getSwapsByWeek(
			swaps,
			rewardSettings.stopRewardsDate
		)
		const { swapRewards } = getSwapRewards(
			swapsByWeek,
			rewardSettings.perWeek
		)

		const totalRewards =
			swapRewards.totalRewards +
			crew3Rewards +
			referralRewards.totalRewards -
			user.rewardsSpent

		return {
			totalRewards,
			referralRewards,
			swapRewards,
			crew3Level,
			crew3Rewards,
			spentRewards: user.rewardsSpent,
			level,
		} as GetRewardsDTO
	}

	async grantReward(bountyId: string) {
		const { mintingPaused } =
			await this.rewardSettingsService.getRewardSettings()

		if (mintingPaused) {
			return new HttpException(
				'MINTING PAUSED',
				HttpStatus.SERVICE_UNAVAILABLE
			)
		}

		const user = await this.getByBountyId(bountyId)

		if (user.rewardSignatures.length > 0) {
			return {
				rewardSignatures: [user.rewardSignatures[0]],
				nonce: user.nonce,
			} as RewardSignaturesDTO
		}

		if (!user) {
			return new HttpException('NOT FOUND', HttpStatus.NOT_FOUND)
		}

		const to = user.address
		const spentRewards = user?.rewardsSpent || 0
		const nonce = user?.nonce || 0

		const { totalRewards } = await this.getRewardsByAddress(to)
		const dust = totalRewards

		if (dust <= 0) {
			return new HttpException('EMPTY BALANCE', HttpStatus.BAD_REQUEST)
		}

		const signature = await this.nftService.grantReward(
			to,
			dust.toString(),
			nonce.toString()
		)

		const sigObject = {
			to,
			dust: dust.toString(),
			nonce,
			signature,
		}

		await user.update({
			$push: {
				rewardSignatures: sigObject,
			},
			$set: {
				rewardsSpent: spentRewards + dust,
				nonce: nonce + 1,
			},
		})

		return {
			rewardSignatures: [sigObject],
			nonce: nonce,
		} as RewardSignaturesDTO
	}

	async grantAmbassador(bountyId: string) {
		const { mintingPaused } =
			await this.rewardSettingsService.getRewardSettings()

		if (mintingPaused) {
			return new HttpException(
				'MINTING PAUSED',
				HttpStatus.SERVICE_UNAVAILABLE
			)
		}

		const user = await this.getByBountyId(bountyId)

		if (user.ambassadorSignatures.length > 0) {
			return {
				ambassadorSignatures: [user.ambassadorSignatures[0]],
				nonce: user.nonce,
			} as AmbassadorSignaturesDTO
		}

		if (!user) {
			return new HttpException('NOT FOUND', HttpStatus.NOT_FOUND)
		}

		const to = user.address
		const crew3Level = user?.crew3Level || 0
		const nonce = user?.nonce || 0

		if (crew3Level <= Crew3Level.NOT_ELIGIBLE) {
			return new HttpException('NOT ELIGIBLE', HttpStatus.BAD_REQUEST)
		}

		const level = getLevelFromCrew3(crew3Level)

		const signature = await this.nftService.grantReward(
			to,
			level.toString(),
			nonce.toString()
		)

		const sigObject = {
			to,
			level: level.toString(),
			nonce,
			signature,
		}

		await user.update({
			$push: {
				ambassadorSignatures: sigObject,
			},
			$set: {
				nonce: nonce + 1,
			},
		})

		return {
			ambassadorSignatures: [sigObject],
			nonce: nonce,
		} as AmbassadorSignaturesDTO
	}

	async register(address: string, referrer: string, signedMessage: string) {
		const { registerMessage, stopRewardsDate } =
			await this.rewardSettingsService.getRewardSettings()

		if (
			await this.verifyMessage({
				message: registerMessage,
				address,
				signature: signedMessage,
			})
		) {
			const user = await this.getByAddress(address)

			if (!user) {
				const salted = address + 's7'
				const bountyId = ethers.utils.sha256(
					ethers.utils.toUtf8Bytes(salted)
				)
				const referrerSet = referrer && referrer !== ''
				const rewardsLive = dayjs().isBefore(stopRewardsDate)

				if (referrerSet && rewardsLive) {
					const referringUser = await this.getByAddress(referrer)

					if (referringUser) {
						await referringUser.update({
							$addToSet: { referrals: address },
						})
					}
				}

				const { isEligible } = await this.getUsdVolumeLastWeekByAddress(
					address
				)

				return await this.userModel.create({
					referrer: referrerSet ? referrer : null,
					address,
					bountyId,
					referrals: [],
					isActive: isEligible,
					activatedAt: Date.now(),
					rewardsSpent: 0,
					crew3Level: 0,
					crew3Rewards: 0,
					rewardSignatures: [],
					ambassadorSignatures: [],
				})
			}

			return user
		}

		return new HttpException(
			'Sign in message signature mismatch',
			HttpStatus.FORBIDDEN
		)
	}

	async getByBountyId(bountyId: string) {
		return await this.userModel.findOne({
			bountyId,
		})
	}

	async useRewardSignature(bountyId: string, nonce: number) {
		const user = await this.getByBountyId(bountyId)

		if (user) {
			const signatures = user.rewardSignatures

			return await user.update({
				$set: {
					rewardSignatures: signatures.map((el) =>
						el.nonce == nonce ? { ...el, used: true } : el
					),
				},
			})
		}

		return new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND)
	}

	async useAmbassadorSignature(bountyId: string, nonce: number) {
		const user = await this.getByBountyId(bountyId)

		if (user) {
			const signatures = user.ambassadorSignatures

			return await user.update({
				$set: {
					ambassadorSignatures: signatures.map((el) =>
						el.nonce == nonce ? { ...el, used: true } : el
					),
				},
			})
		}

		return new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND)
	}

	async getUserInfo(bountyId: string) {
		const user = await this.getByBountyId(bountyId)

		if (user) {
			const {
				address,
				referrer,
				referrals,
				bountyId,
				rewardsSpent,
				rewardSignatures,
				ambassadorSignatures,
				nonce,
				isActive,
				crew3Level,
				crew3Rewards,
			} = user

			const rSig = rewardSignatures.filter((el) => !el?.used).slice(0, 1)
			const aSig = ambassadorSignatures
				.filter((el) => !el?.used)
				.slice(0, 1)

			return {
				address,
				bountyId,
				referrals,
				rewardsSpent,
				referrer,
				rewardSignatures: rSig,
				ambassadorSignatures: aSig,
				nonce,
				isActive,
				crew3Level,
				crew3Rewards,
			} as UserInfoDTO
		}

		return new HttpException('User not found', HttpStatus.NOT_FOUND)
	}

	async getByAddress(address: string) {
		return await this.userModel.findOne({
			address,
		})
	}

	async activate(bountyId: string) {
		const user = await this.getByBountyId(bountyId)

		if (user.isActive) {
			return new HttpException(
				'User already active',
				HttpStatus.AMBIGUOUS
			)
		}

		if (user) {
			const { isEligible } = await this.getUsdVolumeLastWeekByAddress(
				user.address
			)

			if (isEligible) {
				const {
					address,
					referrer,
					referrals,
					bountyId,
					rewardsSpent,
					isActive,
					rewardSignatures,
					ambassadorSignatures,
					nonce,
					crew3Rewards,
					crew3Level,
				} = await user.update({
					$set: { isActive: true, activatedAt: Date.now() },
				})

				const info: UserInfoDTO = {
					address,
					bountyId,
					referrals,
					rewardsSpent,
					referrer,
					isActive,
					rewardSignatures,
					ambassadorSignatures,
					nonce,
					crew3Level,
					crew3Rewards,
				}

				return info
			}

			return new HttpException(
				'User not eligible for activation',
				HttpStatus.METHOD_NOT_ALLOWED
			)
		}

		return new HttpException('User not found', HttpStatus.NOT_FOUND)
	}

	async isActive(address: string) {
		const user = await this.getByAddress(address)
		if (user.isActive) {
			return true
		}

		return false
	}

	async getReferralsCountByBountyId(bountyId: string) {
		const user = await this.getByBountyId(bountyId)
		return user.referrals.length
	}

	async getReferralsCountByAddress(address: string) {
		const user = await this.getByAddress(address)
		return user.referrals.length
	}

	async getActiveReferralsByAddress(address: string) {
		const user = await this.getByAddress(address)
		if (user) {
			if (user.referrals.length === 0) {
				return []
			}

			const activeReferrals = await this.userModel.find({
				address: {
					$in: user.referrals,
				},
				isActive: true,
			})

			return activeReferrals
		}
	}
}
