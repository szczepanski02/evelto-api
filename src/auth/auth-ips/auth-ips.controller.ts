import { Controller } from '@nestjs/common';
import { AuthIpsService } from './auth-ips.service';

@Controller('auth-ips')
export class AuthIpsController {
  constructor(private readonly authIpsService: AuthIpsService) {}
}
