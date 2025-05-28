import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { InterestsRepository } from './interests.repository';
import { Interest } from './entities/interest.entity';
import { UserInterestsDto } from './dto/user-interests.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { In } from 'typeorm';

@Injectable()
export class InterestsService {
  constructor(
    private interestsRepository: InterestsRepository,
    private usersService: UsersService,
  ) {}

  async create(createInterestDto: CreateInterestDto): Promise<Interest> {
    
    const existingInterest = await this.interestsRepository.findOneBy({ 
      name: createInterestDto.name 
    });
    
    if (existingInterest) {
      throw new BadRequestException(`Un intérêt avec le nom '${createInterestDto.name}' existe déjà`);
    }
    
    const interest = this.interestsRepository.create(createInterestDto);
    return this.interestsRepository.save(interest);
  }

  async findAll(): Promise<Interest[]> {
    return this.interestsRepository.find();
  }
  async findOne(id: string): Promise<Interest> {
    const interest = await this.interestsRepository.findOneBy({ id });
    if (!interest) {
      throw new NotFoundException(`Intérêt avec l'ID ${id} non trouvé`);
    }
    return interest;
  }

  async update(id: string, updateInterestDto: UpdateInterestDto): Promise<Interest> {
    const interest = await this.findOne(id);
    this.interestsRepository.merge(interest, updateInterestDto);
    return this.interestsRepository.save(interest);
  }

  async remove(id: string): Promise<void> {
    const result = await this.interestsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Intérêt avec l'ID ${id} non trouvé`);
    }
  }

  async addUserInterests(userId: string, userInterestsDto: UserInterestsDto): Promise<User> {
    const user = await this.usersService.findOne(userId);
    
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }
    
    const interests = await this.interestsRepository.findBy({
      id: In(userInterestsDto.interestIds)
    });
    
    if (interests.length !== userInterestsDto.interestIds.length) {
      throw new BadRequestException('Les intérêts n\'ont pas été trouvés');
    }
    
    user.interests = interests;    return this.usersService.updateWithPartialData(userId, user);
  }

  async getUserInterests(userId: string): Promise<Interest[]> {
    const user = await this.usersService.findOneWithRelations(userId, ['interests']);
    
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }
    
    return user.interests;
  }

  async getRecommendedProjects(userId: string): Promise<any[]> {
    const user = await this.usersService.findOneWithRelations(userId, ['interests']);
    
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }
    
    const userInterestIds = user.interests.map(interest => interest.id);
    
    if (userInterestIds.length === 0) {
      return [];
    }
    
    const recommendedProjects = await this.interestsRepository
      .createQueryBuilder('interest')
      .innerJoin('interest.projects', 'project')
      .innerJoin('project.owner', 'owner')
      .where('interest.id IN (:...ids)', { ids: userInterestIds })
      .select([
        'project.id', 
        'project.title', 
        'project.description', 
        'project.budget',
        'project.category',
        'owner.id',
        'owner.name'
      ])
      .groupBy('project.id')
      .orderBy('COUNT(interest.id)', 'DESC')
      .getMany();
    
    return recommendedProjects;
  }
}