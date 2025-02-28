import type { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

export function getMainConfig(configService: ConfigService): MailerOptions {
	return {
		transport: {
			host: configService.getOrThrow<string>('MAILER_HOST'),
			port: configService.getOrThrow<number>('MAILER_PORT'),
			secure: false,
			auth: {
				user: configService.getOrThrow<string>('MAILER_LOGIN'),
				password: configService.getOrThrow<string>('MAILER_PASSWORD')
			},
			defaults: {
				from: `"Notwich"  ${configService.getOrThrow<string>('MAILER_LOGIN')}`
			}
		}
	}
}
