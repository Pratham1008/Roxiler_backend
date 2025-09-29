import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  Matches,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @Length(20, 60, { message: 'Name must be between 20 and 60 characters' })
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(400)
  address?: string;

  @IsString()
  @Length(8, 16, { message: 'Password must be 8-16 characters' })
  @Matches(/(?=.*[A-Z])(?=.*[^A-Za-z0-9])/, {
    message:
      'Password must contain at least one uppercase letter and one special character',
  })
  password: string;
}
