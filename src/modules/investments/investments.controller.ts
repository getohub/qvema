import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('investments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}
  @Post()
  @Roles(UserRole.INVESTOR)
  async createInvestment(
    @Body() createInvestmentDto: CreateInvestmentDto,
    @Request() req
  ) {
    return this.investmentsService.create(createInvestmentDto, req.user.userId);
  }  @Get()
  async findAll(@Request() req) {
    const userId = req.user.userId;
    const userRole = req.user.role;
    
    if (userRole === UserRole.ADMIN) {
      return this.investmentsService.findAll();
    } else if (userRole === UserRole.INVESTOR) {
      return this.investmentsService.findByInvestor(userId);
    }
    
    return [];
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.investmentsService.findOne(id);
  }
  @Delete(':id')
  async deleteInvestment(
    @Param('id') id: string,
    @Request() req
  ) {
    return this.investmentsService.remove(id, req.user.userId);
  }
  @Get('project/:id')
  async getInvestmentsByProject(
    @Param('id') projectId: string,
    @Request() req
  ) {
    return this.investmentsService.findByProject(projectId, req.user.userId);
  }

  @Get('project/:projectId/stats')
  async getProjectStats(
    @Param('projectId') projectId: string,
    @Request() req
  ) {
    return this.investmentsService.getProjectStats(projectId);
  }
}
