import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  budget: number;

  @IsNotEmpty()
  @IsString()
  category: string;
    @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interestIds?: string[];
}