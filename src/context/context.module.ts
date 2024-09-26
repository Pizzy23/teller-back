import { Controller, Module } from '@nestjs/common';
import { PrismaService } from 'src/config';
import { PacientEntity } from './entity';
import { PacientController } from './controller';
import { DepartamentService, PacientService } from './service';
import { HospitalService } from './service/hospital/hospital.service';
import { PermissionService } from './service/permissions/permission.service';
import { HttpModule } from '@nestjs/axios';
import { DepartamentController } from './controller/departament/departament.controller';
import { DepartamentEntity } from './entity/departament/departament.entity';
import { CognitoStrategy } from 'src/config/middleware/cognito.strategy';

@Module({
  imports: [HttpModule],
  controllers: [PacientController, DepartamentController],
  providers: [
    PacientService,
    PacientEntity,
    PrismaService,
    HospitalService,
    PermissionService,
    DepartamentService,
    DepartamentEntity,
    CognitoStrategy,
  ],
  exports: [PrismaService],
})
export class ContextModule {}
