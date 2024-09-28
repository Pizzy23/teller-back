import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../../config';
import { Prisma, PrismaClient } from '@prisma/client';
import { HospitalService } from 'src/context/service/hospital/hospital.service';
import { DepartamentDto } from 'src/view/dto';

@Injectable()
export class DepartamentEntity {
  constructor(
    private prisma: PrismaService,
    private hospitalService: HospitalService,
  ) {}

  async create(hospital: string, input: DepartamentDto) {
    const prisma = await this.setDatabase(hospital);

    const departmentData: Prisma.DepartmentCreateInput = {
      title: input.departament,
      side: input.side,  
    };

    await prisma.department.create({
      data: departmentData,
    });
  }

  async findAll(hospital: string) {
    const prisma = await this.setDatabase(hospital);

    return prisma.department.findMany({});
  }

  async findById(hospital: string, id: string) {
    const prisma = await this.setDatabase(hospital);

    const department = await prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      throw new HttpException('Departamento não encontrado', HttpStatus.NOT_FOUND);
    }

    return department;
  }

  async update(hospital: string, id: string, input: DepartamentDto) {
    const prisma = await this.setDatabase(hospital);

    const updateData: Prisma.DepartmentUpdateInput = {
      title: input.departament,
      side: input.side,  
    };

    await prisma.department.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(hospital: string, id: string) {
    const prisma = await this.setDatabase(hospital);

    await prisma.department.delete({
      where: { id },
    });
  }

  private async setDatabase(hospital: string): Promise<PrismaClient> {
    const hospitalData = await this.hospitalService.getHospitalByName(hospital);
    if (!hospitalData) {
      throw new HttpException('Invalid hospital', HttpStatus.BAD_REQUEST);
    }
  
    const databaseUrl = `postgres://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/teller?schema=${hospitalData.DBName}`;

    return await this.prisma.setDatabaseUrl(databaseUrl);
  }
}
