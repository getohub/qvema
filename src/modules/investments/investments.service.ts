import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { InvestmentsRepository } from './investments.repository';
import { ProjectsRepository } from '../projects/projects.repository';
import { Investment } from './entities/investment.entity';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { In } from 'typeorm';

@Injectable()
export class InvestmentsService {
  constructor(
    private investmentsRepository: InvestmentsRepository,
    private projectsRepository: ProjectsRepository,
    private usersService: UsersService,
  ) {}
  async create(createInvestmentDto: CreateInvestmentDto, investorId: string): Promise<Investment> {
    const investor = await this.usersService.findOne(investorId);
    if (!investor) {
      throw new NotFoundException(`Utilisateur avec l'ID ${investorId} non trouvé`);
    }
    if (investor.role !== UserRole.INVESTOR) {
      throw new ForbiddenException('Seuls les investisseurs peuvent effectuer des investissements');
    }

    const project = await this.projectsRepository.findOneBy({ id: createInvestmentDto.projectId });
    if (!project) {
      throw new NotFoundException(`Project with ID ${createInvestmentDto.projectId} not found`);
    }

    if (project.ownerId === investorId) {
      throw new ForbiddenException('Vous ne pouvez pas investir dans votre propre projet');
    }

    if (createInvestmentDto.amount <= 0) {
      throw new BadRequestException('Investment amount must be positive');
    }

    return this.investmentsRepository.createInvestment({
      ...createInvestmentDto,
      investorId,
    });
  }
  async createInvestment(createInvestmentDto: CreateInvestmentDto, investorId: string): Promise<Investment> {
    return this.create(createInvestmentDto, investorId);
  }

  async findByInvestor(investorId: string): Promise<Investment[]> {
    return this.investmentsRepository.findByInvestorId(investorId);
  }

  async findByInvestorId(investorId: string): Promise<Investment[]> {
    return this.findByInvestor(investorId);
  }

  async findByEntrepreneur(entrepreneurId: string): Promise<Investment[]> {
    const projects = await this.projectsRepository.find({
      where: { ownerId: entrepreneurId }
    });

    const projectIds = projects.map(project => project.id);
    
    if (projectIds.length === 0) {
      return [];
    }

    return this.investmentsRepository.find({
      where: { projectId: In(projectIds) },
      relations: ['project', 'investor']
    });
  }

  async findByProject(projectId: string, userId: string): Promise<Investment[]> {
    const project = await this.projectsRepository.findOneBy({ id: projectId });
    if (!project) {
      throw new NotFoundException(`Projet avec l'ID ${projectId} non trouvé`);
    }

    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    // l'utilisateur peut voir les investissements s'il est :
    // - le propriétaire du projet
    // - un admin
    // - un investisseur qui a investi dans ce projet
    const isOwner = project.ownerId === userId;
    const isAdmin = user.role === UserRole.ADMIN;
    
    if (!isOwner && !isAdmin) {
      const userInvestments = await this.investmentsRepository.find({
        where: { projectId, investorId: userId }
      });
      
      if (userInvestments.length === 0) {
        throw new ForbiddenException("Vous n'êtes pas autorisé à voir les investissements pour ce projet");
      }
    }

    return this.investmentsRepository.findByProjectId(projectId);
  }

  async findByProjectId(projectId: string, userId: string, userRole: string): Promise<Investment[]> {
    return this.findByProject(projectId, userId);
  }

  async findOne(id: string): Promise<Investment> {
    const investment = await this.investmentsRepository.findOne({
      where: { id },
      relations: ['project', 'investor']
    });
    
    if (!investment) {
      throw new NotFoundException(`Investissement avec l'ID ${id} non trouvé`);
    }
    
    return investment;
  }
  async remove(id: string, userId: string): Promise<void> {
    const investment = await this.findOne(id);
    
    if (investment.investorId !== 
      userId) {
      throw new ForbiddenException('Vous ne pouvez annuler que vos propres investissements');
    }

    await this.investmentsRepository.delete(id);
  }

  async updateInvestment(id: string, updateInvestmentDto: UpdateInvestmentDto, userId: string, userRole: string): Promise<Investment> {
    const investment = await this.findOne(id);
    
    if (investment.investorId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à modifier cet investissement');
    }

    Object.assign(investment, updateInvestmentDto);
    return this.investmentsRepository.save(investment);
  }

  async deleteInvestment(id: string, userId: string, userRole: string): Promise<void> {
    const investment = await this.findOne(id);
    
    if (investment.investorId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à supprimer cet investissement');
    }

    await this.investmentsRepository.delete(id);
  }

  async getTotalInvestedInProject(projectId: string, userId: string, userRole: string): Promise<{ total: number }> {
    const project = await this.projectsRepository.findOneBy({ id: projectId });
    if (!project) {
      throw new NotFoundException(`Projet avec l'ID ${projectId} non trouvé`);
    }

    const user = await this.usersService.findOne(userId);
    const isOwner = project.ownerId === userId;
    const isAdmin = userRole === UserRole.ADMIN;
    
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à voir le total des investissements pour ce projet");
    }

    const investments = await this.investmentsRepository.find({
      where: { projectId }
    });

    const total = investments.reduce((sum, investment) => sum + investment.amount, 0);
    return { total };
  }

  async getProjectStats(projectId: string): Promise<{
    totalInvested: number;
    investorsCount: number;
    investments: Investment[];
  }> {
    const investments = await this.investmentsRepository.findByProjectId(projectId);
    const totalInvested = await this.investmentsRepository.getTotalInvestedInProject(projectId);
    
    const uniqueInvestors = new Set(investments.map(inv => inv.investorId));
    
    return {
      totalInvested,
      investorsCount: uniqueInvestors.size,
      investments
    };
  }

  async findAll(): Promise<Investment[]> {
    return this.investmentsRepository.find({
      relations: ['project', 'investor']
    });
  }
}
