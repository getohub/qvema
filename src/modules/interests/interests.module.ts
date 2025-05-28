import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterestsService } from './interests.service';
import { InterestsController } from './interests.controller';
import { Interest } from './entities/interest.entity';
import { InterestsRepository } from './interests.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interest]),
    UsersModule
  ],
  controllers: [InterestsController],
  providers: [InterestsService, InterestsRepository],
  exports: [InterestsService, InterestsRepository],
})
export class InterestsModule {}