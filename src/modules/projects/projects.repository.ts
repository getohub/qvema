import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsRepository extends Repository<Project> {
    constructor(private dataSource: DataSource) {
        super(Project, dataSource.createEntityManager());
    }

    async findByOwnerId(ownerId: number): Promise<Project[]> {
        return this.find({ where: { ownerId } });
    }

    async createProject(projectData: Partial<Project>): Promise<Project> {
        const project = this.create(projectData);
        return this.save(project);
    }
    
    async updateProject(id: string, projectData: Partial<Project>): Promise<Project | null> {
        await this.update(id, projectData);
        return this.findOneBy({ id });
    }
}