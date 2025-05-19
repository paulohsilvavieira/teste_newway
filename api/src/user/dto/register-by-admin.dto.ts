import { UserRole } from '@/database/utils/user.role';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class RegisterByAdminDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: UserRole,
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
