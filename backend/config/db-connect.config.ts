import { ConfigService } from '@nestjs/config'
import { MongooseModuleOptions } from '@nestjs/mongoose'
import { Logger } from '@nestjs/common'
import { writeFile } from 'fs/promises'

const getMongoString = (configService: ConfigService) =>
	'mongodb://' +
	configService.get('DB_HOST') +
	':' +
	configService.get('DB_PORT') +
	'/' +
	configService.get('DB_AUTHDATABASE')

const getMongoOptions = () => ({
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

export const getMongoConfig = async (
	configService: ConfigService
): Promise<MongooseModuleOptions> => {
	Logger.log(`📙 Database URI: ${getMongoString(configService)}`)

	const options = {
		uri: getMongoString(configService),
		...getMongoOptions(),
	}

	await writeFile('.db.json', JSON.stringify(options, null, 4))
	return options
}
