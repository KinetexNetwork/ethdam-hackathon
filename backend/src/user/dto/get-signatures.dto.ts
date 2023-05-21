import { AmbassadorSignature, RewardSignature } from '../order.interface'

export class RewardSignaturesDTO {
	readonly rewardSignatures: RewardSignature[]
	readonly nonce: number
}

export class AmbassadorSignaturesDTO {
	readonly ambassadorSignatures: AmbassadorSignature[]
	readonly nonce: number
}
