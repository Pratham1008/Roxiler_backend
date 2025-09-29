import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UnauthorizedException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(
    @Request() req: { user: { userId: string } },
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = changePasswordDto;

    return this.authService.changePassword(userId, oldPassword, newPassword);
  }
}
