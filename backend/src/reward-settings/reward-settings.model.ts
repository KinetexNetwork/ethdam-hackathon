import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import {
	RewardSettingsInterface,
	TimePeriodRewards,
} from './reward-settings.interface'
import { Document } from 'mongoose'

@Schema({
	collection: 'reward-settings',
	timestamps: true,
	capped: { size: 2056, max: 1 },
})
export class RewardSettingsModel
	extends Document
	implements RewardSettingsInterface
{
	@Prop({ required: true, type: Object })
	perWeek: TimePeriodRewards

	@Prop({ required: true })
	perReferral: number

	@Prop({ required: true })
	usdVolumeToActivate: number

	@Prop({ required: true })
	swapsToActivate: number

	@Prop({ required: true })
	registerMessage: string

	@Prop({ required: true })
	mintingPaused: boolean

	@Prop({ required: false })
	stopRewardsDate: Date
}

export const RewardSettingsSchema =
	SchemaFactory.createForClass(RewardSettingsModel)
