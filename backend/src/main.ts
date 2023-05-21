import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { getMongoConfig } from 'config/db-connect.config'
import { writeFile } from 'fs/promises'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.enableCors()
	const globalPrefix = 'api/v0'
	app.setGlobalPrefix(globalPrefix)

	const config = new DocumentBuilder()
		.setTitle('Kinetex Referral System')
		.setDescription('Kinetex xSwap Referral System API')
		.setVersion('v0.1')
		.build()

	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('/api/v0/docs', app, document)

	const port = process.env.PORT || 3333
	await app.listen(port)
	Logger.log(
		`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
	)

	await writeFile('./public/swagger.json', JSON.stringify(document))
	Logger.log(
		`🪔 Swagger UI is running on: http://localhost:${port}/api/v0/docs`
	)
	Logger.log(
		'📄 OpenAPI documentation file generated at: public/swagger.json'
	)
}

bootstrap()
