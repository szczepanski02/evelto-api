import { Controller } from '@nestjs/common';
import { AuthRequestsService } from './auth-requests.service';

@Controller('auth-requests')
export class AuthRequestsController {
  constructor(private readonly authRequestsService: AuthRequestsService) {}
}
