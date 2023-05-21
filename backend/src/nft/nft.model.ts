import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { NftInterface, SupportedCollections } from './nft.interface'
import { Document } from 'mongoose'

@Schema({ collection: 'nft', timestamps: true })
export class NftModel extends Document implements NftInterface {
	@Prop()
	tokenId: number

	@Prop()
	owner: string

	@Prop()
	dust: number

	@Prop()
	level: number

	@Prop()
	levelId: number

	@Prop()
	type: SupportedCollections
}

export const NftSchema = SchemaFactory.createForClass(NftModel)
