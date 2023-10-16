import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from './user.decorators';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/strategy';


@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getMe(@User('sub') userId: number) {
    const user = await this.userService.getWithBookmarks(userId);

    return user;
  }
}
