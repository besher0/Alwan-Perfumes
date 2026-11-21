import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OwnerGuard } from './auth.guard';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: 60 * 60 * 12 } })],
  controllers: [AuthController],
  providers: [AuthService, OwnerGuard],
  // Re-export JwtModule so feature modules using @UseGuards(OwnerGuard)
  // can resolve JwtService in their own dependency injection context.
  exports: [OwnerGuard, JwtModule],
})
export class AuthModule {}
