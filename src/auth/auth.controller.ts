import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, SignUpDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() dto: SignUpDto) {
    return (await this.authService.signUp(dto));
  }

  @Post('signin')
  async signIn(@Body() dto: AuthDto) {
    return (await this.authService.signIn(dto));
  }
}
