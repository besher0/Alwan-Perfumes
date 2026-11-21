import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { verifyPassword } from './password';

@Injectable()
export class AuthService {
  // Basic per-process login protection. Use edge rate limiting for distributed production deployments.
  private failed = new Map<string,{count:number,until:number}>();
  constructor(private db: PrismaService, private jwt: JwtService) {}
  async login(username: string, password: string, ip='unknown') {
    const key=`${ip}:${username.trim().toLowerCase()}`;const now=Date.now();
    const a=this.failed.get(key);
    if(a&&a.until>now&&a.count>=8)
      throw new HttpException('محاولات دخول كثيرة، حاول لاحقًا',HttpStatus.TOO_MANY_REQUESTS);
    if(a&&a.until<=now)this.failed.delete(key);
    const user = await this.db.ownerUser.findUnique({ where: { username: username.trim() } });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      const old=this.failed.get(key);
      this.failed.set(key,{count:(old?.count||0)+1,until:old?.until||now+15*60*1000});
      throw new UnauthorizedException('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
    this.failed.delete(key);
    return { accessToken: await this.jwt.signAsync({ sub: user.id, role: 'owner' }), owner: { id: user.id, username: user.username } };
  }
}
