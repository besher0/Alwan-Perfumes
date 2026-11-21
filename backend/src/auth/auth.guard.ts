import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{ headers: { authorization?: string }; user?: any }>();
    const match = /^Bearer (.+)$/i.exec(req.headers.authorization || '');
    if (!match) throw new UnauthorizedException('يرجى تسجيل الدخول');
    try {
      const payload = await this.jwt.verifyAsync<{sub: string; role: string}>(match[1]!);
      if (payload.role !== 'owner' || !payload.sub) throw new Error('Invalid role');
      req.user = payload;
      return true;
    } catch { throw new UnauthorizedException('انتهت الجلسة أو رمز الدخول غير صالح'); }
  }
}
