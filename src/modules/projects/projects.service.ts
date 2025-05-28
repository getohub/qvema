import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsRepository } from './projects.repository';
import { Project } from './entities/project.entity';
import { InterestsRepository } from '../interests/interests.repository';
import { In } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    private projectsRepository: ProjectsRepository,
    private interestsRepository: InterestsRepository
  ) {}

  async create(createProjectDto: CreateProjectDto, userId: string): Promise<Project> {
    const { interestIds, ...projectData } = createProjectDto;
    
    const project = await this.projectsRepository.createProject({
      ...projectData,
      ownerId: userId
    });
    
    if (interestIds && interestIds.length > 0) {
      const interests = await this.interestsRepository.findBy({ 
        id: In(interestIds) 
      });
      
      if (interests.length > 0) {
        project.interests = interests;
        await this.projectsRepository.save(project);
      }
    }
    
    return project;
  }

  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOneBy({ id });
    if (!project) {
      throw new NotFoundException(`Projet avec l'ID ${id} introuvable`);
    }
    return project;
  }
  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string, role: string): Promise<Project> {
    const project = await this.findOne(id);
    
    if (project.ownerId !== userId && role !== 'admin') {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à mettre à jour ce projet');
    }
    
    const { interestIds, ...projectData } = updateProjectDto;
    
    await this.projectsRepository.update(id, projectData);
    
    if (interestIds) {
      const projectWithRelations = await this.projectsRepository.findOne({
        where: { id },
        relations: ['interests']
      });
      
      if (!projectWithRelations) {
        throw new NotFoundException(`Projet avec l'ID ${id} introuvable`);
      }
      
      const interests = await this.interestsRepository.findBy({ 
        id: In(interestIds) 
      });
      
      projectWithRelations.interests = interests;
      await this.projectsRepository.save(projectWithRelations);
      
      return projectWithRelations;
    }
    
    const updatedProject = await this.projectsRepository.findOneBy({ id });
    if (!updatedProject) {
      throw new NotFoundException(`Projet avec l'ID ${id} introuvable après la mise à jour`);
    }
    return updatedProject;
  }

  async remove(id: string, userId: string, role: string): Promise<void> {
    const project = await this.findOne(id);
    
    if (project.ownerId !== userId && role !== 'admin') {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à supprimer ce projet');
    }
    
    await this.projectsRepository.delete(id);
  }
  async findProjectsByUser(userId: string): Promise<Project[]> {
    return this.projectsRepository.findByOwnerId(userId);
  }
}