import { IsNotEmpty, IsNumber, IsString, IsPositive } from 'class-validator';

export class CreateInvestmentDto {
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;
}
