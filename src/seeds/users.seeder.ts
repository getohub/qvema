import { Seeder } from '@jorgebodega/typeorm-seeding';
import { DataSource } from 'typeorm';
import { User, UserRole } from '../modules/users/entities/user.entity';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

export default class CreateUsers implements Seeder {

    public async run(dataSource: DataSource): Promise<void> {
        const users: Partial<User>[] = []; 

        users.push({
            name: 'Admin',
            email: 'admin@qvema.com',
            password: await bcrypt.hash('admin123', 10),
            role: UserRole.ADMIN,
        });

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