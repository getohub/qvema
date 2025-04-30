import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsRepository } from './projects.repository';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(private projectsRepository: ProjectsRepository) {}

  async create(createProjectDto: CreateProjectDto, userId: number): Promise<Project> {
    return this.projectsRepository.createProject({
      ...createProjectDto,
      ownerId: userId
    });
  }

  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOneBy({ id });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: number, role: string): Promise<Project> {
    const project = await this.findOne(id);
    
    // Vérifier si l'utilisateur est le propriétaire du projet
    if (project.ownerId !== userId && role !== 'admin') {
      throw new ForbiddenException('You are not authorized to update this project');
    }
    
    const updatedProject = await this.projectsRepository.updateProject(id, updateProjectDto);
    if (!updatedProject) {
      throw new NotFoundException(`Project with ID ${id} not found after update`);
    }
    return updatedProject;
  }

  async remove(id: string, userId: number, role: string): Promise<void> {
    const project = await this.findOne(id);
    
    // Vérifier si l'utilisateur est le propriétaire du projet ou un admin
    if (project.ownerId !== userId && role !== 'admin') {
      throw new ForbiddenException('You are not authorized to delete this project');
    }
    
    await this.projectsRepository.delete(id);
  }

  async findProjectsByUser(userId: number): Promise<Project[]> {
    return this.projectsRepository.findByOwnerId(userId);
  }
}