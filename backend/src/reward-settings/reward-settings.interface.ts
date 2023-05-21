export type TimePeriodRewards = { [key: number]: string }

export interface RewardSettingsInterface {
	readonly perWeek: TimePeriodRewards
	readonly perReferral: number
	readonly usdVolumeToActivate: number
	readonly swapsToActivate: number
	readonly registerMessage: string
	readonly mintingPaused: boolean
	readonly stopRewardsDate: Date
}
