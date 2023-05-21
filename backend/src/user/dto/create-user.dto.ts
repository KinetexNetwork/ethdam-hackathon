import { UserInterface } from '../order.interface'

export class CreateUserDTO implements Pick<UserInterface, 'address'> {
	readonly address: string
	readonly signedMessage: string
	readonly referrer?: string
}
