import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { NftController } from './nft.controller'
import { NftModel, NftSchema } from './nft.model'
import { NftService } from './nft.service'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: NftModel.name, schema: NftSchema }]),
		ConfigModule,
	],
	controllers: [NftController],
	providers: [NftService],
	exports: [NftService],
})
export class NftModule {}
