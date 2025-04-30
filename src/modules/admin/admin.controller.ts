import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  
  @Get('dashboard')
  @Roles('admin')
  getDashboard() {
    return { message: "Bienvenue sur le panneau d'administration" };
  }
  
  @Get('users')
  @Roles('admin')
  getUsers() {
    return { message: "Liste des utilisateurs pour l'admin" };
  }
}