import { ValueWithDecimal } from '../helpers'

class ValueWithDecimalInterface implements ValueWithDecimal {
	readonly v: string
	readonly d: number
}

export class GetVolumeDTO {
	readonly volume: ValueWithDecimalInterface
	readonly count: number
	readonly isEligible: boolean
	readonly usdVolumeToActivate: number
	readonly swapsToActivate: number
}
