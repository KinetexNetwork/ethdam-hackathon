import {
	AmbassadorSignature,
	RewardSignature,
	UserInterface,
} from '../order.interface'

export class UserInfoDTO implements UserInterface {
	readonly address: string
	readonly referrer: string
	readonly referrals: string[]
	readonly bountyId: string
	readonly rewardsSpent: number
	readonly isActive: boolean
	readonly rewardSignatures: RewardSignature[]
	readonly ambassadorSignatures: AmbassadorSignature[]
	readonly nonce: number
	readonly crew3Level: number
	readonly crew3Rewards: number
}
