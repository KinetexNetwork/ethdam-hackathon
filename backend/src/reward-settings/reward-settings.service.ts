import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { LOGIN_MESSAGE } from 'src/constants/messages'
import { MintingDisabledDTO } from './dto/minting-disabled.dto'
import { RegisterMessageDTO } from './dto/register-message.dto'
import { UpdateRewardsPerWeekDTO } from './dto/update-per-week.dto'
import { RewardSettingsModel } from './reward-settings.model'

@Injectable()
export class RewardSettingsService {
	constructor(
		@InjectModel(RewardSettingsModel.name)
		private readonly rewardsSettingsModel: Model<RewardSettingsModel>
	) {
		rewardsSettingsModel.count().then((size) => {
			if (size === 0) {
				this.createRewardSettings()
			}
		})
	}

	async createRewardSettings() {
		return await this.rewardsSettingsModel.create({
			perReferral: 1000,
			perWeek: {
				5: 500,
				10: 1000,
				15: 1500,
				25: 2000,
				35: 2500,
				45: 3000,
				55: 3500,
				100: 4000,
			},
			usdVolumeToActivate: 100,
			swapsToActivate: 5,
			registerMessage: LOGIN_MESSAGE,
			mintingPaused: true,
		})
	}

	async updatePerWeek(settings: UpdateRewardsPerWeekDTO) {
		return await this.rewardsSettingsModel.findOneAndUpdate(
			{},
			{
				$set: { perWeek: settings },
			}
		)
	}

	async updatePerReferral(perReferral: number) {
		return await this.rewardsSettingsModel.findOneAndUpdate(
			{},
			{
				$set: { perReferral },
			}
		)
	}

	async updateActivationVolume(usdVolumeToActivate: number) {
		return await this.rewardsSettingsModel.findOneAndUpdate(
			{},
			{
				$set: { usdVolumeToActivate },
			}
		)
	}

	async updateActivationCount(swapsToActivate: number) {
		return await this.rewardsSettingsModel.findOneAndUpdate(
			{},
			{
				$set: { swapsToActivate },
			}
		)
	}

	async getRegisterMessage() {
		const settings = await this.getRewardSettings()
		if (settings) {
			const { registerMessage } = settings
			return { message: registerMessage } as RegisterMessageDTO
		}

		throw new HttpException(
			'Settings not set',
			HttpStatus.SERVICE_UNAVAILABLE
		)
	}

	async getRewardSettings() {
		return await this.rewardsSettingsModel.findOne()
	}

	async getMintingDisabled() {
		const mintingDisabled = (await this.rewardsSettingsModel.findOne())
			.mintingPaused

		return {
			mintingDisabled,
		} as MintingDisabledDTO
	}
}
