// src/hospital/hospital.service.ts
import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { CognitoStrategy } from 'src/config/middleware/cognito.strategy';
import * as dotenv from 'dotenv';

dotenv.config(); // Carregar as variáveis do .env

@Injectable()
export class HospitalService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CognitoStrategy) private readonly cognitoStrategy: CognitoStrategy,
  ) {}

  async getHospitalByName(name: string): Promise<any> {
    try {
      const username = process.env.COGNITO_USERNAME;
      const password = process.env.COGNITO_PASSWORD;

      const token = await this.cognitoStrategy.createToken(username, password);

      const response = await lastValueFrom(
        this.httpService.get(`${process.env.API_URL}/hospital/name/${name}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException('Hospital not found', HttpStatus.NOT_FOUND);
    }
  }
}
