import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(10, 60, { message: 'Name must be between 20 and 60 characters.' })
  name: string;

  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email: string;

  @IsString()
  @Length(8, 16, { message: 'Password must be between 8 and 16 characters.' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain one uppercase letter and one special character.',
  })
  password: string;

  @IsString()
  @Length(1, 400, { message: 'Address cannot exceed 400 characters.' })
  address: string;
}
