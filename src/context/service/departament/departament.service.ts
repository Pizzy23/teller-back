import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { stringify } from 'querystring';
import { DepartamentEntity } from 'src/context/entity/departament/departament.entity';
import { DepartamentDto } from 'src/view/dto';

@Injectable()
export class DepartamentService {
  constructor(private repository: DepartamentEntity) {}

  async GetDepartament(title: string): Promise<any> {
    try {
      const department = await this.repository.findAll(title);
      return department;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error Get Departament',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async GetDepartamentByName(hospital: string, id: string) {
    try {
      const dep = await this.repository.findById(hospital, id);
      if (!dep) {
        throw new HttpException('Departamento não encontrado', HttpStatus.NOT_FOUND);
      }
      return dep;
    } catch (error) {
      if (error instanceof HttpException && error.getStatus() === HttpStatus.NOT_FOUND) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      console.log(error);
      throw new HttpException(
        'Error Get Departament',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async Create(title: string, input: DepartamentDto): Promise<any> {
    try {
      return await this.repository.create(title, input);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error creating Departament',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async Delete(hospital: string, id: string) {
    try {
      await this.repository.delete(hospital, id);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error deleting Departament',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
