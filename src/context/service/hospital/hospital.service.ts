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
      let token = this.cognitoStrategy.getToken();

      // Verifique se o token está presente
      if (!token) {
        throw new HttpException(
          'Token not found or invalid',
          HttpStatus.UNAUTHORIZED,
        );
      }

      token = 'Bearer ' + token;

      const response = await lastValueFrom(
        this.httpService.get(`${process.env.API_URL}/hospital/find/${name}`, {
          headers: {
            Authorization: token,
          },
        }),
      );

      switch (response.status) {
        case 200:
          console.log('200: Success');
          break;
        case 401:
          console.log('401: Unauthorized');
          break;
        case 404:
          console.log('404: Not Found');
          break;
        case 500:
          console.log('500: Internal Server Error');
          break;
        default:
          console.log(`${response.status}: Unexpected response status`);
      }

      return response.data;
    } catch (error) {
      console.error('Error in getHospitalByName:', error);

      if (error.response && error.response.status) {
        if (error.response.status === 401) {
          throw new HttpException(
            'Unauthorized access',
            HttpStatus.UNAUTHORIZED,
          );
        } else if (error.response.status === 404) {
          throw new HttpException('Hospital not found', HttpStatus.NOT_FOUND);
        }
      }

      throw new HttpException(
        'An error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
