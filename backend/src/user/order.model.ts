import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import {
	OrderInterface
} from './order.interface'
import { Document } from 'mongoose'

@Schema({ collection: 'user', timestamps: true })
export class UserModel extends Document implements UserInterface {
	
}

export const UserSchema = SchemaFactory.createForClass(UserModel)
