import { MailerModule } from '@nestjs-modules/mailer'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getMainConfig } from '@/src/core/config/main.config'
import { MailService } from './mail.service'

@Global()
@Module({
	imports: [
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getMainConfig,
			inject: [ConfigService]
		})
	],
	providers: [MailService],
	exports: [MailService]
})
export class MailModule {}
