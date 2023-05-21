import { ApiProperty } from '@nestjs/swagger'
import { SwapRewards, WeeklySwapReward } from '../helpers'

export interface ReferralInfo {
	address: string
	createdAt: string
}

class ReferralInfoDTO implements ReferralInfo {
	readonly address: string
	readonly createdAt: string
}

export interface ReferralRewards {
	totalRewards: number
	totalReferrals: number
	activeReferrals: number
	referrals: ReferralInfo[]
}

class ReferralRewardsDTO implements ReferralRewards {
	readonly totalRewards: number
	readonly totalReferrals: number
	readonly activeReferrals: number
	@ApiProperty({
		isArray: true,
		type: ReferralInfoDTO,
	})
	readonly referrals: ReferralInfoDTO[]
}

class WeekRewardDTO implements WeeklySwapReward {
	readonly swapCount: number
	readonly rewards: number
	readonly startDate: string
	readonly endDate: string
}

class SwapRewardsDTO implements SwapRewards {
	readonly totalRewards: number
	readonly totalSwaps: number
	@ApiProperty({
		type: 'object',
		additionalProperties: {
			type: 'object',
			properties: {
				swapCount: { type: 'number' },
				rewards: { type: 'number' },
				startDate: { type: 'string' },
				endDate: { type: 'string' },
			},
		},
	})
	readonly weekly: Record<number, WeekRewardDTO>
}

export class GetRewardsDTO {
	readonly totalRewards: number
	readonly referralRewards: ReferralRewardsDTO
	readonly swapRewards: SwapRewardsDTO
	readonly spentRewards: number
	readonly crew3Rewards: number
	readonly crew3Level: number
	readonly level: number
}
