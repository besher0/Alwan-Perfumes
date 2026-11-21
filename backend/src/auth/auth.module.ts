import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OwnerGuard } from './auth.guard';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: 60 * 60 * 12 } })],
  controllers: [AuthController],
  providers: [AuthService, OwnerGuard],
  exports: [OwnerGuard],
})
export class AuthModule {}
