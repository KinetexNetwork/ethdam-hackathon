import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RewardSettingsController } from './reward-settings.controller'
import {
	RewardSettingsModel,
	RewardSettingsSchema,
} from './reward-settings.model'
import { RewardSettingsService } from './reward-settings.service'

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: RewardSettingsModel.name, schema: RewardSettingsSchema },
		]),
	],
	controllers: [RewardSettingsController],
	providers: [RewardSettingsService],
	exports: [RewardSettingsService],
})
export class RewardSettingsModule {}
