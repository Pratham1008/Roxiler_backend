import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from '../common/roles';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    public usersRepository: Repository<User>,
  ) {}

  async createUser(data: CreateUserDto | Partial<User>) {
    if (!data.password) {
      throw new BadRequestException('Password is required');
    }
    if (!data.email) {
      throw new BadRequestException('Email is required');
    }

    const existing = await this.usersRepository.findOne({
      where: { email: data.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(data.password, 10);
    const user = this.usersRepository.create({ ...data, password: hashed });

    const savedUser = await this.usersRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = savedUser;
    return safeUser;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.findByEmail(updateUserDto.email);
      if (existing) {
        throw new ConflictException('Email is already in use.');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = this.usersRepository.merge(user, updateUserDto);
    await this.usersRepository.save(updatedUser);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = updatedUser;
    return safeUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string, relations: string[] = []): Promise<User> {
    const u = await this.usersRepository.findOne({ where: { id }, relations });
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return {
      success: true,
      message: `User with ID ${id} successfully deleted.`,
    };
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<User> {
    await this.usersRepository.update(userId, { password: hashedPassword });
    return this.findById(userId);
  }

  async findAll(filter?: {
    name?: string;
    email?: string;
    address?: string;
    role?: UserRole;
  }) {
    const qb = this.usersRepository.createQueryBuilder('user');
    if (filter?.name)
      qb.andWhere('user.name ILIKE :name', { name: `%${filter.name}%` });
    if (filter?.email)
      qb.andWhere('user.email ILIKE :email', { email: `%${filter.email}%` });
    if (filter?.address)
      qb.andWhere('user.address ILIKE :address', {
        address: `%${filter.address}%`,
      });
    if (filter?.role) qb.andWhere('user.role = :role', { role: filter.role });
    qb.orderBy('user.name', 'ASC');

    const users = await qb.getMany();
    return users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safeUser } = user;
      return safeUser;
    });
  }
}
