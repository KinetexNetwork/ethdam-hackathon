import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { getMongoConfig } from 'config/db-connect.config'
import { UserModule } from './user/user.module'
import { RewardSettingsModule } from './reward-settings/reward-settings.module'
import { NftModule } from './nft/nft.module'
@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: `.env`,
			isGlobal: true,
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		UserModule,
		RewardSettingsModule,
		NftModule,
	],
})
export class AppModule {}
