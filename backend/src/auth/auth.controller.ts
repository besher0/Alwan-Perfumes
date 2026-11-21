import { Body, Controller, Post, Req } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { AuthService } from './auth.service';

class LoginDto {
  @IsString() @MinLength(2) @MaxLength(100) username!: string;
  @IsString() @MinLength(8) password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}
  @Post('login') login(@Body() dto: LoginDto, @Req() req:{ip?:string}) { return this.service.login(dto.username, dto.password, req.ip); }
}
