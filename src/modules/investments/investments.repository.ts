import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Investment } from './entities/investment.entity';

@Injectable()
export class InvestmentsRepository extends Repository<Investment> {
  constructor(private dataSource: DataSource) {
    super(Investment, dataSource.createEntityManager());
  }
  async findByInvestorId(investorId: string): Promise<Investment[]> {
    return this.find({
      where: { investorId },
      relations: ['project', 'investor']
    });
  }

  async findByProjectId(projectId: string): Promise<Investment[]> {
    return this.find({
      where: { projectId },
      relations: ['project', 'investor']
    });
  }

  async createInvestment(investmentData: Partial<Investment>): Promise<Investment> {
    const investment = this.create(investmentData);
    return this.save(investment);
  }

  async getTotalInvestedInProject(projectId: string): Promise<number> {
    const result = await this.createQueryBuilder('investment')
      .select('SUM(investment.amount)', 'total')
      .where('investment.projectId = :projectId', { projectId })
      .getRawOne();
    
    return parseFloat(result.total) || 0;
  }
}
