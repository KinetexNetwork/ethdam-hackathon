import {
	RewardSettingsInterface,
	TimePeriodRewards,
} from '../reward-settings.interface'

export class UpdateRewardsPerWeekDTO
	implements Pick<RewardSettingsInterface, 'perWeek'>
{
	readonly perWeek: TimePeriodRewards
}
