import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { InvestmentsService } from '../investments/investments.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly investmentsService: InvestmentsService,
  ) {}
  
  @Get('dashboard')
  @Roles(UserRole.ADMIN)
  getDashboard() {
    return { message: "Bienvenue sur le panneau d'administration" };
  }
  
  @Get('users')
  @Roles(UserRole.ADMIN)
  async getUsers() {
    return this.usersService.findAll();
  }
  @Delete('users/:id')
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { message: `User ${id} has been deleted` };
  }
  @Get('investments')
  @Roles(UserRole.ADMIN)
  async getAllInvestments() {
    return this.investmentsService.findAll();
  }
}