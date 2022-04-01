import { getLangFromHeader } from '../client/shared/helpers/langHeader';
import { I18nService } from 'nestjs-i18n';
import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(private readonly i18n: I18nService) {}

	async catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const statusCode = exception.getStatus();

		let message = exception.getResponse() as {
			key: string;
			args: Record<string, any>;
		};

		if(!message.key) {
			response.status(statusCode).json({ statusCode, message });
			return;
		}

		message = await this.i18n.translate(message.key, {
			lang: getLangFromHeader(ctx.getRequest()),
			args: message.args,
		});

		response.status(statusCode).json({ statusCode, message });
	}
}