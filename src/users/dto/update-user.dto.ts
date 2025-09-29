import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { UserRole } from '../../common/roles';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  role: UserRole;
}
