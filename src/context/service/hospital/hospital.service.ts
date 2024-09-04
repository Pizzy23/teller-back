import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class HospitalService {
  constructor(private readonly httpService: HttpService) {}

  async getHospitalByName(name: string): Promise<any> {
    try {
      const response = await lastValueFrom(this.httpService.get(`${process.env.API_URL}/hospital/name/${name}`));
      return response.data;
    } catch (error) {
      throw new HttpException('Hospital not found', HttpStatus.NOT_FOUND);
    }
  }
}
