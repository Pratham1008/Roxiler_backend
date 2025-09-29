import { IsString, Length, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  @Length(8, 16)
  @Matches(/(?=.*[A-Z])(?=.*[^A-Za-z0-9])/, {
    message:
      'Password must contain at least one uppercase letter and one special character',
  })
  newPassword: string;
}
