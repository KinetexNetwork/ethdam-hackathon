import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { NftModule } from 'src/nft/nft.module'
import { RewardSettingsModule } from 'src/reward-settings/reward-settings.module'
import { UserController } from './order.controller'
import { UserModel, UserSchema } from './order.model'
import { UserService } from './user.service'

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: UserModel.name, schema: UserSchema },
		]),
		RewardSettingsModule,
		NftModule,
	],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}
