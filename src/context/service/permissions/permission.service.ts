import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HospitalService } from '../hospital/hospital.service';

@Injectable()
export class PermissionService {
  constructor(private hospitalService: HospitalService) {}

  async validatePermission(hospital: string, role: string): Promise<void> {
    const hospitalData = await this.hospitalService.getHospitalByName(hospital);

    if (!hospitalData) {
      throw new HttpException('Hospital não encontrado', HttpStatus.BAD_REQUEST);
    }

    const allowedRoles = hospitalData.allowedRoles || [];

    if (!allowedRoles.includes(role)) {
      throw new HttpException(`Permissão negada para o cargo: ${role}`, HttpStatus.FORBIDDEN);
    }
  }
}
