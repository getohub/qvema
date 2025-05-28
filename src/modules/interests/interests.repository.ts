import { Injectable } from '@nestjs/common';
import { DataSource, Repository, In } from 'typeorm';
import { Interest } from './entities/interest.entity';

@Injectable()
export class InterestsRepository extends Repository<Interest> {
  constructor(private dataSource: DataSource) {
    super(Interest, dataSource.createEntityManager());
  }

  async findByIds(ids: number[]): Promise<Interest[]> {
    return this.findBy({ id: In(ids) });
  }
}