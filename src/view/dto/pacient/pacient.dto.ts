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

export enum RemovedPendencieEnum {
  NAN = 'NAN',
  HUMAN_ERROR = 'HUMAN_ERROR',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  CHANGE_OF_CONDUCT = 'CHANGE_OF_CONDUCT',
}

export class CultureDto {
  @ApiProperty({ example: 'Blood', description: 'Material of the culture' })
  @IsString()
  material: string;

  @ApiProperty({
    example: ['E. coli'],
    description: 'Germs found in the culture',
    isArray: true,
  })
  @IsString({ each: true })
  germs: string[];

  @ApiProperty({
    example: '2024-08-17',
    description: 'Collection date of the culture',
    type: 'string',
    format: 'date-time',
  })
  @IsString()
  collectionDate: string;
}

export class DeviceDto {
  @ApiProperty({ example: 'Ventilator', description: 'Name of the device' })
  @IsString()
  name: string;

  @ApiProperty({
    example: '2024-08-01',
    description: 'Application date of the device',
    type: 'string',
    format: 'date-time',
  })
  @IsString()
  applicationDate: string;

  @ApiProperty({
    example: '2024-08-10',
    description: 'Removal date of the device',
    type: 'string',
    format: 'date-time',
  })
  @IsString()
  removalDate: string;
}

export class PendencieDto {
  @ApiProperty({
    example: 'Verify blood pressure',
    description: 'Title of the pendencie',
  })
  @IsString()
  title: string;

  @ApiProperty({ example: true, description: 'Is the pendencie completed?' })
  @IsBoolean()
  completed: boolean;

  @ApiProperty({
    example: 'HUMAN_ERROR',
    description: 'Reason for removal',
    enum: RemovedPendencieEnum,
  })
  @IsEnum(RemovedPendencieEnum)
  removed: RemovedPendencieEnum;

  @ApiProperty({ example: 'Dr. Jane Doe', description: 'Assigned to person' })
  @IsString()
  assignedTo: string;
}

export class AntibioticDto {
  @ApiProperty({
    example: 'Amoxicillin',
    description: 'Name of the antibiotic',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '2024-08-01',
    description: 'Application date of the antibiotic',
    type: 'string',
    format: 'date-time',
  })
  @IsString()
  applicationDate: string;

  @ApiProperty({
    example: '2024-08-05',
    description: 'Removal date of the antibiotic',
    type: 'string',
    format: 'date-time',
  })
  @IsString()
  removalDate: string;
}

export class BloodGlucoseDto {
  @ApiProperty({
    example: 'Blood Glucose Test',
    description: 'Title of the blood glucose test',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: '2024-08-17',
    description: 'Creation date of the blood glucose test',
    type: 'string',
    format: 'date-time',
  })
  @IsString()
  creationDate: string;
}

export class ActiveProblemDto {
  @ApiProperty({ example: 'AP123', description: 'Active problem ID' })
  @IsString()
  id?: string;

  @ApiProperty({
    example: 'Hypertension',
    description: 'Description of the problem',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Dr. Smith', description: 'Assigned physician' })
  @IsString()
  assignedTo: string;
}

export class ImpressionDto {
  @ApiProperty({ example: 'IMP123', description: 'Impression ID' })
  @IsString()
  id?: string;

  @ApiProperty({
    example: 'Positive outlook',
    description: 'Content of the impression',
  })
  @IsString()
  content: string;

  @ApiProperty({ example: 'Dr. Jones', description: 'Assigned physician' })
  @IsString()
  assignedTo: string;
}

export class CreatePacientDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the pacient' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'MRN123456', description: 'Medical Record Number' })
  @IsString()
  medicalRecordNumber: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Birth date of the pacient',
    type: 'string',
    format: 'date-time',
  })
  @IsDate()
  birthDate: Date;

  @ApiProperty({
    example: StatusEnum.STABLE,
    description: 'Status of the pacient',
    enum: StatusEnum,
  })
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @ApiProperty({
    example: 'Routine checkup',
    description: 'Details of exams performed',
  })
  @IsString()
  exams: string;

  @ApiProperty({ example: true, description: 'Watcher status' })
  @IsBoolean()
  watcher: boolean;

  @ApiProperty({
    example: ['Hypertension', 'Diabetes'],
    description: 'Medical background details',
    isArray: true,
  })
  @IsString({ each: true })
  medicalBackGround: string[];

  @ApiProperty({
    example: GenderEnum.MASCULINO,
    description: 'Gender of the pacient',
    enum: GenderEnum,
  })
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiProperty({ example: 'B12', description: 'Medical bed identifier' })
  @IsString()
  medicalBed: string;

  @ApiProperty({
    example: 'Dr. Smith',
    description: 'Last updater of the record',
  })
  @IsString()
  lastUpdater: string;

  @ApiProperty({
    example: '2024-08-17',
    description: 'Date of admission',
    type: 'string',
    format: 'date-time',
  })
  @IsDate()
  dateOfAdmission: Date;

  @ApiProperty({ example: '72 bpm', description: 'Heart beat rate' })
  @IsString()
  heartBeat: string;

  @ApiProperty({ example: '500 ml', description: 'Fluid balance' })
  @IsString()
  fluidBalance: string;

  @ApiProperty({ example: '18 breaths/min', description: 'Respiratory rate' })
  @IsString()
  respoiratoryRate: string;

  @ApiProperty({ example: '120/80', description: 'Arterial pressure' })
  @IsString()
  arterialPressure: string;

  @ApiProperty({ example: '98%', description: 'Oxygen saturation' })
  @IsString()
  oxygenSaturation: string;

  @ApiProperty({
    type: [ActiveProblemDto],
    description: 'List of active problems',
  })
  @IsArray()
  @ValidateNested({ each: true })
  activeProblem: ActiveProblemDto[];

  @ApiProperty({ type: [ImpressionDto], description: 'List of impressions' })
  @IsArray()
  @ValidateNested({ each: true })
  impressions: ImpressionDto[];

  @ApiProperty({ example: 'D123', description: 'Department identifier' })
  @IsString()
  departmentId: string;

  @ApiProperty({ type: [CultureDto], description: 'List of cultures' })
  @IsArray()
  @ValidateNested({ each: true })
  cultures: CultureDto[];

  @ApiProperty({ type: [DeviceDto], description: 'List of devices' })
  @IsArray()
  @ValidateNested({ each: true })
  devices: DeviceDto[];

  @ApiProperty({ type: [PendencieDto], description: 'List of pendencies' })
  @IsArray()
  @ValidateNested({ each: true })
  pendencies: PendencieDto[];

  @ApiProperty({ type: [AntibioticDto], description: 'List of antibiotics' })
  @IsArray()
  @ValidateNested({ each: true })
  antibiotics: AntibioticDto[];

  @ApiProperty({ type: [BloodGlucoseDto], description: 'List of blood glucose tests' })
  @IsArray()
  @ValidateNested({ each: true })
  bloodGlucose: BloodGlucoseDto[];
}

export class UpdatePacientDto extends PartialType(CreatePacientDto) {}


