import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePacientDto, UpdatePacientDto } from 'src/view/dto';
import { PacientEntity } from 'src/context/entity';

@Injectable()
export class PacientService {
  constructor(private repository: PacientEntity) {}

  async createPacient(
    input: CreatePacientDto,
    hospital: string,
    userType: string,
  ): Promise<any> {
    try {
      await this.repository.create(hospital, input, userType);
      return 'Paciente Created';
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error creating patient',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllPacients(hospital: string, userType: string): Promise<any> {
    try {
      return await this.repository.findAll(hospital, userType);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error getting pacients',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPacientById(
    id: string,
    hospital: string,
    userType: string,
  ): Promise<any> {
    try {
      const patient = await this.repository.findById(hospital, id);
      if (!patient) {
        throw new HttpException(
          'Paciente não encontrado',
          HttpStatus.NOT_FOUND,
        );
      }
      return patient;
    } catch (error) {
      if (
        error instanceof HttpException &&
        error.getStatus() === HttpStatus.NOT_FOUND
      ) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error getting pacient',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePacient(
    id: string,
    input: UpdatePacientDto,
    hospital: string,
    userType: string,
  ): Promise<any> {
    try {
      await this.repository.update(hospital, id, input, userType);
      return 'Paciente Updated';
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error updating patient',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deletePacient(
    id: string,
    hospital: string,
    userType: string,
  ): Promise<any> {
    try {
      await this.repository.delete(hospital, id);
      return 'Paciente Deleted';
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error deleting pacient',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
