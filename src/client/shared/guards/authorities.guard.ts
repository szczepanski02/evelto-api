import { IAuthorizatedUser } from './../interfaces/IAuthorizatedUser';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

export const AccountTypeGuard = (accountTypes?: AccountType[]): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);
      const request = context.switchToHttp().getRequest<IAuthorizatedUser>();
      const user = request.user;

      if(!accountTypes) {
        return true;
      }

      const userHasAuthority = accountTypes.filter(accountType => accountType === user.accountType);
      if(userHasAuthority.length >= 1) {
        return true;
      }
      return false;
    }
  }
  return mixin(RoleGuardMixin);
}