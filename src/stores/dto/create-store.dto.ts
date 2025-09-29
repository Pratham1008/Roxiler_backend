import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 60)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(400)
  address: string;

  @IsOptional()
  @IsString()
  ownerId?: string;
}
