import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreatePacientDto, UpdatePacientDto } from 'src/view/dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'expressC';
import { PacientService } from 'src/context/service';

@ApiTags('Pacient')
@Controller('/api/:hospital/pacient')
export class PacientController {
  constructor(private readonly service: PacientService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new pacient' })
  @ApiParam({
    name: 'hospital',
    description: 'Hospital identifier',
    required: true,
  })
  @ApiBody({ type: CreatePacientDto, description: 'Pacient details' })
  @Post('/')
  async createPacient(
    @Param('hospital') hospital: string,
    @Body() input: CreatePacientDto,
    @Req() req: Request,
  ): Promise<void> {
    const userType = req.user?.type;
    return this.service.createPacient(input, hospital, userType);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all pacients' })
  @ApiParam({
    name: 'hospital',
    description: 'Hospital identifier',
    required: true,
  })
  @Get('/')
  async getAllPacients(
    @Param('hospital') hospital: string,
    @Req() req: Request,
  ): Promise<any> {
    const userType = req.user?.type;
    return this.service.getAllPacients(hospital, userType);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get a pacient by ID' })
  @ApiParam({
    name: 'hospital',
    description: 'Hospital identifier',
    required: true,
  })
  @ApiParam({ name: 'id', description: 'Pacient ID', required: true })
  @Get('/:id')
  async getPacientById(
    @Param('hospital') hospital: string,
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<any> {
    const userType = req.user?.type;
    return this.service.getPacientById(id, hospital, userType);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a pacient' })
  @ApiParam({
    name: 'hospital',
    description: 'Hospital identifier',
    required: true,
  })
  @ApiParam({ name: 'id', description: 'Pacient ID', required: true })
  @ApiBody({ type: UpdatePacientDto, description: 'Updated pacient details' })
  @Put('/:id')
  async updatePacient(
    @Param('hospital') hospital: string,
    @Param('id') id: string,
    @Body() input: UpdatePacientDto,
    @Req() req: Request,
  ): Promise<void> {
    const userType = req.user?.type;
    return this.service.updatePacient(id, input, hospital, userType);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a pacient' })
  @ApiParam({
    name: 'hospital',
    description: 'Hospital identifier',
    required: true,
  })
  @ApiParam({ name: 'id', description: 'Pacient ID', required: true })
  @Delete('/:id')
  async deletePacient(
    @Param('hospital') hospital: string,
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<void> {
    const userType = req.user?.type;
    return this.service.deletePacient(id, hospital, userType);
  }
}
