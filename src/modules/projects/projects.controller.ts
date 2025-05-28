import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'entrepreneur')
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    return this.projectsService.create(createProjectDto, req.user.userId);
  }
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'entrepreneur')
  update(
    @Param('id') id: string, 
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req
  ) {
    return this.projectsService.update(id, updateProjectDto, req.user.userId, req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('entrepreneur', 'admin')
  remove(@Param('id') id: string, @Request() req) {
    return this.projectsService.remove(id, req.user.userId, req.user.role);
  }

  @Get('user/my-projects')
  @UseGuards(JwtAuthGuard)
  findUserProjects(@Request() req) {
    return this.projectsService.findProjectsByUser(req.user.userId);
  }
}