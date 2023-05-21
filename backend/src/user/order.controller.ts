import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	Post,
	Put,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateOrderDTO } from './dto/create-order.dto'
import { GetRewardsDTO } from './dto/get-rewards.dto'
import {
	AmbassadorSignaturesDTO,
	RewardSignaturesDTO,
} from './dto/get-signatures.dto'
import { GetVolumeDTO } from './dto/get-volume.dto'
import { OrderInfoDTO } from './dto/order-info.dto'
import { OrderService } from './order.service'

@ApiTags('order')
@Controller('order')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	// expects signed message: "Register in Kinetex Bounty System"
	@Post('/register')
	@ApiOperation({
		summary: 'Registers a new order by validating his wallet signature',
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		type: OrderInfoDTO,
		description: 'Order created',
	})
	@ApiResponse({
		status: HttpStatus.FORBIDDEN,
		description: 'Signature mismatch',
	})
	async register(
		@Body() { address, referrer, signedMessage }: CreateOrderDTO
	) {
		return await this.orderService.register(
			address,
			referrer,
			signedMessage
		)
	}

	@Put('/grant-reward/:bountyId')
	@ApiOperation({
		summary:
			'Generates a signature that allows a order to mint reward tokens',
	})
	@ApiResponse({
		status: HttpStatus.OK,
		type: RewardSignaturesDTO,
		description: 'Reward generated succesfully',
	})
	@ApiResponse({
		status: HttpStatus.FORBIDDEN,
		description: 'Signature mismatch',
	})
	@ApiResponse({
		status: HttpStatus.SERVICE_UNAVAILABLE,
		description: 'Minting is paused',
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'No order to reward',
	})
	@ApiResponse({
		status: HttpStatus.BAD_GATEWAY,
		description: 'Order balance is empty',
	})
	async grantReward(@Param('bountyId') bountyId: string) {
		return await this.orderService.grantReward(bountyId)
	}

	@Put('/use-reward/:bountyId/:nonce')
	@ApiOperation({
		summary: 'Marks a signature as used',
	})
	@ApiResponse({
		status: HttpStatus.OK,
		type: RewardSignaturesDTO,
		description: 'Marked successfully',
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'No order to update',
	})
	async useReward(
		@Param('bountyId') bountyId: string,
		@Param('nonce') nonce: number
	) {
		return await this.orderService.useRewardSignature(bountyId, nonce)
	}

	@Put('/grant-ambassador/:bountyId')
	@ApiOperation({
		summary:
			'Generates a signature that allows a order to mint ambassador tokens',
	})
	@ApiResponse({
		status: HttpStatus.OK,
		type: AmbassadorSignaturesDTO,
		description: 'Ambassador generated succesfully',
	})
	@ApiResponse({
		status: HttpStatus.FORBIDDEN,
		description: 'Signature mismatch',
	})
	@ApiResponse({
		status: HttpStatus.SERVICE_UNAVAILABLE,
		description: 'Minting is paused',
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'No order to reward',
	})
	@ApiResponse({
		status: HttpStatus.BAD_GATEWAY,
		description: 'Order balance is empty',
	})
	async grantAmbassador(@Param('bountyId') bountyId: string) {
		return await this.orderService.grantAmbassador(bountyId)
	}

	@Put('/use-ambassador/:bountyId/:nonce')
	@ApiOperation({
		summary: 'Marks a signature as used',
	})
	@ApiResponse({
		status: HttpStatus.OK,
		type: RewardSignaturesDTO,
		description: 'Marked successfully',
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'No order to update',
	})
	async useAmbassador(
		@Param('bountyId') bountyId: string,
		@Param('nonce') nonce: number
	) {
		return await this.orderService.useAmbassadorSignature(bountyId, nonce)
	}

	@ApiOperation({ summary: 'Gets information for a registered order' })
	@ApiResponse({
		status: HttpStatus.OK,
		type: OrderInfoDTO,
		description: 'Order properties',
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Order not found',
	})
	@Get('/info/:bountyId')
	async getOrderData(@Param('bountyId') bountyId: string) {
		return await this.orderService.getOrderInfo(bountyId)
	}

	@ApiOperation({ summary: 'Activates the order if eligible' })
	@ApiResponse({
		status: HttpStatus.OK,
		type: OrderInfoDTO,
		description: 'Order activated',
	})
	@ApiResponse({
		status: HttpStatus.METHOD_NOT_ALLOWED,
		description: 'The order is not eligible for activation',
	})
	@ApiResponse({
		status: HttpStatus.AMBIGUOUS,
		description: 'The order is already activated',
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Order not found',
	})
	@Put('/activate/:bountyId')
	async activate(@Param('bountyId') bountyId: string) {
		return await this.orderService.activate(bountyId)
	}

	@ApiOperation({
		summary: "Analyzes order's trade activity and calculates rewards",
	})
	@ApiResponse({
		status: HttpStatus.OK,
		type: GetRewardsDTO,
		description: 'Requested data',
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Order not found',
	})
	@Get('/rewards/:bountyId')
	async getRewardsByBountyId(@Param('bountyId') bountyId: string) {
		return await this.orderService.getRewardsByBountyId(bountyId)
	}

	@ApiOperation({
		summary: "Gets order's 7 day trade activity and activation eligibility",
	})
	@ApiResponse({
		status: HttpStatus.OK,
		type: GetVolumeDTO,
		description: 'Requested data',
	})
	@Get('/volume/week/:address')
	async getVolumeByAddress(@Param('address') address: string) {
		return await this.orderService.getUsdVolumeLastWeekByAddress(address)
	}
}
