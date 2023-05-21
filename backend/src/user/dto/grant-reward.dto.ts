import { UserInterface } from '../order.interface'

export class GrantRewardDTO implements Pick<UserInterface, 'address'> {
	readonly address: string
	readonly signedMessage: string
}
