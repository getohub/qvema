import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';


@Injectable()
export class UsersRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.findOne({ where: { email } });
    }

    async findActiveUsers(): Promise<User[]> {
        return this.createQueryBuilder('user')
        .where('user.isActive = :isActive', { isActive: true })
        .getMany();
    }
    
    async createUser(userData: Partial<User>): Promise<User> {
        const user = this.create(userData);
        return this.save(user);
    }
      async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
        await this.update(id, userData);
        return this.findOneBy({ id });
    }
}