import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Investment } from './entities/investment.entity';
import { InvestmentsService } from './investments.service';
import { InvestmentsController } from './investments.controller';
import { InvestmentsRepository } from './investments.repository';
import { ProjectsRepository } from '../projects/projects.repository';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Investment, Project, User]),
    UsersModule
  ],
  controllers: [InvestmentsController],
  providers: [InvestmentsService, InvestmentsRepository, ProjectsRepository],
  exports: [InvestmentsService, InvestmentsRepository]
})
export class InvestmentsModule {}
