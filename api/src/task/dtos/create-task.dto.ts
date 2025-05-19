import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTaskDTO {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  description: string;

  user: { email: string; id: number; role: string };
}
