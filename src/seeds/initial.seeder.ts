import { DataSource } from 'typeorm';
import { User, UserRole } from '../modules/users/entities/user.entity';
import { Interest } from '../modules/interests/entities/interest.entity';
import { Project } from '../modules/projects/entities/project.entity';
import * as bcrypt from 'bcrypt';

export default class InitialSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const interestRepository = dataSource.getRepository(Interest);
    const projectRepository = dataSource.getRepository(Project);

    const interests = [
      { name: 'Technologie' },
      { name: 'Finance' },
      { name: 'Écologie' },
      { name: 'Santé' },
      { name: 'Éducation' },
      { name: 'E-commerce' },
      { name: 'IA et Machine Learning' },
      { name: 'Blockchain' }
    ];    const savedInterests: Interest[] = [];
    for (const interest of interests) {
      const existingInterest = await interestRepository.findOne({ where: { name: interest.name } });
      if (!existingInterest) {
        const newInterest = interestRepository.create(interest);
        savedInterests.push(await interestRepository.save(newInterest));
      } else {
        savedInterests.push(existingInterest);
      }
    }

    const users = [
      {
        name: 'Admin User',
        email: 'admin@qvema.com',
        password: await bcrypt.hash('admin123', 10),
        role: UserRole.ADMIN
      },
      {
        name: 'John Entrepreneur',
        email: 'john@entrepreneur.com',
        password: await bcrypt.hash('password123', 10),
        role: UserRole.ENTREPRENEUR
      },
      {
        name: 'Jane Investor',
        email: 'jane@investor.com',
        password: await bcrypt.hash('password123', 10),
        role: UserRole.INVESTOR
      },
      {
        name: 'Alice Tech',
        email: 'alice@tech.com',
        password: await bcrypt.hash('password123', 10),
        role: UserRole.ENTREPRENEUR
      },
      {
        name: 'Bob Finance',
        email: 'bob@finance.com',
        password: await bcrypt.hash('password123', 10),
        role: UserRole.INVESTOR
      }
    ];    const savedUsers: User[] = [];
    for (const userData of users) {
      const existingUser = await userRepository.findOne({ where: { email: userData.email } });
      if (!existingUser) {
        const user = userRepository.create(userData);
        const savedUser = await userRepository.save(user);
        savedUsers.push(savedUser);
      } else {
        savedUsers.push(existingUser);
      }
    }

    const entrepreneur1 = savedUsers.find(u => u.email === 'john@entrepreneur.com');
    const entrepreneur2 = savedUsers.find(u => u.email === 'alice@tech.com');
    const investor1 = savedUsers.find(u => u.email === 'jane@investor.com');
    const investor2 = savedUsers.find(u => u.email === 'bob@finance.com');

    if (entrepreneur1) {
      entrepreneur1.interests = [savedInterests[0], savedInterests[1]];
      await userRepository.save(entrepreneur1);
    }

    if (entrepreneur2) {
      entrepreneur2.interests = [savedInterests[0], savedInterests[6]];
      await userRepository.save(entrepreneur2);
    }

    if (investor1) {
      investor1.interests = [savedInterests[0], savedInterests[2], savedInterests[3]];
      await userRepository.save(investor1);
    }

    if (investor2) {
      investor2.interests = [savedInterests[1], savedInterests[7]];
      await userRepository.save(investor2);
    }

    const projects = [
      {
        title: 'Application FinTech Révolutionnaire',
        description: 'Une application mobile qui simplifie la gestion financière personnelle avec IA',
        budget: 75000,
        category: 'Finance',
        ownerId: entrepreneur1?.id
      },
      {
        title: 'Plateforme E-learning IA',
        description: 'Plateforme d\'apprentissage personnalisé utilisant l\'intelligence artificielle',
        budget: 120000,
        category: 'Éducation',
        ownerId: entrepreneur2?.id
      },
      {
        title: 'Solution IoT Écologique',
        description: 'Système de monitoring environnemental pour entreprises',
        budget: 90000,
        category: 'Écologie',
        ownerId: entrepreneur1?.id
      }
    ];

    for (const projectData of projects) {
      if (projectData.ownerId) {
        const existingProject = await projectRepository.findOne({ 
          where: { title: projectData.title } 
        });
        
        if (!existingProject) {
          const project = projectRepository.create(projectData);
          
          if (projectData.category === 'Finance') {
            project.interests = [savedInterests[1], savedInterests[0]];
          } else if (projectData.category === 'Éducation') {
            project.interests = [savedInterests[4], savedInterests[6]];
          } else if (projectData.category === 'Écologie') {
            project.interests = [savedInterests[2], savedInterests[0]];
          }
          
          await projectRepository.save(project);
        }
      }
    }
  }
}
