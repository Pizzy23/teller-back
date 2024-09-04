import {
  IsString,
  IsDate,
  IsEnum,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { StatusEnum, GenderEnum } from '@prisma/client';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class DepartamentDto {
  @ApiProperty({ example: 'UTI', description: 'Its a departament for modules' })
  @IsString()
  departament: string;

  @ApiProperty({ example: 'UTI', description: 'Its a module from hospital api' })
  @IsString()
  side: string
}
