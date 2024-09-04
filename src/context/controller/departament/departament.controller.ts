import { DepartamentService } from 'src/context/service';
import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { DepartamentDto } from 'src/view/dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Departament')
@Controller('/api/:hospital/departament') 
export class DepartamentController {
  constructor(private readonly service: DepartamentService) {}

  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new departament' })
  @ApiParam({ name: 'hospital', description: 'Hospital identifier', required: true })
  @ApiBody({ type: DepartamentDto, description: 'Departament details' })
  @Post('/')
  async createDepartament(@Param('hospital') hospital: string, @Body() input: DepartamentDto): Promise<void> {
    return this.service.Create(hospital, input);
  }

  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all departaments by hospital' })
  @ApiParam({ name: 'hospital', description: 'Hospital identifier', required: true })
  @Get('/')
  async getAllDepartaments(@Param('hospital') hospital: string): Promise<any> {
    return this.service.GetDepartament(hospital);
  }

  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get a departament by ID' })
  @ApiParam({ name: 'hospital', description: 'Hospital identifier', required: true })
  @ApiParam({ name: 'id', description: 'Departament ID', required: true })
  @Get('/:id')
  async getDepartamentById(@Param('hospital') hospital: string, @Param('id') id: string): Promise<any> {
    return this.service.GetDepartamentByName(hospital, id);
  }

  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a departament by ID' })
  @ApiParam({ name: 'hospital', description: 'Hospital identifier', required: true })
  @ApiParam({ name: 'id', description: 'Departament ID', required: true })
  @Delete('/:id')
  async deleteDepartament(@Param('hospital') hospital: string, @Param('id') id: string): Promise<void> {
    return this.service.Delete(hospital, id);
  }
}
