import { Controller, Get, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { MintingDisabledDTO } from './dto/minting-disabled.dto'
import { RegisterMessageDTO } from './dto/register-message.dto'
import { RewardSettingsService } from './reward-settings.service'

@ApiTags('settings')
@Controller('reward-settings')
export class RewardSettingsController {
	constructor(
		private readonly rewardSettingsService: RewardSettingsService
	) {}

	@ApiOperation({
		summary:
			'Gets the message that needs to be signed to validate the user',
	})
	@ApiResponse({
		status: HttpStatus.OK,
		type: RegisterMessageDTO,
		description: 'Message to sign',
	})
	@ApiResponse({
		status: HttpStatus.SERVICE_UNAVAILABLE,
		description: 'Settings not defined',
	})
	@Get('/message')
	async getUserData() {
		return await this.rewardSettingsService.getRegisterMessage()
	}

	@ApiOperation({
		summary: 'Returns whether minting is live or not',
	})
	@ApiResponse({
		status: HttpStatus.OK,
		type: MintingDisabledDTO,
		description: 'Minting status',
	})
	@ApiResponse({
		status: HttpStatus.SERVICE_UNAVAILABLE,
		description: 'Settings not defined',
	})
	@Get('/minting-disabled')
	async getMintingDisabled() {
		return await this.rewardSettingsService.getMintingDisabled()
	}
}
