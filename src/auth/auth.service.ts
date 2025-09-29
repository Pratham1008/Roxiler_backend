import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

type SafeUser = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<SafeUser | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...rest } = user;
    return rest;
  }

  login(user: Pick<User, 'id' | 'email' | 'role'>): { access_token: string } {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean }> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new BadRequestException('User not found');

    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) throw new UnauthorizedException('Old password incorrect');

    const hashed = await this.hashPassword(newPassword);
    await this.usersService.updatePassword(userId, hashed);

    return { success: true };
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
