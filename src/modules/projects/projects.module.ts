import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';
import { ProjectsRepository } from './projects.repository';
import { InterestsModule } from '../interests/interests.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    InterestsModule
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository],
  exports: [ProjectsService, ProjectsRepository],
})
export class ProjectsModule {}