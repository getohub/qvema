import { DataSource } from "typeorm";
import { User } from "./modules/users/entities/user.entity";

const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 3306,
    username: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'qvema',
    entities: [User],
    migrations: ['src/migrations/*.ts'],
    synchronize: true,  // synchronise la base de données (à désactiver en production)
});

export default dataSource;