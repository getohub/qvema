import { Seeder } from '@jorgebodega/typeorm-seeding';
import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { faker } from '@faker-js/faker';

export default class CreateUsers implements Seeder {

    public async run(dataSource: DataSource): Promise<void> {
        const users: Partial<User>[] = []; 

        for (let i=0; i < 10; i++) {
            users.push({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            });
        }

        await dataSource.getRepository(User).insert(users);
    }
}