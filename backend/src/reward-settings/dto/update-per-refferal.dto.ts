import { RewardSettingsInterface } from '../reward-settings.interface'

export class UpdateRewardsPerReferralDTO
	implements Pick<RewardSettingsInterface, 'perReferral'>
{
	readonly perReferral: number
}
