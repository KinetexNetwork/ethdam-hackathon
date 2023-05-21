import { Controller, Get, HttpStatus, Param } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { MetadataDTO } from './dto/metadata.dto'
import { NftService } from './nft.service'

@Controller('nft')
@ApiTags('nft')
export class NftController {
	constructor(private readonly nftService: NftService) {}

	@ApiOperation({
		summary: 'Returns metadata for a given KinetexAmbassador tokenId',
	})
	@ApiResponse({
		status: HttpStatus.OK,
		type: MetadataDTO,
		description: 'Token metadata',
	})
	@Get('/ambassador/metadata/:tokenId')
	async getAmbassadorMetadata(@Param('tokenId') tokenId: number) {
		return this.nftService.getAmbassadorMetadata(tokenId)
	}

	@ApiOperation({
		summary: 'Returns metadata for a given KinetexRewards tokenId',
	})
	@ApiResponse({
		status: HttpStatus.OK,
		type: MetadataDTO,
		description: 'Token metadata',
	})
	@Get('/rewards/metadata/:tokenId')
	async getRewardsMetadata(@Param('tokenId') tokenId: number) {
		return this.nftService.getRewardsMetadata(tokenId)
	}
}
