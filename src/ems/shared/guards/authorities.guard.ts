import { IReqWithEmployeeCredentials } from '../interfaces/IReqWithEmployeeCredentials';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { Authority } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

export const AuthoritiesGuard = (authorities?: Authority[]): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);
      const request = context.switchToHttp().getRequest<IReqWithEmployeeCredentials>();
      const employee = request.user;

      if(!authorities) {
        return true;
      }

      if(employee.authority === Authority.ROOT) {
        return true;
      }

      const userHasAuthority = authorities.filter(authority => authority === employee.authority);
      if(userHasAuthority.length >= 1) {
        return true;
      }
      return false;
    }
  }
  return mixin(RoleGuardMixin);
}