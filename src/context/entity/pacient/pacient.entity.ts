import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { PrismaService } from '../../../config';
import { CreatePacientDto, UpdatePacientDto } from 'src/view/dto';
import { Prisma, PrismaClient } from '@prisma/client';
import { HospitalService } from 'src/context/service/hospital/hospital.service';
import { CognitoStrategy } from 'src/config/middleware/cognito.strategy';
@Injectable()
export class PacientEntity {
  constructor(
    private prisma: PrismaService,
    private hospitalService: HospitalService,
    @Inject(CognitoStrategy) private readonly cognitoStrategy: CognitoStrategy, 
  ) {}

  async create(hospital: string, input: CreatePacientDto) {
    const prisma = await this.setDatabase(hospital);
  
    const userSides = this.cognitoStrategy.getSides();
  
    if (!userSides || !userSides.includes(`side-${hospital}-${input.departmentId}`)) {
      throw new Error('Access denied to the department');
    }
  
    const professionsArray = this.cognitoStrategy.getProfessions();
    const professions = professionsArray ? professionsArray.join(', ') : ''; // Converte o array em string
  
    if (!input.departmentId) {
      throw new Error('Department ID is missing');
    }
  
    const department = await prisma.department.findUnique({
      where: { id: input.departmentId },
    });
  
    if (!department) {
      throw new Error('Department not found');
    }
  
    const patientData: Prisma.PatientCreateInput = {
      fullName: input.fullName,
      medicalRecordNumber: input.medicalRecordNumber,
      birthDate: new Date(input.birthDate),
      status: input.status,
      exams: input.exams,
      watcher: input.watcher,
      medicalBackGround: input.medicalBackGround,
      gender: input.gender,
      medicalBed: input.medicalBed,
      lastUpdater: input.lastUpdater,
      dateOfAdmission: new Date(input.dateOfAdmission),
      heartBeat: input.heartBeat,
      fluidBalance: input.fluidBalance,
      respoiratoryRate: input.respoiratoryRate,
      arterialPressure: input.arterialPressure,
      oxygenSaturation: input.oxygenSaturation,
      doctorType: professions, 
      department: {
        connect: { id: input.departmentId },
      },
      impressions: {
        create: input.impressions.map((imp) => ({
          content: imp.content,
          assignedTo: imp.assignedTo,
        })),
      },
      activeProblem: {
        create: input.activeProblem.map((ap) => ({
          description: ap.description,
          assignedTo: ap.assignedTo,
        })),
      },
      cultures: {
        create: input.cultures.map((culture) => ({
          material: culture.material,
          germs: culture.germs,
          collectionDate: culture.collectionDate,
        })),
      },
      devices: {
        create: input.devices.map((device) => ({
          name: device.name,
          applicationDate: device.applicationDate,
          removalDate: device.removalDate,
        })),
      },
      pendencies: {
        create: input.pendencies.map((pendency) => ({
          title: pendency.title,
          completed: pendency.completed,
          removed: pendency.removed,
          assignedTo: pendency.assignedTo,
        })),
      },
      antibiotics: {
        create: input.antibiotics.map((antibiotic) => ({
          name: antibiotic.name,
          applicationDate: antibiotic.applicationDate,
          removalDate: antibiotic.removalDate,
        })),
      },
      bloodGlucose: {
        create: input.bloodGlucose.map((bg) => ({
          title: bg.title,
          creationDate: bg.creationDate,
        })),
      },
    };
  
    await prisma.patient.create({
      data: patientData,
    });
  }
  

  async findAll(hospital: string) {
    const prisma = await this.setDatabase(hospital);
    
    const professionsArray = this.cognitoStrategy.getProfessions();
  
    if (!professionsArray || professionsArray.length === 0) {
      return [];
    }
  
    const professionFilters = professionsArray.map((profession) => ({
      doctorType: {
        contains: profession,
      },
    }));
  
    const results = await prisma.patient.findMany({
      where: {
        OR: professionFilters,
      },
      include: {
        activeProblem: true,
        department: true,
        cultures: true,
        devices: true,
        pendencies: true,
        antibiotics: true,
        impressions: true,
        bloodGlucose: true,
      },
    });
  
    return results;
  }
  
  

  async findById(hospital: string, id: string) {
    const prisma = await this.setDatabase(hospital);

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        activeProblem: true,
        department: true,
        cultures: true,
        devices: true,
        pendencies: true,
        antibiotics: true,
        impressions: true,
        bloodGlucose: true,
      },
    });

    if (!patient) {
      throw new HttpException('Paciente não encontrado', HttpStatus.NOT_FOUND);
    }

    return patient;
  }

  async update(
    hospital: string,
    id: string,
    input: UpdatePacientDto,
    userType: string,
  ) {
    const prisma = await this.setDatabase(hospital);

    const currentData = await prisma.patient.findUnique({ where: { id } });

    if (!currentData) {
      throw new Error('Paciente não encontrado');
    }

    const updateData: Prisma.PatientUpdateInput = {
      fullName:
        input.fullName !== currentData.fullName
          ? input.fullName
          : currentData.fullName,
      medicalRecordNumber:
        input.medicalRecordNumber !== currentData.medicalRecordNumber
          ? input.medicalRecordNumber
          : currentData.medicalRecordNumber,
      birthDate: input.birthDate
        ? new Date(input.birthDate)
        : currentData.birthDate,
      status:
        input.status !== currentData.status ? input.status : currentData.status,
      exams:
        input.exams !== currentData.exams ? input.exams : currentData.exams,
      watcher:
        input.watcher !== currentData.watcher
          ? input.watcher
          : currentData.watcher,
      medicalBackGround:
        input.medicalBackGround !== currentData.medicalBackGround
          ? input.medicalBackGround
          : currentData.medicalBackGround,
      gender:
        input.gender !== currentData.gender ? input.gender : currentData.gender,
      medicalBed:
        input.medicalBed !== currentData.medicalBed
          ? input.medicalBed
          : currentData.medicalBed,
      lastUpdater:
        input.lastUpdater !== currentData.lastUpdater
          ? input.lastUpdater
          : currentData.lastUpdater,
      doctorType:
        userType !== currentData.doctorType ? userType : currentData.doctorType,
      dateOfAdmission: input.dateOfAdmission
        ? new Date(input.dateOfAdmission)
        : currentData.dateOfAdmission,
      heartBeat:
        input.heartBeat !== currentData.heartBeat
          ? input.heartBeat
          : currentData.heartBeat,
      fluidBalance:
        input.fluidBalance !== currentData.fluidBalance
          ? input.fluidBalance
          : currentData.fluidBalance,
      respoiratoryRate:
        input.respoiratoryRate !== currentData.respoiratoryRate
          ? input.respoiratoryRate
          : currentData.respoiratoryRate,
      arterialPressure:
        input.arterialPressure !== currentData.arterialPressure
          ? input.arterialPressure
          : currentData.arterialPressure,
      oxygenSaturation:
        input.oxygenSaturation !== currentData.oxygenSaturation
          ? input.oxygenSaturation
          : currentData.oxygenSaturation,

      impressions: input.impressions
        ? {
            create: input.impressions.map((imp) => ({
              content: imp.content,
              assignedTo: imp.assignedTo,
            })),
          }
        : undefined,

      activeProblem: input.activeProblem
        ? {
            create: input.activeProblem.map((ap) => ({
              description: ap.description,
              assignedTo: ap.assignedTo,
            })),
          }
        : undefined,

      cultures: input.cultures
        ? {
            create: input.cultures.map((culture) => ({
              material: culture.material,
              germs: culture.germs,
              collectionDate: culture.collectionDate,
            })),
          }
        : undefined,

      devices: input.devices
        ? {
            create: input.devices.map((device) => ({
              name: device.name,
              applicationDate: device.applicationDate,
              removalDate: device.removalDate,
            })),
          }
        : undefined,

      pendencies: input.pendencies
        ? {
            create: input.pendencies.map((pendency) => ({
              title: pendency.title,
              completed: pendency.completed,
              removed: pendency.removed,
              assignedTo: pendency.assignedTo,
            })),
          }
        : undefined,

      antibiotics: input.antibiotics
        ? {
            create: input.antibiotics.map((antibiotic) => ({
              name: antibiotic.name,
              applicationDate: antibiotic.applicationDate,
              removalDate: antibiotic.removalDate,
            })),
          }
        : undefined,

      bloodGlucose: input.bloodGlucose
        ? {
            create: input.bloodGlucose.map((bg) => ({
              title: bg.title,
              creationDate: bg.creationDate,
            })),
          }
        : undefined,
    };

    await prisma.patient.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(hospital: string, id: string) {
    const prisma = await this.setDatabase(hospital);

    await prisma.impression.deleteMany({ where: { patientId: id } });
    await prisma.activeProblem.deleteMany({ where: { patientId: id } });
    await prisma.culture.deleteMany({ where: { patientId: id } });
    await prisma.device.deleteMany({ where: { patientId: id } });
    await prisma.pendencie.deleteMany({ where: { patientId: id } });
    await prisma.antibiotic.deleteMany({ where: { patientId: id } });
    await prisma.bloodGlucose.deleteMany({ where: { patientId: id } });

    await prisma.patient.delete({
      where: { id },
    });
  }

  private async setDatabase(hospital: string): Promise<PrismaClient> {
    const hospitalData = await this.hospitalService.getHospitalByName(hospital);
    if (!hospitalData) {
      throw new HttpException('Invalid hospital', HttpStatus.BAD_REQUEST);
    }

    console.log(`Usando o esquema: ${hospitalData.DBName}`);
  
    const databaseUrl = `postgres://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${hospitalData.DBName}`;
    console.log(`Database URL: ${databaseUrl}`);
    return await this.prisma.setDatabaseUrl(databaseUrl);
  }
}
